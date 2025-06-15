import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listSubscriptions } from "../slices/SubcriptionSlice";

const SubscriptionList = () => {
  const dispatch = useDispatch();

  
  const data = useSelector((state) => state.users.data);

 
  const { subscriptions, loading, error } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (data?.role === "admin" || data?.role === "company") {
      dispatch(listSubscriptions());
    }
  }, [dispatch, data]);

  
  if (data?.role !== "admin" && data?.role !== "company") {
    return (
      <p className="text-center text-red-500 mt-6">
        Access denied: only admins or companies allowed
      </p>
    );
  }

  if (loading) return <p className="text-center mt-6">Loading subscriptions...</p>;
  if (error) return <p className="text-center text-red-500 mt-6">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        {data?.role === "admin" ? "All Company Subscriptions" : "Your Subscriptions"}
      </h1>

      {subscriptions.length === 0 ? (
        <p className="text-center text-gray-600">No subscriptions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub._id}
              className="bg-white rounded-xl border border-gray-200 shadow-md p-5"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">{sub.subscription_type.toUpperCase()}</h2>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                    sub.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {sub.status}
                </span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                {data?.role === "admin" && (
                  <>
                    <p><strong>Company:</strong> {sub.user_id?.name}</p>
                    <p><strong>Email:</strong> {sub.user_id?.email}</p>
                    <p><strong>Role:</strong> {sub.user_id?.role}</p>
                  </>
                )}
                <p><strong>Price:</strong> ₹{sub.price}</p>
                <p><strong>Quiz Limit:</strong> {sub.quiz_limit}</p>
                <p><strong>Start Date:</strong> {new Date(sub.subscription_start).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {new Date(sub.subscription_end).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;
