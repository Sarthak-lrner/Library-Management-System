import { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/AuthProvider";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import api from "../../../Api/apiClient";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import authService from "../../../Api/authService";

export const AdminMessages = () => {

    const { isLoggedIn } = useAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [messagesPerPage] = useState(5);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [btnSubmit, setBtnSubmit] = useState(false);


    useEffect(() => {
        const fetchClosedMessages = async () => {
            try {
                const response = await api.get(`/api/messages/secure/messages/closed`, {
                    params: {
                        closed: false,
                        page: currentPage - 1,
                        size: messagesPerPage
                    }
                });

                const messagesData = response.data;
                setMessages(messagesData.content);
                setTotalPages(messagesData.totalPages);
            } catch (error: any) {
                console.error("Error fetching closed messages:", error);
                setHttpError(error.message || "Something went wrong!");
            } finally {
                setIsLoadingMessages(false);
            }
        };

        fetchClosedMessages();
        window.scrollTo(0, 0);
    }, [currentPage, btnSubmit]);


    if (isLoadingMessages) {
        return <SpinnerLoading />
    }

    if (httpError) {
        return <div className="container m-5"> <p >
            {httpError}
        </p>
        </div>
    }

    async function submitResponseToQuestion(id: number, response: string) {
        if (!id || response.trim() === "") return;

        try {
            const accessToken = authService.getAccessToken();
            if (!accessToken) throw new Error("Not authenticated");

            const messageAdminRequestModel = new AdminMessageRequest(id, response);

            await api.put(
                "/api/messages/secure/admin/message",
                messageAdminRequestModel,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setBtnSubmit(prev => !prev); // refresh messages
        } catch (err) {
            console.error("Error submitting response:", err);
            alert("Failed to submit admin response.");
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='mt-3'>
            {messages.length > 0 ?
                <>
                    <h5>Pending Q/A: </h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion} />
                    ))}
                </>
                :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    );
}