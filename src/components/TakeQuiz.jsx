import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchQuizes,
  fetchQuizById,
  submitQuiz,
  clearScore,
  clearCurrentQuiz,
  addQuizAttempt,
  addUserQuizHistory,
} from "../slices/QuizSlice";
import { createRedemption } from "../slices/RedeemSlice";
import { useParams, useNavigate } from "react-router-dom";

export default function TakeQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { quizes, currentQuiz, totalPages, isLoading, score } = useSelector(
    (state) => state.quizes
  );

  const [answers, setAnswers] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [quizPage, setQuizPage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [redemptionCode, setRedemptionCode] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [hasAttempted, setHasAttempted] = useState(false);

  const quizzesPerPage = 4;

  useEffect(() => {
    dispatch(fetchQuizes({ page: quizPage, limit: quizzesPerPage }));
  }, [dispatch, quizPage]);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(id));
      dispatch(clearScore());
      setAnswers({});
      setCurrentQuestionIndex(0);
      setRedemptionCode(null);
      setShowResults(false);
      setSubmittedAnswers([]);
      setHasAttempted(false);
    } else {
      dispatch(clearCurrentQuiz());
      dispatch(clearScore());
      setAnswers({});
      setRedemptionCode(null);
      setShowResults(false);
      setSubmittedAnswers([]);
      setHasAttempted(false);
    }
  }, [dispatch, id]);

  const handlePrevPage = () => {
    if (quizPage > 1) setQuizPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (quizPage < totalPages) setQuizPage((prev) => prev + 1);
  };

  const handleSelectQuiz = (quizId) => {
    setSubmissionError("");
    navigate(`/take-quiz/${quizId}`);
  };

  const handleBackToList = () => {
    navigate("/take-quiz");
  };

  const handleOptionChange = (questionIdx, optionIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (
      currentQuiz &&
      currentQuestionIndex < currentQuiz.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !currentQuiz?.questions ||
      Object.keys(answers).length !== currentQuiz.questions.length
    ) {
      setSubmissionError("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmissionError("");

      const answerArray = Object.keys(answers)
        .sort((a, b) => a - b)
        .map((key) => answers[key]);

      const { score, attemptedAt, quizId } = await dispatch(
        submitQuiz({ id, answers: answerArray })
      ).unwrap();

      await dispatch(
        addQuizAttempt({ quizId, score, answers: answerArray, attemptedAt })
      ).unwrap();

      await dispatch(
        addUserQuizHistory({
          quizId,
          quizTitle: currentQuiz.title,
          score,
          attemptedAt,
        })
      );

      if (score > 0) {
        const redemptionData = await dispatch(
          createRedemption({ quizId, score })
        ).unwrap();
        setRedemptionCode(redemptionData.redemption);
      } else {
        setRedemptionCode(null);
        setSubmissionError("Try again to score and earn a reward!");
      }

      setSubmittedAnswers(answerArray);
      setShowResults(true);
    } catch (error) {
      console.error("Quiz Submit Error:", error);
      if (error) {
        setHasAttempted(true);
        setSubmissionError("You have already attempted this quiz.");
      } else {
        setSubmissionError(err.message || "Failed to submit quiz.");
      }
    }
  };
  const paginatedQuizzes = quizes;

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-purple-100 to-pink-100 font-sans">
      {isLoading && (
        <p className="text-center text-purple-600 animate-pulse text-lg font-semibold">
          Loading...
        </p>
      )}

      {!id && !isLoading && (
        <>
          <h2 className="text-3xl font-extrabold text-purple-700 mb-12 text-center drop-shadow-lg">
            Take a Quiz
          </h2>

          {quizes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    onClick={() => handleSelectQuiz(quiz._id)}
                    className="cursor-pointer bg-white/90 backdrop-blur-lg shadow-xl hover:shadow-2xl rounded-3xl p-7 border border-purple-200 hover:border-purple-500 transition-transform transform hover:-translate-y-1"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSelectQuiz(quiz._id)
                    }
                  >
                    <h3 className="text-2xl font-semibold text-purple-800 mb-3 truncate">
                      {quiz.title}
                    </h3>
                    {quiz.user_id?.name && (
                      <p className="text-sm text-gray-500 italic mb-2 truncate">
                        Company: {quiz.user_id.name}
                      </p>
                    )}
                    <p className="text-sm text-purple-600 font-medium">
                      {quiz.questions.length} Question
                      {quiz.questions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-10 space-x-8">
                <button
                  onClick={handlePrevPage}
                  disabled={quizPage === 1}
                  className={`px-6 py-3 rounded-full font-semibold shadow-lg transition ${
                    quizPage === 1
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Prev
                </button>
                <span className="text-purple-700 font-bold text-xl self-center">
                  Page {quizPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={quizPage === totalPages}
                  className={`px-6 py-3 rounded-full font-semibold shadow-lg transition ${
                    quizPage === totalPages
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 mt-8 text-xl italic">
              No quizzes available at the moment.
            </p>
          )}
        </>
      )}

      {id && currentQuiz && !isLoading && (
        <>
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-purple-800 drop-shadow-md">
              {currentQuiz.title}
            </h2>
            <button
              onClick={handleBackToList}
              className="text-purple-600 underline hover:text-purple-900 transition focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
            >
              ← Back
            </button>
          </div>

          {!showResults ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-8 bg-white/90 p-8 rounded-3xl shadow-xl border border-purple-300">
                <p className="text-2xl font-semibold text-purple-800 mb-6">
                  Q{currentQuestionIndex + 1}.{" "}
                  {currentQuiz.questions[currentQuestionIndex].question_text}
                </p>
                <div className="space-y-4">
                  {currentQuiz.questions[currentQuestionIndex].options.map(
                    (option, oIdx) => (
                      <label
                        key={oIdx}
                        className="flex items-center space-x-3 cursor-pointer text-gray-900 hover:text-purple-700 transition"
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={oIdx}
                          checked={answers[currentQuestionIndex] === oIdx}
                          onChange={() =>
                            handleOptionChange(currentQuestionIndex, oIdx)
                          }
                          className="accent-purple-600 w-5 h-5"
                        />
                        <span className="select-none text-lg">
                          {option.option_text}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`px-5 py-3 rounded-full font-semibold shadow-lg transition ${
                    currentQuestionIndex === 0
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={
                    currentQuestionIndex === currentQuiz.questions.length - 1
                  }
                  className={`px-5 py-3 rounded-full font-semibold shadow-lg transition ${
                    currentQuestionIndex === currentQuiz.questions.length - 1
                      ? "bg-gray-300 text-white cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Next
                </button>
              </div>

              <button
                disabled={hasAttempted}
                type="submit"
                className={`w-full py-4 font-extrabold text-xl rounded-3xl shadow-lg transition ${
                  hasAttempted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-800 text-white hover:bg-purple-900"
                }`}
              >
                Submit Quiz
              </button>

              {submissionError && (
                <p className="text-red-600 mt-5 font-semibold text-center">
                  {submissionError}
                </p>
              )}
            </form>
          ) : (
            <div className="mt-8 space-y-8">
              <h3 className="text-3xl font-extrabold text-purple-800 tracking-wide">
                Quiz Results
              </h3>

              {currentQuiz.questions.map((question, qIdx) => {
                const userAnswerIdx = submittedAnswers[qIdx];
                const correctAnswerIdx = question.options.findIndex(
                  (opt) => opt.is_correct
                );

                return (
                  <div
                    key={qIdx}
                    className="p-8 rounded-3xl bg-white/95 border-l-8 border-purple-400 shadow-xl"
                  >
                    <p className="font-bold text-purple-700 text-xl mb-3">
                      Q{qIdx + 1}. {question.question_text}
                    </p>
                    <ul className="space-y-2 ml-6 text-lg">
                      {question.options.map((option, oIdx) => {
                        const isUserAnswer = oIdx === userAnswerIdx;
                        const isCorrectAnswer = oIdx === correctAnswerIdx;

                        return (
                          <li
                            key={oIdx}
                            className={`${
                              isCorrectAnswer
                                ? "text-green-700 font-extrabold"
                                : isUserAnswer
                                ? "text-red-600 line-through font-semibold"
                                : "text-gray-800"
                            }`}
                          >
                            {option.option_text}
                            {isCorrectAnswer && " (Correct)"}
                            {isUserAnswer &&
                              !isCorrectAnswer &&
                              " (Your Answer)"}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              <div className="text-2xl font-extrabold text-purple-900 text-center">
                Your Score: <span className="text-purple-700">{score}</span>
              </div>

              {redemptionCode && (
                <div className="max-w-xl mx-auto p-8 bg-gradient-to-tr from-blue-300 via-purple-300 to-pink-300 rounded-3xl shadow-2xl text-center animate-fadeIn">
                  <h3 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">
                    🎉 Redemption Code Unlocked!
                  </h3>
                  <p className="text-5xl font-extrabold tracking-widest py-3 px-8 bg-white/90 rounded-xl shadow-inner inline-block text-purple-900 select-all cursor-pointer hover:scale-105 transform transition-transform">
                    {redemptionCode.redemption_code}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        redemptionCode.redemption_code
                      )
                    }
                    className="mt-5 px-6 py-3 bg-purple-700 text-white rounded-full font-bold hover:bg-purple-900 shadow-lg transition focus:outline-none focus:ring-4 focus:ring-purple-300"
                    aria-label="Copy redemption code"
                  >
                    Copy Code
                  </button>

                  <div className="mt-6 text-left text-white space-y-2 font-semibold text-lg drop-shadow-md">
                    <p>
                      Status:{" "}
                      <span className="font-bold">{redemptionCode.status}</span>
                    </p>
                    <p>
                      Company:{" "}
                      <span className="font-bold">
                        {redemptionCode.company_name}
                      </span>
                    </p>

                    <p>
                      Expires:{" "}
                      <span className="font-bold">
                        {new Date(redemptionCode.expires_at).toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
