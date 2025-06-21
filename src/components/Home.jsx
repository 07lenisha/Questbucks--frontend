
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const { isLoggedIn } = useSelector((state) => state.users);

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-pink-100 via-purple-200 to-blue-200 overflow-hidden text-gray-900 font-sans">

      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-pink-300 opacity-30 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-40 right-20 w-52 h-52 rounded-full bg-purple-300 opacity-25 blur-3xl animate-pulse-slower"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-300 opacity-20 blur-3xl"></div>

      <div className="absolute top-0 left-0 w-[60vw] h-full bg-pink-300 skew-x-[-15deg] origin-top-left opacity-60"></div>
      <div className="absolute top-0 right-0 w-[40vw] h-full bg-purple-300 skew-x-[15deg] origin-top-right opacity-60"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 flex flex-col lg:flex-row justify-between gap-16">

        <div className="flex-1 max-w-xl space-y-10 text-gray-900">
          <h1 className="text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md text-pink-600 -ml-2 sm:-ml-4">

            Questbucks — <span className="text-purple-700 font-serif italic">Earn Discounts While You Learn</span>
          </h1>

          <p className="text-lg text-purple-700 font-semibold tracking-wide">
            Dive into interactive quizzes crafted by top brands — discover insider
            product knowledge AND score exclusive discounts and perks. Why just shop
            when you can save while you learn?
          </p>

          <div className="space-y-6 text-purple-600 text-base leading-relaxed">
            {[
              "🎯 Master Products Like a Pro — Quizzes designed to reveal what you really need to know.",
              "💸 Score Exclusive Deals — Each correct answer brings you closer to real savings and special offers.",
              "🔥 Boost Your Shopper Status — Engage with brands, early access to new products, and personalized perks tailored just for you.",
            ].map((text, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-pink-100/50 rounded-lg p-4 hover:bg-pink-200 transition cursor-default shadow-md"
              >
                <span className="text-xl">{text.slice(0, 2)}</span>
                <p>{text.slice(3)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 max-w-md bg-white rounded-xl p-12 shadow-xl flex flex-col justify-between h-[580px]">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-pink-500 tracking-wide">
              Ready to Unlock Rewards?
            </h2>

            {!isLoggedIn ? (
              <div className="space-y-6">
                <Link
                  to="/register"
                  className="block w-full text-center bg-pink-400 hover:bg-pink-500 transition rounded-full py-4 text-xl font-extrabold shadow-md transform hover:scale-105 duration-300 text-white"
                >
                  Create Your Account
                </Link>
                <Link
                  to="/login"
                  className="block w-full text-center bg-purple-500 hover:bg-purple-600 transition rounded-full py-4 text-xl font-extrabold shadow-md transform hover:scale-105 duration-300 text-white"
                >
                  Login to Continue
                </Link>
              </div>
            ) : (
              <p className="text-pink-600 font-semibold text-center mt-16 text-lg">
                You are logged in! Explore quizzes and start earning exclusive discounts
               
              </p>
            )}
          </div>

          <blockquote className="mt-12 italic text-purple-500 font-semibold border-l-4 border-pink-400 pl-6 tracking-wide">
            &quot;Questbucks helped me level up my product knowledge while enjoying amazing
            savings. It’s the best way to shop smarter!&quot;
            <br />
            <span className="block mt-2 text-sm font-normal text-purple-700">
              – Taylor, savvy shopper
            </span>
          </blockquote>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-pink-200 via-purple-300 opacity-70"></div>
    </div>
  );
}

