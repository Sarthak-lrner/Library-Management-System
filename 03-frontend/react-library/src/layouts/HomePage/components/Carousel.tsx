import { ReturnBook } from "./ReturnBook";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import api from "../../../Api/apiClient";
import { useAuth } from "../../../Auth/AuthProvider";  // <-- import useAuth

export const Carousel = () => {
  const { isLoggedIn,accessToken } = useAuth(); // <-- get auth state

  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setHttpError(null);

        const response = await api.get("/api/books?page=0&size=9");

        const responseData = response.data._embedded?.books ?? [];

        const loadedBooks: BookModel[] = responseData.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          copies: book.copies,
          copiesAvailable: book.copiesAvailable,
          category: book.category,
          img: book.img,
        }));

        setBooks(loadedBooks);
      } catch (error: any) {
        setHttpError(error.response?.data?.message || error.message || "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [accessToken]);

  if (isLoading) return <SpinnerLoading />;
  if (httpError)
    return (
      <div className="container m-5">
        <p className="text-danger">{httpError}</p>
      </div>
    );

  // chunk books into groups of 3 for carousel
  const chunkSize = 3;
  const chunks = [];
  for (let i = 0; i < books.length; i += chunkSize) {
    chunks.push(books.slice(i, i + chunkSize));
  }

  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your next "I stayed up too late reading" book.</h3>
      </div>

      {/* Desktop Carousel */}
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5 d-none d-lg-block"
        data-bs-ride="carousel"
        data-bs-interval="false"
      >
        <div className="carousel-inner">
          {chunks.map((chunk, index) => (
            <div
              key={`carousel-item-${index}`}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="row d-flex justify-content-center align-items-center">
                {chunk.map((book) => (
                  <ReturnBook book={book} key={book.id} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Mobile View */}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          {books[7] ? <ReturnBook book={books[7]} key={books[7].id} /> : null}
        </div>
      </div>

      <div className="homepage-carousel-title mt-3">
        <Link className="btn btn-outline-secondary btn-lg" to="/search">
          View More
        </Link>
      </div>
    </div>
  );
};
