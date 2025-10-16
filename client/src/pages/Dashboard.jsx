import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { dashboardAPI, mealPlansAPI } from '../api';

export default function Dashboard({ user, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
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
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await mealPlansAPI.delete(planId);
        setMealPlans(mealPlans.filter(plan => plan.id !== planId));
      } catch (err) {
        alert('Failed to delete meal plan');
      }
    }
  };

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
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user?.username}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Meal Plans</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary?.statistics?.total_meal_plans || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Days Planned</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary?.statistics?.total_days_planned || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Calories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {summary?.statistics?.average_target_calories || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <Link
            to="/planner"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Generate New Meal Plan
          </Link>
        </div>

        {/* Meal Plans List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Meal Plans</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {mealPlans.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">No meal plans yet. Generate your first one!</p>
              </div>
            ) : (
              mealPlans.map((plan) => (
                <div key={plan.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {plan.plan_content?.title || `${plan.days}-Day Meal Plan`}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {plan.days} days • {plan.servings} servings • {plan.target_calories} cal/day
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Preferences: {plan.preferences}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created: {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/plan/${plan.id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
