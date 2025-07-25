import { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/AuthProvider";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import api from "../../../Api/apiClient";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { request } from "http";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {

    const { isLoggedIn } = useAuth();
    const [httpError, setHttpError] = useState(null);

    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (isLoggedIn) {
                try {
                    const response = await api.get("/api/books/secure/currentloans");
                    setShelfCurrentLoans(response.data);
                } catch (error: any) {
                    setHttpError(error.message || "Something went wrong");
                } finally {
                    setIsLoadingUserLoans(false);
                }
            }
        };

        fetchUserCurrentLoans();
        window.scrollTo(0, 0);
    }, [isLoggedIn, checkout]);

    if (isLoadingUserLoans) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function returnBook(bookId: number) {
        if (!isLoggedIn) return;

        try {
            const response = await api.put(`/api/books/secure/return/?bookId=${bookId}`);
            setCheckout(true); // ✅ Set explicitly after successful return
        } catch (error: any) {
            setHttpError(error.message || "Something went wrong");
        }
    }

    async function renewLoan(bookId: number) {
        if (isLoggedIn) {
            try {
                const response = await api.put(`/api/books/secure/renew/loan/?bookId=${bookId}`);
                setCheckout(response.data);
            } catch (error: any) {
                setHttpError(error.message || "Something went wrong");
            } finally {
                setCheckout(!checkout);
            }
        }

    }

    return (
        <div>
            {/*Desktop View*/}
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5>Current Loans:</h5>
                        {shelfCurrentLoans.map(shelfCurrentLoans => (
                            <div key={shelfCurrentLoans.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        {shelfCurrentLoans.book?.img ?
                                            <img src={shelfCurrentLoans.book.img} width='226' height='349' alt='Book' />
                                            :
                                            <img src={require("../../../Images/BookImages/book-luv2code-1000.png")} width='226' height='349' alt='Book' />
                                        }
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {shelfCurrentLoans.daysLeft > 0 &&
                                                    <p className="text-secondary">
                                                        Due in {shelfCurrentLoans.daysLeft} days.
                                                    </p>
                                                }
                                                {shelfCurrentLoans.daysLeft === 0 &&
                                                    <p className="text-success">
                                                        Due Today</p>
                                                }
                                                {shelfCurrentLoans.daysLeft < 0 &&
                                                    <p className="text-danger">
                                                        Past due by {shelfCurrentLoans.daysLeft} days.</p>
                                                }
                                                <div className="list-group mt-3">
                                                    <button className="list-group-item list-group-item-action"
                                                        aria-current="true" data-bs-toggle="modal" data-bs-target={`#modal${shelfCurrentLoans.book.id}`}>
                                                        Manage Loan
                                                    </button>
                                                    <Link to={'search'} className='list-group-item list-group-item-action'>
                                                        Search more books?</Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help other find their adventure by reviewing your loan.
                                            </p>
                                            <Link className='btn btn-primary' to={`/checkout/${shelfCurrentLoans.book.id}`}>
                                                Leave a review</Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoans={shelfCurrentLoans} mobile={false} returnBook={returnBook} renewLoan={renewLoan} />
                            </div>
                        ))}</> :
                    <>
                        <h3 className="mt-3">
                            Currently no loans</h3>
                        <Link className="btn btn-primary" to={'search'}></Link>
                    </>
                }
            </div>
            {/* Mobile*/}
            <div className="container d-block d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ?
                    <>
                        <h5 className="mb-3">Current Loans: </h5>
                        {shelfCurrentLoans.map(shelfCurrentLoans => (
                            <div key={shelfCurrentLoans.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    {shelfCurrentLoans.book?.img ?
                                        <img src={shelfCurrentLoans.book.img} width='226' height='349' alt='Book' />
                                        :
                                        <img src={require("../../../Images/BookImages/book-luv2code-1000.png")} width='226' height='349' alt='Book' />
                                    }
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {shelfCurrentLoans.daysLeft > 0 &&
                                                <p className="text-secondary">
                                                    Due in {shelfCurrentLoans.daysLeft} days.
                                                </p>
                                            }
                                            {shelfCurrentLoans.daysLeft === 0 &&
                                                <p className="text-success">
                                                    Due Today</p>
                                            }
                                            {shelfCurrentLoans.daysLeft < 0 &&
                                                <p className="text-danger">
                                                    Past due by {shelfCurrentLoans.daysLeft} days.</p>
                                            }
                                            <div className="list-group mt-3">
                                                <button className="list-group-item list-group-item-action"
                                                    aria-current="true" data-bs-toggle="modal"
                                                    data-bs-target={`#mobilemodal${shelfCurrentLoans.book.id}`}>
                                                    Manage Loan
                                                </button>
                                                <Link to={'search'} className='list-group-item list-group-item-action'>
                                                    Search more books?</Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">
                                            Help other find their adventure by reviewing your loan.
                                        </p>
                                        <Link className='btn btn-primary' to={`/checkout/${shelfCurrentLoans.book.id}`}>
                                            Leave a review</Link>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal shelfCurrentLoans={shelfCurrentLoans} mobile={true} returnBook={returnBook} renewLoan={renewLoan} />
                            </div>
                        ))}</> :
                    <>
                        <h3 className="mt-3">
                            Currently no loans</h3>
                        <Link className="btn btn-primary" to={'search'}></Link>
                    </>
                }
            </div>

        </div>
    );
}