import { useEffect, useState } from "react";
import axios from "axios";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [searchUrl, setSearchUrl] = useState("");

  const [categorySelection, setCategorySelection] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = `${process.env.REACT_APP_API_URL}/api/books`;
      let url = "";

      if (!searchUrl || searchUrl === "") {
        url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
      } else {
        url = baseUrl + searchUrl.replace("<pageNumber>", `${currentPage - 1}`);
      }

      try {
        setIsLoading(true);
        setHttpError(null);

        const response = await axios.get(url, {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        });

        const responseJson = response.data;
        const responseData = responseJson._embedded?.books ?? [];

        setTotalAmountOfBooks(responseJson.page.totalElements);
        setTotalPages(responseJson.page.totalPages);

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
        if (error.response && error.response.data) {
          setHttpError(error.response.data.message || "Error fetching books");
        } else {
          setHttpError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
    window.scrollTo(0, 0);
  }, [currentPage, booksPerPage, searchUrl]);

  const searchHandleChange = () => {
    setCurrentPage(1);
    if (search.trim() === "") {
      setSearchUrl("");
      setCategorySelection("All");
    } else {
      setSearchUrl(
        `/search/findByTitleContaining?title=${encodeURIComponent(
          search.trim()
        )}&page=<pageNumber>&size=${booksPerPage}`
      );
      setCategorySelection("All");
    }
  };

  const categoryField = (value: string) => {
    setCurrentPage(1);
    setSearch("");

    const lowerValue = value.toLowerCase();

    if (["fe", "be", "data", "devops"].includes(lowerValue)) {
      setCategorySelection(value);
      setSearchUrl(
        `/search/findByCategory?category=${encodeURIComponent(
          value
        )}&page=<pageNumber>&size=${booksPerPage}`
      );
    } else {
      setCategorySelection("All");
      setSearchUrl(`?page=${currentPage - 1}&size=${booksPerPage}`);
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const lastItem = Math.min(indexOfLastBook, totalAmountOfBooks);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) return <SpinnerLoading />;

  if (httpError)
    return (
      <div className="container m-5">
        <p className="text-danger">Error loading books: {httpError}</p>
      </div>
    );

  return (
    <div>
      <div className="container">
        <div className="row mt-5">
          <div className="col-6">
            <div className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn btn-outline-success"
                type="submit"
                onClick={searchHandleChange}
              >
                Search
              </button>
            </div>
          </div>

          <div className="col-4 d-flex justify-content-end">
            <select
              value={categorySelection}
              onChange={(e) => categoryField(e.target.value)}
              className="form-select"
              aria-label="Category selection"
            >
              <option value="All">All</option>
              <option value="FE">Frontend</option>
              <option value="BE">Backend</option>
              <option value="DATA">Data</option>
              <option value="DEVOPS">DevOps</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <p>
            Showing {indexOfFirstBook + 1} - {lastItem} of {totalAmountOfBooks} results
          </p>
        </div>

        <div className="row">
          {books.length === 0 ? (
            <p>No books found.</p>
          ) : (
            books.map((book) => <SearchBook key={book.id} book={book} />)
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
    </div>
  );
};
