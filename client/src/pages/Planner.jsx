import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { mealPlansAPI } from '../api';

export default function Planner({ user, onLogout }) {
  const [formData, setFormData] = useState({
    days: 7,
    preferences: '',
    servings: 2,
    target_calories: 2000
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await mealPlansAPI.generate(formData);
      navigate(`/plan/${response.data.meal_plan.id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generate Meal Plan</h1>
          <p className="mt-2 text-gray-600">Create a personalized AI-powered meal plan</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                Number of Days
              </label>
              <input
                type="number"
                name="days"
                id="days"
                min="1"
                max="30"
                value={formData.days}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">Between 1 and 30 days</p>
            </div>

            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
                Servings per Meal
              </label>
              <input
                type="number"
                name="servings"
                id="servings"
                min="1"
                max="10"
                value={formData.servings}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">Between 1 and 10 servings</p>
            </div>

            <div>
              <label htmlFor="target_calories" className="block text-sm font-medium text-gray-700">
                Target Daily Calories
              </label>
              <input
                type="number"
                name="target_calories"
                id="target_calories"
                min="500"
                max="5000"
                step="100"
                value={formData.target_calories}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">Between 500 and 5000 calories</p>
            </div>

            <div>
              <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">
                Dietary Preferences / Restrictions
              </label>
              <textarea
                name="preferences"
                id="preferences"
                rows="4"
                value={formData.preferences}
                onChange={handleChange}
                placeholder="e.g., Vegetarian, gluten-free, nut allergy, low-carb, etc."
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">Optional: Specify any dietary needs or preferences</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• AI will generate a complete meal plan based on your preferences</li>
                <li>• Each day includes breakfast, lunch, dinner, and optional snacks</li>
                <li>• Meals include ingredients, nutritional info, and cooking instructions</li>
                <li>• Generation takes 10-30 seconds</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Meal Plan...
                </span>
              ) : (
                'Generate Meal Plan'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
