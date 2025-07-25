import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthProvider";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import api from "../../Api/apiClient";
import authService from "../../Api/authService";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInforequest from "../../models/PaymentInforequest";

export const PaymentPage = () => {
    const { isLoggedIn } = useAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                if (isLoggedIn) {
                    const claims = authService.getUserClaims();
                    const email = claims?.email;

                    if (!email) throw new Error("No email found in token");

                    const response = await api.get(`/api/payments/search/findByUserEmail?userEmail=${email}`);
                    setFees(response.data.amount); // Update as per response structure
                    setLoadingFees(false);
                }
            } catch (error) {
                setHttpError(true);
                setLoadingFees(false);
            }
        };

        fetchFees();
    }, [isLoggedIn]);

    const elements = useElements();
    const stripe = useStripe();

    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        try {
            const claims = authService.getUserClaims();
            const email = claims?.email;

            if (!email) throw new Error("No email found in token");

            const paymentInfo = new PaymentInforequest(Math.round(fees * 100), "USD", email);

            const response = await api.post("/api/payment/secure/payment-intent", paymentInfo);

            // ✅ FIX: No need to JSON.parse
            const paymentIntentData = response.data;
            const clientSecret = paymentIntentData.client_secret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: email,
                    },
                },
            }, { handleActions: false });

            if (result.error) {
                console.error(result.error.message);
                setSubmitDisabled(false);
            } else {
                // Confirm backend update
                await api.put("/api/payment/secure/payment-complete", null, {
                    headers: {
                        Authorization: `Bearer ${authService.getAccessToken()}`
                    }
                });

                setFees(0);
                setSubmitDisabled(false);
            }

        } catch (error) {
            console.error("Checkout error:", error);
            setSubmitDisabled(false);
        }
    }



    if (loadingFees) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>Something went wrong while fetching fees.</p>
            </div>
        );
    }

    return (
        <div className="container">
            {fees > 0 && (
                <div className="card mt-3">
                    <h5 className="card-header">
                        Fees pending: <span className="text-danger">${fees}</span>
                    </h5>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Credit Card</h5>
                        <CardElement id="card-element" />
                        <button
                            onClick={checkout}
                            disabled={submitDisabled}
                            type="button"
                            className="btn btn-md main-color text-white mt-3"
                        >
                            Pay fees
                        </button>
                    </div>
                </div>
            )}

            {fees === 0 && (
                <div className="mt-3">
                    <h5>You have no fees!</h5>
                    <Link to="/search" className="btn main-color text-white">
                        Explore top books
                    </Link>
                </div>
            )}

            {submitDisabled && <SpinnerLoading />}
        </div>
    );

};
