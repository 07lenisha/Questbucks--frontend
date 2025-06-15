
import { useEffect } from "react";
import { fetchusers, updateUserActivation } from "../slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAdminContext } from "../context/AdminContext.jsx";

 export default function AdminCompanyStatusManager()
 {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);
  const { toggleRefresh } = useAdminContext();

  useEffect(() => {
    dispatch(fetchusers());
  }, [dispatch]);

  const handleToggleStatus = (userId, currentStatus) => {
    dispatch(updateUserActivation({ id: userId, isActive: !currentStatus }))
      .unwrap()
      .then(() => {
        toggleRefresh();
        dispatch(fetchusers());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-wide">
        Manage Company Status
      </h2>

      {isLoading && (
        <p className="mb-4 text-indigo-600 font-semibold animate-pulse">
          Loading or updating status...
        </p>
      )}

      {error && (
        <p className="mb-4 text-red-600 font-semibold">{error.message || error.errors}</p>
      )}

      <div className="space-y-4">
        {users
          .filter((u) => u.role === "company")
          .map((user) => (
            <div
              key={user._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex-1 mb-3 sm:mb-0">
                <h3 className="text-xl font-semibold text-gray-800">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="flex items-center space-x-6">
                <span
                  className={`px-3 py-1 rounded-full font-semibold text-sm ${
                    user.isActive
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>

                <button
                  onClick={() => handleToggleStatus(user._id, user.isActive)}
                  className={`px-5 py-2 rounded-md font-semibold text-white transition-colors duration-300 ${
                    user.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

