import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReviews } from "./LatestReviews";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { useAuth } from "../../Auth/AuthProvider";
import api from "../../Api/apiClient";

export const BookCheckoutPage = () => {

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  const { isLoggedIn, accessToken, isAuthLoading } = useAuth();

  const[displayError, setDisplayError] = useState(false);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/api/books/${bookId}`);
        const data = response.data;
        const loadedBook: BookModel = {
          id: data.id,
          title: data.title,
          author: data.author,
          description: data.description,
          copies: data.copies,
          copiesAvailable: data.copiesAvailable,
          category: data.category,
          img: data.img,
        };
        setBook(loadedBook);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        setHttpError(error.message);
      }
    };
    fetchBook();
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const response = await api.get(`/api/reviews/search/findByBookId?bookId=${bookId}`);
        const responseData = response.data._embedded.reviews;

        const loadedReviews: ReviewModel[] = [];
        let weightedStarReviews = 0;

        for (const review of responseData) {
          loadedReviews.push({
            id: review.id,
            userEmail: review.userEmail,
            date: review.date,
            rating: review.rating,
            book_id: review.bookId,
            reviewDescription: review.reviewDescription,
          });
          weightedStarReviews += review.rating;
        }

        if (loadedReviews.length > 0) {
          const average = (weightedStarReviews / loadedReviews.length).toFixed(1);
          setTotalStars(Number(average));
        }

        setReviews(loadedReviews);
        setIsLoadingReview(false);
      } catch (error: any) {
        setIsLoadingReview(false);
        setHttpError(error.message);
      }
    };

    fetchBookReviews();
  }, [isReviewLeft]);

  //Secure: User Review
  useEffect(() => {
    const fetchUserReviewBook = async () => {
      try {
        const response = await api.get(`api/reviews/secure/user/book/?bookId=${bookId}`);
        setIsReviewLeft(response.data);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoadingUserReview(false);
      }
    };

    if (isLoggedIn && accessToken) fetchUserReviewBook();
    else setIsLoadingUserReview(false);
  }, [isLoggedIn, accessToken]);

  //  Secure: User's Loan Count
  useEffect(() => {
    const fetchUserCurrentLoansCount = async () => {
      try {
        const response = await api.get(`/api/books/secure/currentloans/count`);
        setCurrentLoansCount(response.data);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoadingCurrentLoansCount(false);
      }
    };

    if (isLoggedIn && accessToken) fetchUserCurrentLoansCount();
    else setIsLoadingCurrentLoansCount(false);
  }, [isLoggedIn, accessToken, isCheckedOut]);

  //  Secure: User Book Checkout Status
  useEffect(() => {
  const fetchUserCheckedOutBook = async () => {
    try {
      const response = await api.get(`/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`);
      setIsCheckedOut(response.data);
    } catch (error: any) {
      setHttpError(error.message);
    } finally {
      setIsLoadingBookCheckedOut(false);
    }
  };

  if (!isAuthLoading && isLoggedIn && accessToken) {
    fetchUserCheckedOutBook();
  } else if (!isLoggedIn || !accessToken) {
    setIsLoadingBookCheckedOut(false);
  }
}, [isAuthLoading, isLoggedIn, accessToken]);


  // Block UI if loading
  if (
    isLoading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingBookCheckedOut ||
    isLoadingUserReview
  ) {
    return <SpinnerLoading />;
  }

  // Error handler
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  if (isAuthLoading) {
  return <SpinnerLoading />; // ⏳ Wait for token refresh
}

  async function checkoutBook() {
    if (!isLoggedIn || !accessToken) return;
    try {
      await api.put(`api/books/secure/checkout/?bookId=${book?.id}`);
      setIsCheckedOut(true);
    } catch (error: any) {
      setDisplayError(true);
    }
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    if (!isLoggedIn || !accessToken || !book?.id) return;

    try {
      const reviewRequestModel = new ReviewRequestModel(starInput, book.id, reviewDescription);
      await api.post(`/reviews/secure`, reviewRequestModel);
      setIsReviewLeft(true);
    } catch (error: any) {
      setHttpError(error.message);
    }
  }

  return (
    <div>
      {/* Desktop Layout */}
      <div className="container d-none d-lg-block">
        {displayError && <div className="alert alert-danger mt-3" role="alert">
          Please pay outstanding fees and/or return late book(s).</div>}
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ? (
              <img src={book.img} width="226" height="349" alt="Book" />
            ) : (
              <img
                src={require("../../Images/BookImages/book-luv2code-1000.png")}
                width="226"
                height="349"
                alt="Book"
              />
            )}
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={isLoggedIn}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
      </div>

      {/* Mobile Layout */}
      <div className="container d-lg-none mt-5">
        {displayError && <div className="alert alert-danger mt-3" role="alert">
          Please pay outstanding fees and/or return late book(s).</div>}
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ? (
            <img src={book.img} width="226" height="349" alt="Book" />
          ) : (
            <img
              src={require("../../Images/BookImages/book-luv2code-1000.png")}
              width="226"
              height="349"
              alt="Book"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={isLoggedIn}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
        <hr />
        <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
      </div>
    </div>
  );
};
