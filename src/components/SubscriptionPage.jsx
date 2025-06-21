import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchuserAccount } from "../slices/UserSlice";
import {
  createSubscription,
  verifyPayment,
  resetSubscriptionState,
} from "../slices/SubcriptionSlice";
import { useNavigate } from "react-router-dom";
import { FaCrown, FaStar, FaGem } from "react-icons/fa";

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const scriptLoadedRef = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.subscription);
  const user = useSelector((state) => state.users.user);

 
  const basePlans = useMemo(() => [
    {
      subscription_type: "silver",
      icon: <FaStar className="text-yellow-500" size={40} />,
      price: 499,
      quiz_limit: 4,
      durationMonths: 1,
    },
    {
      subscription_type: "gold",
      icon: <FaCrown className="text-yellow-700" size={40} />,
      price: 1299,
      quiz_limit: 10,
      durationMonths: 3,
    },
    {
      subscription_type: "enterprise",
      icon: <FaGem className="text-purple-500" size={40} />,
      price: 2499,
      quiz_limit: 25,
      durationMonths: 6,
    },
  ], []);

  const subscriptionPlans = useMemo(() => {
    return basePlans.map((plan) => {
      const durationText = plan.durationMonths === 1 ? "1 Month" : `${plan.durationMonths} Months`;
      return {
        ...plan,
        durationText,
      };
    });
  }, [basePlans]);

  useEffect(() => {
    if (success) {
      alert("Payment verified and subscription activated!");
      dispatch(fetchuserAccount()).then(() => {
        dispatch(resetSubscriptionState());
        navigate("/account");
      });
    }
  }, [success, dispatch, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (scriptLoadedRef.current) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        scriptLoadedRef.current = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan) return alert("Please select a subscription plan");

    const res = await loadRazorpayScript();
    if (!res) return alert("Razorpay SDK failed to load.");

    try {
      const data = await dispatch(
        createSubscription({
          subscription_type: selectedPlan.subscription_type,
          price: selectedPlan.price,
          quiz_limit: selectedPlan.quiz_limit,
          billingCycle: "monthly", 
        })
      ).unwrap();

      const { order, subscriptionId } = data;
      if (!order?.id) return alert("Invalid order data");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Questbucks",
        description: `${selectedPlan.subscription_type} Subscription (${selectedPlan.durationText})`,
        order_id: order.id,
        handler: function (response) {
          dispatch(
            verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscription_type: selectedPlan.subscription_type,
              price: selectedPlan.price,
              quiz_limit: selectedPlan.quiz_limit,
              billingCycle: "monthly",
              subscriptionId,
            })
          );
        },
        prefill: {
          email: user?.email || "",
          name: user?.name || "",
        },
        theme: { color: "#A78BFA" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", () => alert("Payment failed. Try again."));
    } catch (err) {
      alert(err?.message || "Order creation failed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-purple-700 tracking-wide">
        Subscribe to Questbucks
      </h2>

      {error && (
        <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.subscription_type}
            onClick={() => setSelectedPlan(plan)}
            className={`cursor-pointer border rounded-3xl p-8 shadow-md transform transition-transform
            ${
              selectedPlan?.subscription_type === plan.subscription_type
                ? "border-purple-700 bg-purple-50 scale-105 shadow-xl"
                : "border-gray-300 hover:shadow-lg hover:scale-105"
            }`}
          >
            <div className="flex justify-center mb-4">{plan.icon}</div>
            <h3 className="text-2xl font-bold text-center capitalize mb-2 text-gray-800">
              {plan.subscription_type}
            </h3>
            <p className="text-center text-gray-700 text-lg font-semibold mb-1">
              ₹{plan.price.toLocaleString()} 
            </p>
            <p className="text-center text-sm text-gray-500 mb-2">
              {plan.durationText} subscription
            </p>
            <p className="text-center text-sm text-gray-600">
              {plan.quiz_limit.toLocaleString()} Quizzes Limit
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-10 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed text-xl"
      >
        {loading ? "Processing..." : "Proceed to Pay"}
      </button>
    </div>
  );
}
