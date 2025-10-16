import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dashboardAPI, mealPlansAPI } from '../api';

export default function Dashboard({ user, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quotes, setQuotes] = useState([
    "Fuel your body, empower your mind.",
    "Small steps every day lead to big changes.",
    "Eat better, live better.",
    "Discipline is the ingredient of success.",
    "A healthy outside starts from the inside."
  ]);
  const [currentQuote, setCurrentQuote] = useState('');
  
  useEffect(() => {
    loadDashboard();
    // Rotate quotes every 5 seconds
    setCurrentQuote(quotes[0]);
    let index = 1;
    const quoteInterval = setInterval(() => {
      setCurrentQuote(quotes[index]);
      index = (index + 1) % quotes.length;
    }, 5000);

    return () => clearInterval(quoteInterval);
  }, []);

  const loadDashboard = async () => {
    try {
      const [summaryRes, plansRes] = await Promise.all([
        dashboardAPI.getSummary(),
        mealPlansAPI.getAll()
      ]);
      setSummary(summaryRes.data);
      setMealPlans(plansRes.data.meal_plans);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
  if (window.confirm('Are you sure you want to delete this meal plan? This action cannot be undone.')) {
    try {
      await mealPlansAPI.delete(planId);
      // Refresh the meal plans list after successful deletion
      const plansRes = await mealPlansAPI.getAll();
      setMealPlans(plansRes.data.meal_plans);
      
      // Optionally show a success message
      // alert('Meal plan deleted successfully!');
    } catch (err) {
      alert('Failed to delete meal plan. Please try again.');
    }
  }
};

  // Number count-up animation
  const useCountUp = (end) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      let start = 1;
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / end || 1));
      const timer = setInterval(() => {
        start += 1;
        if (start > end) {
          clearInterval(timer);
          setCount(end);
        } else {
          setCount(start);
        }
      }, stepTime);
      return () => clearInterval(timer);
    }, [end]);
    return count;
  };

  const totalPlans = useCountUp(summary?.statistics?.total_meal_plans || 0);
  const totalDays = useCountUp(summary?.statistics?.total_days_planned || 0);
  const avgCalories = useCountUp(summary?.statistics?.average_target_calories || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />

      {/* Motivational Quote Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 text-white text-center py-6 shadow-md">
        <p className="text-xl italic font-medium animate-fadeIn">{currentQuote}</p>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Powerful Welcome Message */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome, {user?.username || 'Champion'}! 💪
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

    {/* Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      {/* Card 1 */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-xl transition">
        {/* Left Icon */}
        <div className="p-2 rounded-full flex items-center justify-center">
          <img
            src="https://cdn-icons-gif.flaticon.com/13373/13373355.gif" 
            alt="Meal Icon"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Center */}
        <div className="text-center flex-1 mx-2">
          <p className="text-sm font-medium text-gray-900">Total Meal Plans</p>
          <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
        </div>

        {/* Right Icon */}
        <div className="flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/4721/4721217.png"
            alt="Meal Plan Illustration"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-xl transition">
        {/* Left Icon */}
        <div className="p-2 rounded-full flex items-center justify-center">
          <img
            src="https://cdn-icons-gif.flaticon.com/14464/14464212.gif" 
            alt="Days Icon"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Center */}
        <div className="text-center flex-1 mx-2">
          <p className="text-sm font-medium text-gray-900">Days Planned</p>
          <p className="text-2xl font-bold text-gray-900">{totalDays}</p>
        </div>

        {/* Right Icon */}
        <div className="flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/1410/1410594.png"
            alt="Planner Illustration"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between hover:shadow-xl transition">
        {/* Left Icon */}
        <div className="p-2 rounded-full flex items-center justify-center">
          <img
            src="https://cdn-icons-gif.flaticon.com/11615/11615140.gif"
            alt="Calories Icon"
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Center */}
        <div className="text-center flex-1 mx-2">
          <p className="text-sm font-medium text-gray-900">Avg. Calories</p>
          <p className="text-2xl font-bold text-gray-900">{avgCalories}</p>
        </div>

        {/* Right Icon */}
        <div className="flex items-center justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/10008/10008832.png"
            alt="Calorie Illustration"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>
    </div>

              {/* Meal Plans List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Meal Plans</h2>
            <Link
              to="/planner"
              className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
              title="Generate New Meal Plan"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {mealPlans.length === 0 ? (
              <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
                <p className="text-base sm:text-lg text-gray-500 mb-4">No meal plans yet. Click + to create your first one!</p>
              </div>
            ) : (
              mealPlans.map((plan) => {
                // Generate a consistent random image based on plan id
                const foodImages = [
                  "https://cdn-icons-png.flaticon.com/256/4796/4796240.png",
                  "https://cdn-icons-png.flaticon.com/256/9905/9905406.png",
                  "https://cdn-icons-png.flaticon.com/256/9470/9470765.png",
                  "https://cdn-icons-png.flaticon.com/256/4796/4796222.png",
                  "https://cdn-icons-png.flaticon.com/256/6122/6122897.png",
                  "https://cdn-icons-png.flaticon.com/256/7998/7998031.png",
                  "https://cdn-icons-png.flaticon.com/256/9496/9496790.png",
                  "https://cdn-icons-png.flaticon.com/256/9496/9496795.png",
                  "https://cdn-icons-png.flaticon.com/256/6820/6820098.png",
                ];
                
                // Use plan id to get consistent random image
                const randomIndex = Math.abs(plan.id) % foodImages.length;
                const planImage = foodImages[randomIndex];

                return (
                  <div
                    key={plan.id}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center px-4 sm:px-6 py-4 sm:py-6 hover:bg-blue-50 transition-all rounded-lg my-2 shadow-sm hover:shadow-md"
                  >
                    {/* Column 1: Icon + Plan Title + Days */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      <img
                        src={planImage}
                        alt="Food Icon"
                        className="w-10 h-10 sm:w-12 sm:h-12 mb-1"
                      />
                      <p className="text-base sm:text-lg font-semibold text-teal-800">
                        {`${plan.days}-DAY MEAL PLAN`}
                      </p>
                    </div>

                    {/* Column 2: Servings + Calories */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="text-sm sm:text-base font-medium text-amber-600 flex items-center gap-1">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/7306/7306565.png"
                          alt="Calories"
                          className="w-4 h-4 sm:w-5 sm:h-5"
                        />
                        {plan.target_calories} cal/day
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 font-medium">
                        {plan.servings} servings
                      </p>
                    </div>

                    {/* Column 3: Preferences + Created */}
                    <div className="flex flex-col items-center text-center space-y-2">
                      <p className="text-xs sm:text-sm text-rose-600 flex items-center gap-1 font-medium">
                        <img
                          src="https://cdn-icons-png.flaticon.com/128/13866/13866541.png"
                          alt="Preferences"
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        Preferences: {plan.preferences || "None"}
                      </p>
                    </div>

                    {/* Column 4: Action Buttons */}
                    <div className="flex flex-row space-x-2 sm:space-x-3 justify-center items-center">
                      <Link
                        to={`/plan/${plan.id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-semibold shadow-sm transform transition duration-300 hover:scale-105 hover:shadow-lg text-center min-w-[60px] sm:min-w-[80px]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-semibold shadow-sm transform transition duration-300 hover:scale-105 hover:shadow-lg text-center min-w-[60px] sm:min-w-[80px]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
