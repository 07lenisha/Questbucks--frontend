import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchuserAccount } from "../slices/UserSlice";
import { fetchQuizHistory, fetchQuizes } from "../slices/QuizSlice";

export default function Companyquishistory() {
  const dispatch = useDispatch();

  const { data, isLoading } = useSelector((state) => state.users);
  const { quizHistory, isLoading: quizLoading, quizes } = useSelector(
    (state) => state.quizes
  );

  useEffect(() => {
    dispatch(fetchuserAccount());
  }, [dispatch]);

  useEffect(() => {
    if (data?._id) {
      dispatch(fetchQuizHistory());
      if (data.role === "admin") {
        dispatch(fetchQuizes());
      }
    }
  }, [dispatch, data]);

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      {data?.role === "admin" ? (
        <>
          <h2 className="text-4xl font-extrabold mb-8 text-purple-700 border-b-4 border-pink-500 pb-3">
            Company Dashboard
          </h2>

        
          <section className="mb-10">
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Created Quizzes</h3>
            {quizes?.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {quizes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="bg-pink-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  >
                    <h4 className="font-bold text-xl text-purple-800 mb-2">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Created on:{" "}
                      <span className="font-medium">
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      Questions: <span className="font-medium">{quiz.questions?.length || 0}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Created by:{" "}
                      <span className="font-medium">{quiz.user_id?.name || "Unknown User"}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No quizzes found.</p>
            )}
          </section>
        </>
      ) : (
        <p className="text-center text-red-500 font-semibold mt-10">You are not an admin.</p>
      )}
    </div>
  );
}
