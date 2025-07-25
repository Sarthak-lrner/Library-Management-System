// src/pages/Messages.tsx

import { useState, useEffect } from "react";
import api from "../../../Api/apiClient";
import { useAuth } from "../../../Auth/AuthProvider";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";


export const Messages = () => {
  const { isLoggedIn } = useAuth();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  // Pagination
  const [messagesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!isLoggedIn) return;

      try {
        setIsLoadingMessages(true);

        const response = await api.get("/api/messages/secure/user/messages", {
          params: {
            page: currentPage - 1,
            size: messagesPerPage,
          },
        });

        setMessages(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        setHttpError(error.message || "Something went wrong.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchUserMessages();
    window.scrollTo(0, 0);
  }, [isLoggedIn, currentPage]);

  if (isLoadingMessages) return <SpinnerLoading />;
  if (httpError) return <div className="container m-5"><p>{httpError}</p></div>;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A:</h5>
          {messages.map((message) => (
            <div key={message.id} className="card mt-2 shadow p-3 bg-body rounded">
              <h5>Case #{message.id}: {message.title}</h5>
              <h6>{message.userEmail}</h6>
              <p>{message.question}</p>
              <hr />
              <div>
                <h5>Response:</h5>
                {message.response && message.adminEmail ? (
                  <>
                    <h6>{message.adminEmail} (admin)</h6>
                    <p>{message.response}</p>
                  </>
                ) : (
                  <p><i>Pending response from administration. Please be patient.</i></p>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All questions you submit will be shown here</h5>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      )}
    </div>
  );
};
