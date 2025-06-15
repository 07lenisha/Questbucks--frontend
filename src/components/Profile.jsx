
import { useEffect, useState } from "react";
import isEmail from "validator/lib/isEmail";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchuserAccount,
  updateUserProfile,
} from "../slices/UserSlice";
import { fetchQuizHistory, fetchQuizes } from "../slices/QuizSlice";
import { listRedemptions } from "../slices/RedeemSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector((state) => state.users);
  const { quizHistory, isLoading: quizLoading,quizes } = useSelector((state) => state.quizes);
  const { redemptions, loading: redemptionLoading } = useSelector((state) => state.redeem);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [serverErrors, setServerErrors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);
  const [showRedemptionHistory, setShowRedemptionHistory] = useState(false);

 useEffect(() => {
  dispatch(fetchuserAccount());
 }, [dispatch]);

  useEffect(() => {
  if (data) {
    dispatch(fetchQuizHistory());
     console.log("Dispatching listRedemptions...",quizHistory);
    
    dispatch(listRedemptions());
    if (data.role === "company") {
      dispatch(fetchQuizes());
    }
  }
  }, [dispatch, data]);

  

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setImage(data.image || null);
    }
  }, [data]);


  const resetForm = () => {
    setName(data.name || "");
    setEmail(data.email || "");
    setImage(data.image || null);
    setServerErrors([]);
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email.trim())) {
      return setServerErrors([{ msg: "Invalid email format" }]);
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (image instanceof File) formData.append("image", image);
    console.log("foem",formData)

    const result = await dispatch(updateUserProfile({ formData, resetForm }));
    if (result.meta.requestStatus === "rejected") {
      setServerErrors(result.payload.errors || []);
    } else {
      dispatch(fetchuserAccount());
      dispatch(fetchQuizHistory());
      setIsEditing(false);
    }
  }
console.log("Quizes from store:", quizes);
console.log("Quiz attempts data:", quizes.attempts);

 return (
  <div className="max-w-5xl mx-auto p-6">
  <div className="bg-white rounded-lg shadow-md p-6 mb-10">
    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
      {isEditing ? "Edit Profile" : "Your Profile"}
    </h1>

    {isEditing ? (
      <form onSubmit={handleSubmit}>
        <div className="flex gap-6 items-center mb-6">
          {image ? (
            <img
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl shadow">
              👤
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
             readOnly
            className="w-full mt-1 p-2 border rounded-md"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsEditing(false);
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded-md w-full"
          >
            Cancel
          </button>
        </div>

        {serverErrors.length > 0 && (
          <div className="text-red-600 mt-4">
            {serverErrors.map((err, idx) => (
              <div key={idx}>{err.msg || err}</div>
            ))}
          </div>
        )}
      </form>
    ) : (
      <div className="flex items-center mb-6">
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border shadow"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl shadow">
            👤
          </div>
        )}
        <div className="ml-6">
          <p className="text-xl font-semibold">{data?.name}</p>
          <p className="text-gray-600">{data?.email}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded-md"
          >
            Edit Profile
          </button>
        </div>
      </div>
    )}


    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">📅</span>
        <h2 className="text-lg font-semibold text-gray-800">Member Since</h2>
      </div>
      <p className="ml-7 text-2xl text-blue-600 font-semibold">
        {data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}
      </p>
    </div>
  </div>

{data?.role === "company" ? (
  <>
    <h2 className="text-4xl font-extrabold mb-8 text-blue-900">🎯 Company Dashboard</h2>

 
    <section className="mb-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">📝 Created Quizzes</h3>
      {quizes?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition"
            >
              <h4 className="text-xl font-bold text-blue-700 mb-2">{quiz.title}</h4>
              <p className="text-sm text-gray-600">Created on: {new Date(quiz.created_at).toLocaleDateString()}</p>
              <p className="text-sm text-gray-700">Questions: {quiz.questions?.length || 0}</p>
              <p className="mt-3 font-semibold text-gray-800">
                Attempts ({quiz.attempts?.length || 0})
              </p>
                {quiz.attempts?.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 space-y-1">
                  {quiz.attempts.map((attempt) => (
                    <li key={attempt._id}>
                      {attempt.user_id?.name} - Score: {attempt.score} -{" "}
                      <span className="text-gray-500">{new Date(attempt.attempted_at).toLocaleString()}</span>
                    </li>
                  ))}
                </ul> 
              ) : (
                <p className="text-sm text-gray-400 mt-1">No attempts yet.</p>
              )}  
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No quizzes found.</p>
      )}
    </section>


    <section>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">🎁 Redemption History</h3>
      {redemptions?.length > 0 ? (
        <div className="space-y-5">
          {redemptions.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition"
            >
              <div>
                <p className="text-base font-semibold text-green-700 mb-1">
                  Code: <span className="text-black">{item.redemption_code}</span>
                </p>
                 <p className="text-sm text-gray-600">title: {item.quizId?.title}</p>
                
                <p className="text-sm text-gray-600">Company: {item.company_name}</p>
                <p className="text-sm">User: {item.user_id?.name || "Unknown User"}</p>
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      item.status?.toLowerCase() === "used"
                        ? "text-red-600"
                        : item.status?.toLowerCase() === "pending"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {item.status || "Unknown"}
                  </span>
                </p>
                <p>Expires: {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No redemptions yet.</p>
      )}
    </section>
  </>
) : (
  <>
    <h2 className="text-4xl font-extrabold mb-8 text-purple-900">👤 {data.role} Dashboard</h2>

  
    <section className="mb-10">
      <div className="flex justify-between items-center">
       
        <button
          onClick={() => setShowQuizHistory(!showQuizHistory)}
          className="px-5 py-2 bg-purple-700 text-white font-medium rounded hover:bg-purple-800 transition"
        >
          {showQuizHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      {showQuizHistory && (
        <div className="mt-6">
          {quizLoading ? (
            <p className="text-blue-600">Loading quiz history...</p>
          ) : quizHistory?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 mt-4">
              {quizHistory.map((quiz, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-purple-300 p-5 rounded-xl shadow hover:shadow-xl transition"
                >
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{quiz.quizTitle}</h4>
                  <p className="text-sm text-purple-700">
                    <strong>Company:</strong> {quiz.company_name}
                  </p>
                  <p className="text-sm text-purple-700">
                    <strong>Score:</strong> {quiz.score}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Attempted: {quiz.attempted_at ? new Date(quiz.attempted_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-3">No quiz history found.</p>
          )}
        </div>
      )}
    </section>

    <section>
      <div className="mb-4">
        <button
          onClick={() => setShowRedemptionHistory(!showRedemptionHistory)}
          className="px-5 py-2 bg-green-700 text-white font-medium rounded hover:bg-green-800 transition"
        >
          {showRedemptionHistory ? "Hide Redemptions" : "Show Redemptions"}
        </button>
      </div>

      {showRedemptionHistory && (
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">🎁 Redemption History</h3>
          {redemptionLoading ? (
            <p className="text-gray-500">Loading redemption history...</p>
          ) : redemptions?.length ? (
            <div className="space-y-5">
              {redemptions.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow hover:shadow-lg transition"
                >
                  <div>
                    <p className="text-green-700 font-bold text-lg">
                      Code: <span className="text-black">{item.redemption_code}</span>
                    </p>
                    <p className="text-sm text-gray-600">Company: {item.company_name}</p>
                    <p className="text-sm">User: {item.user_id?.name || "Unknown User"}</p>
                  </div>
                  <div className="text-sm">
                    <p>
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          item.status?.toLowerCase() === "used"
                            ? "text-red-600"
                            : item.status?.toLowerCase() === "pending"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.status || "Unknown"}
                      </span>
                    </p>
                    <p className="text-gray-500">Expires: {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No redemptions found.</p>
          )}
        </div>
      )}
    </section>
  </>
)}

</div>

 )
} 