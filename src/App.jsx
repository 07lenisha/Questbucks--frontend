import { Route, Routes, Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logout, fetchuserAccount } from "./slices/UserSlice";
import { useEffect } from 'react';
import Dashboard from "./components/Dashboard"
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from "./components/ProtectedRoute";
import Quiz from './components/Quiz';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import Profile from './components/Profile';
import Register from './components/Register';
import Login from './components/Login';
import TakeQuiz from './components/TakeQuiz';
import SearchRedemptions from './components/SearchRedemptions';
import SubscriptionPage from './components/SubscriptionPage';
import SubscriptionList from './components/SubscriptionList';
import AdminCompanyStatusManager from './components/AdminCompanyStatusManager';
import Companyquishistory from './components/Companyquishistory';
export default function App() {
  const { isLoggedIn ,data} = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(fetchuserAccount());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full p-4">

  <header className="bg-white shadow text-center sticky top-0 z-30 h-[72px] flex items-center justify-center">
    <h1
      className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 inline-block"
      style={{
        fontFamily: "'Pacifico', cursive",
        fontWeight: 'normal',
        paddingLeft: '0.5rem',
        lineHeight: 1.6,
        letterSpacing: '0.02em',
      }}
    >
      Questbucks
    </h1>
  </header>

<nav className="bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 gap-5 text-white px-5 py-2 shadow-lg sticky top-[72px] z-20">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
  
    <ul className="flex gap-5 flex-grow text-lg font-semibold tracking-wide uppercase select-none">
      <li>
        <Link
          to="/"
          className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
        >
          Home
        </Link>
      </li>

      {isLoggedIn ? (
        <>
          <li>
            <Link
              to="/dashboard"
              className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Dashboard
            </Link>
          </li>

          <li>
            {data.role === "company" && data.subscription_status === "active" && (
              <Link
                to="/quiz"
                className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                quiz
              </Link>
            )}
          </li>

          <li>
            {data.role === "user" && (
              <Link
                to={`/take-quiz`}
                className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                take quiz
              </Link>
            )}
          </li>

          <li>
            {data.role === "user" && (
              <Link
                to={`/redeem-code`}
                className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                redeem-code
              </Link>
            )}
          </li>

          {(data.role === "company" || data.role === "admin") && (
            <li>
              <Link
                to={`/subscriptions`}
                className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                subscription-status
              </Link>
            </li>
          )}

          {data.role === "admin" && (
            <>
              <li>
                <Link
                  to="/admin/activation"
                  className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  Manage Companies
                </Link>
              </li>

              <li>
                <Link
                  to="/companyhistory"
                  className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  company-history
                </Link>
              </li>
            </>
          )}
        </>
      ) : (
        <>
          <li>
            <Link
              to="/register"
              className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-pink-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              Login
            </Link>
          </li>
        </>
      )}
    </ul>

   
    {isLoggedIn && (
      <div className="flex items-center gap-7">
        {data.role === "company" ? (
          data.subscription_status === "active" ? (
            <>
            

              <Link
                to="/account"
                className="flex items-center  bg-pink-500 hover:bg-pink-600 transition text-white rounded-full px-4 py-2 font-semibold shadow-md hover:shadow-lg"
                aria-label="My Account"
              >
                <span role="img" aria-label="User">
                  👤
                </span>{" "}
                My Account
              </Link>
            </>
          ) : (
            <Link
              to="/subscribe"
              className="bg-yellow-500 hover:bg-yellow-600 transition px-5 py-2 rounded-full text-white font-semibold shadow-md hover:shadow-lg"
            >
              Subscribe Me
            </Link>
          )
        ) : (
          <>
          
            <Link
              to="/account"
              className="flex items-center  bg-pink-500 hover:bg-pink-600 transition text-white rounded-full px-4 py-2 font-semibold shadow-md hover:shadow-lg"
              aria-label="My Account"
            >
              <span role="img" aria-label="User">
                👤
              </span>{" "}
              My Account
            </Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="bg-purple-800 hover:bg-purple-900 transition px-5 py-2 rounded-full text-white font-semibold shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    )}
  </div>
</nav>


     
      <main className>
        <div className>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
           <Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/> 
<Route
  path="/companyhistory"
  element={
    <PrivateRoute>
      <ProtectedRoute roles={[ "admin"]}>
      <Companyquishistory/>
      </ProtectedRoute>
    </PrivateRoute>
  }
/>

<Route
  path="/quiz"
  element={
    <PrivateRoute>
      <ProtectedRoute roles={[ "company"]}>
      <Quiz/>
      </ProtectedRoute>
    </PrivateRoute>
  }
/>
<Route
  path="/take-quiz"
  element={
    <PrivateRoute roles={["user"]}>
      <TakeQuiz />
    </PrivateRoute>
  }
/> 
<Route
  path="/redeem-code"
  element={
    <PrivateRoute roles={["user"]}>
      <SearchRedemptions/>
    </PrivateRoute>
  }
/>

<Route
  path="/subscribe"
  element={
    <PrivateRoute roles={["company"]}>
      
        <SubscriptionPage/>
      
    </PrivateRoute>
  }
/>
<Route
  path="/admin/activation"
  element={
    <PrivateRoute roles={["admin"]}>
      <AdminCompanyStatusManager />
    </PrivateRoute>
  }
/>
  {/* other routes */}
 

<Route
        path="/take-quiz/:id"
        element={
          <PrivateRoute roles={["user"]}>
            <TakeQuiz />
          </PrivateRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <PrivateRoute roles={["company","admin"]}>
            <SubscriptionList/>
          </PrivateRoute>
        }
      />
 
 <Route path="/takequiz/:id"  element={
    <PrivateRoute roles={["user"]}>
      <TakeQuiz />
    </PrivateRoute>
  }/>
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <ProtectedRoute roles={["user", "admin", "company"]}>
                    <Profile />
                  </ProtectedRoute>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 text-center text-sm text-gray-600 py-4">
        &copy; {new Date().getFullYear()} <span className="font-medium text-purple-600">Questbucks</span>. All rights reserved.
      </footer>
    </div>
  );
}
