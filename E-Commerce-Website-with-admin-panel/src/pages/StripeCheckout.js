import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "../../src/Stripe.css";
import { useSelector } from "react-redux";
import { selectCurrentOrder } from "../features/order/orderSlice";

const stripePromise = loadStripe(
  "pk_test_51NtTNWSAH0cWcMgCsPnvDW7i1P3ruFPVeDDSiyEGT4OhUB5dB56yiMxN0PYd5t3uZTy0htg4nV8Uv1wlwNnO2NrJ00HPi1oxG4"
);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const currentOrder = useSelector(selectCurrentOrder);

  console.log("current", currentOrder.items);
  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("http://localhost:8080/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalAmount: currentOrder.totalAmount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
