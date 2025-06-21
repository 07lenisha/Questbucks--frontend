import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizes, createQuiz, updateQuiz, deleteQuiz } from "../slices/QuizSlice";
import { listSubscriptions } from "../slices/SubcriptionSlice";

import {  useNavigate } from "react-router-dom";
export default function Quiz() {
  const dispatch = useDispatch();
  const { quizes, isLoading, serverErrors } = useSelector((state) => state.quizes);
  const quiz_limit = useSelector(state => state.subscription.quiz_limit);
const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    total_points: 0,
    quiz_type: "multiple_choice",
    questions: [],
  });

  const [editQuizId, setEditQuizId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizes());
   
  
  }, [dispatch]);
  
  useEffect(() => {
   
   dispatch(listSubscriptions());
  
  }, [dispatch]);
 
  console.log("Quiz limit from redux state:", quiz_limit);
  
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "total_points" ? Number(value) : value,
    }));
  }

  function handleQuestionTextChange(index, value) {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].question_text = value;
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  }

  function handleQuestionPointsChange(index, value) {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].points = Number(value);
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  }

  function handleQuestionTypeChange(index, value) {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].question_type = value;
    if (value !== "multiple_choice") {
      updatedQuestions[index].options = [];
    } else if (updatedQuestions[index].options.length === 0) {
      updatedQuestions[index].options = [{ option_text: "", is_correct: false }];
    }
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  }

  function addQuestion() {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question_text: "",
          question_type: "multiple_choice",
          options: [{ option_text: "", is_correct: false }],
          points: 0,
        },
      ],
    }));
  }

  function removeQuestion(index) {
    const updatedQuestions = form.questions.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  }


  function updateOption(qIndex, optIndex, { optionText, markCorrect }) {
  const updatedQuestions = [...form.questions];

  if (optionText !== undefined) {
    updatedQuestions[qIndex].options[optIndex].option_text = optionText;
  }

  if (markCorrect) {
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.map((opt, i) => ({
      ...opt,
      is_correct: i === optIndex,
    }));
  }

  setForm(prev => ({ ...prev, questions: updatedQuestions }));
}

  function addOption(qIndex) {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIndex].options.push({ option_text: "", is_correct: false });
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  }

  function removeOption(qIndex, optIndex) {
    const updatedQuestions = [...form.questions];
    updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== optIndex);
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  }

 
 
  function editQuiz(quiz) {
    setEditQuizId(quiz._id);
    setForm({
      title: quiz.title || "",
      description: quiz.description || "",
      total_points: quiz.total_points || 0,
      quiz_type: quiz.quiz_type || "multiple_choice",
      questions: quiz.questions.map((q) => ({
        question_text: q.question_text || "",
        question_type: q.question_type || "multiple_choice",
        options: q.options || [],
        points: q.points || 0,
      })),
    });
  }

  function resetForm() {
    setForm({ title: "", description: "", total_points: 0, quiz_type: "multiple_choice", questions: [] });
    setEditQuizId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
 
 if ( quiz_limit==0) {
      alert(`You have reached your quiz creation limit of ${quiz_limit}.`);
      return;
    }
      if (!form.title.trim()) {
      alert("title is required");
      return;
    }
    if (!form.description.trim()) {
      alert("Description is required");
      return;
    }
    if (form.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }
    console.log("quiz_limit:", quiz_limit, typeof quiz_limit);

    const totalPoints = form.questions.reduce((sum, q) => sum + (q.points || 0), 0);
if (totalPoints <= 0) {
  alert("Total points must be a positive number");
  return;
}


    for (const [index, q] of form.questions.entries()) {
      if (!q.question_text.trim()) {
        alert(`Question ${index + 1} text is required`);
        return;
      }
      if (!q.points || q.points <= 0) {
        alert(`Points for Question ${index + 1} must be a positive number`);
        return;
      }
      if (q.question_type === "multiple_choice") {
        if (!q.options || q.options.length === 0) {
          alert(`Please add options for Question ${index + 1}`);
          return;
        }
        if (!q.options.some((opt) => opt.is_correct)) {
          alert(`Please select a correct option for Question ${index + 1}`);
          return;
        }
      }
    }

    if (editQuizId) {
      const result = await dispatch(updateQuiz({ id: editQuizId, quizData: form }));
      console.log("Update result:", result);
    } else {
      const result = await dispatch(createQuiz(form));
      await dispatch(listSubscriptions())
      console.log("Create result:", result);
    }

    resetForm();
  }
console.log("Quiz count:", quizes.length);
console.log("Quiz limit:", quiz_limit);

  function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      dispatch(deleteQuiz(id));
    }
  }
return (
  <div className="pl-10 pr-4 py-8 w-full">
    <h2 className="text-3xl font-semibold text-purple-700 mb-8">
      Company Quiz Manager
    </h2>

    {isLoading && (
      <p className="text-gray-500 mb-6 italic">Loading...</p>
    )}

    {serverErrors && (
      <p className="text-red-600 font-medium mb-6">{serverErrors}</p>
    )}

    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-2xl font-semibold text-purple-800">
        {editQuizId ? "Edit Quiz" : "Create New Quiz"}
      </h3>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-purple-900 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter quiz title"
            className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-purple-900 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Enter quiz description"
            className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div>
          <p className="text-sm font-semibold text-purple-900">
            Total Points:{" "}
            <span className="font-bold">
              {form.questions.reduce((sum, q) => sum + (q.points || 0), 0)}
            </span>
          </p>
        </div>
      </div>

      <section className="border-t border-purple-200 pt-6 space-y-6">
        <h4 className="text-xl font-semibold text-purple-800">Questions</h4>

        {form.questions.length === 0 ? (
          <p className="text-gray-500 italic">No questions added yet.</p>
        ) : (
          form.questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="p-4 border border-purple-300 rounded-md bg-purple-50"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-purple-900">
                  Question {qIndex + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                value={question.question_text}
                onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                placeholder="Enter question text"
                className="w-full mb-3 px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <div className="mb-3 max-w-xs">
                <label
                  htmlFor={`question_type-${qIndex}`}
                  className="block text-sm font-medium text-purple-900 mb-1"
                >
                  Question Type
                </label>
                <select
                  id={`question_type-${qIndex}`}
                  value={question.question_type}
                  onChange={(e) => handleQuestionTypeChange(qIndex, e.target.value)}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>

              <div className="mb-3 max-w-xs">
                <label
                  htmlFor={`points-${qIndex}`}
                  className="block text-sm font-medium text-purple-900 mb-1"
                >
                  Points
                </label>
                <input
                  type="number"
                  min={0}
                  value={question.points}
                  onChange={(e) => handleQuestionPointsChange(qIndex, e.target.value)}
                  id={`points-${qIndex}`}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

             
              {question.question_type === "multiple_choice" && (
                <>
                  <label className="block font-semibold text-purple-900 mb-2">
                    Options
                  </label>
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center mb-2 space-x-3 max-w-xl"
                    >
                      <input
                        type="text"
                        value={option.option_text}
                        onChange={(e) =>
                          updateOption(qIndex, optIndex, { optionText: e.target.value })
                        }
                        className="flex-grow px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                        placeholder={`Option ${optIndex + 1}`}
                      />
                      <label className="flex items-center space-x-1 text-purple-900 text-sm">
                        <input
                          type="radio"
                          name={`correct-option-${qIndex}`}
                          checked={option.is_correct}
                          onChange={() =>
                            updateOption(qIndex, optIndex, { markCorrect: true })
                          }
                          className="accent-purple-600"
                        />
                        <span>Correct</span>
                      </label>
                      {question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, optIndex)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="mt-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Add Option
                  </button>
                </>
              )}

            
              {question.question_type === "true_false" && (
                <p className="text-gray-600 italic mt-2">
                  True/False question (options are automatically True/False).
                </p>
              )}
              {question.question_type === "short_answer" && (
                <p className="text-gray-600 italic mt-2">
                  Short answer question (no options).
                </p>
              )}
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addQuestion}
          className="px-5 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
        >
          Add Question
        </button>
      </section>
      
      {quiz_limit === 0 && (
      <div className="text-red-600 font-bold">
        You have reached your quiz creation limit. Please subscribe to add more.
      </div>
    )}

    {(quiz_limit === 0 ) && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 mb-4">
          <p>
            You have reached your quiz limit. Please subscribe to create more quizzes.
          </p>
          <button
            onClick={() => navigate("/subscribe")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Subscribe
          </button>
        </div>
      )}



      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
        >
          {editQuizId ? "Update Quiz" : "Create Quiz"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </form>

 
    <section className="mt-12">
      <h3 className="text-2xl font-semibold text-purple-700 mb-6">
        All Quizzes
      </h3>
      {quizes.length === 0 ? (
        <p className="text-gray-600">No quizzes available.</p>
      ) : (
        <ul className="space-y-4">
          {quizes.map((quiz) => (
            <li
              key={quiz._id}
              className="p-4 border border-purple-300 rounded-md bg-purple-50 flex justify-between items-start"
            >
              <div>
                <h4 className="text-lg font-semibold text-purple-800 mb-1">
                  {quiz.title}
                </h4>
                <p className="text-purple-900 mb-1">{quiz.description}</p>
                <p className="text-purple-700 font-semibold">
                  Total Points: {quiz.total_points}
                </p>
              </div>
              <div className="space-x-3 flex-shrink-0 mt-1">
                <button
                  onClick={() => editQuiz(quiz)}
                  className="px-3 py-1 bg-yellow-400 text-purple-900 rounded hover:bg-yellow-500"
                > Edit </button>
                <button
                  onClick={() => handleDelete(quiz._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  </div>
);
}
