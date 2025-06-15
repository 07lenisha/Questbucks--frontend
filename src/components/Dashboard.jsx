
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data } = useSelector((state) => state.users);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Hello, {data?.name || "Guest"}!
      </h2>

      {data?.role === "admin" && (
        <div className="bg-blue-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded mb-8">
          You are logged in as <strong>Admin</strong>. Manage users, quizzes, and platform settings.
        </div>
      )}

      {data?.role === "company" && (
        <div className="bg-orange-100 border-l-4 border-blue-400 text-blue-800 p-4 rounded mb-8">
          Welcome, <strong>Quiz Creator</strong>! Start publishing quizzes and track user engagement.
        </div>
      )}

      {data?.role === "user" && (
        <div className="bg-pink-100 border-l-4 border-pink-400 text-pink-800 p-4 rounded mb-8">
          Ready to challenge yourself? Take quizzes, earn points, and unlock rewards!
        </div>
      )}

      <div className="flex gap-4 justify-center flex-wrap">
        {data?.role === "user" && (
          <>
            <Link
              to="/take-quiz"
              className="bg-pink-500 text-white px-5 py-2 rounded shadow hover:bg-pink-600 transition"
            >
              Take a Quiz
            </Link>
            <Link
              to="/redeem-code"
              className="bg-blue-500 text-white px-5 py-2 rounded shadow hover:bg-blue-600 transition"
            >
              Redeem Points
            </Link>
          </>
        )}

        {data?.role === "company" && (
          <Link
            to="/quiz"
            className="bg-purple-600 text-white px-5 py-2 rounded shadow hover:bg-purple-700 transition"
          >
            Create a Quiz
          </Link>
        )}

        <Link
          to="/account"
          className="bg-blue-700 text-white px-5 py-2 rounded shadow hover:bg-gray-800 transition"
        >
          My Profile
        </Link>
      </div>
    </div>
  );
}
