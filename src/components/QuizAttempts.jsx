import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizById } from "../slices/QuizSlice";

export default function QuizAttempts() {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const { currentQuiz, isLoading, error } = useSelector((state) => state.quizes);

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
    }
  }, [quizId, dispatch]);

  if (isLoading) return <p className="text-center text-purple-600 font-semibold">Loading quiz attempts...</p>;
  if (error) return <p className="text-red-600 text-center font-medium">Error: {error}</p>;
  if (!currentQuiz) return <p className="text-gray-600 text-center">No quiz data found.</p>;

  const quiz = currentQuiz;

  return (
    <div className="p-6 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl shadow-2xl min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-purple-800 mb-10 drop-shadow">
        {quiz.title} - Attempts
      </h2>

      {quiz.attempts.length === 0 ? (
        <p className="text-gray-700 text-lg italic text-center">No attempts yet.</p>
      ) : (
        quiz.attempts.map((attempt, index) => (
          <div
            key={index}
            className="mb-10 p-6 rounded-2xl shadow-xl bg-white/90 border-l-8 border-purple-400 transition-transform hover:scale-[1.01]"
          >
            <div className="mb-4 border-b pb-2 border-dashed border-purple-300">
              <p className="text-xl font-bold text-purple-800 flex items-center gap-2">
                👤Username- {attempt.user_id.name}
              </p>
    
              <p className="text-purple-700 font-medium mt-1">
                🏆 Score: <span className="text-purple-900 font-bold">{attempt.score}</span>
              </p>
              <p className="text-gray-500 text-sm">
                 🕒Atempted On-{new Date(attempt.attempted_at).toLocaleString()}
              </p>
            </div>

            <div className="space-y-6 mt-4">
              {quiz.questions.map((question, qIndex) => {
                const userAnswerIndex = attempt.answers[qIndex];
                const correctAnswerIndex = question.options.findIndex(opt => opt.is_correct);

                return (
                  <div key={qIndex} className="bg-purple-50 p-5 rounded-xl border border-purple-200 shadow-sm">
                    <p className="font-semibold text-purple-900 mb-3 text-lg">
                      Q{qIndex + 1}: {question.question_text}
                    </p>

                    <ul className="ml-4 space-y-2">
                      {question.options.map((opt, optIndex) => {
                        const isUser = optIndex === userAnswerIndex;
                        const isCorrect = opt.is_correct;

                        return (
                          <li
                            key={optIndex}
                            className={`
                              text-sm rounded px-4 py-2 shadow-sm transition-all duration-200
                              ${isCorrect && isUser ? "bg-green-200 text-green-900 font-semibold ring-2 ring-green-400" : ""}
                              ${isCorrect && !isUser ? "bg-green-100 text-green-800" : ""}
                              ${!isCorrect && isUser ? "bg-red-100 text-red-700 font-semibold ring-2 ring-red-400" : ""}
                              ${!isCorrect && !isUser ? "bg-white text-gray-700" : ""}
                            `}
                          >
                            {opt.option_text}
                            {isCorrect && isUser && " ✅ (Correct & User's Answer)"}
                            {isCorrect && !isUser && " ✅ (Correct Answer)"}
                            {!isCorrect && isUser && " ❌ (User's Answer)"}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
