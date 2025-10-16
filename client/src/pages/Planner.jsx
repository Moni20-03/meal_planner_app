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
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          err.response?.data?.message ||
                          'Failed to generate meal plan. Please check your inputs and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      {/* Motivational Quote Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 text-white text-center py-4 shadow-md">
        <p className="text-lg italic font-medium">Plan your meals, transform your health! 🍎</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Create Your Perfect Meal Plan 🍽️
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Customize your nutrition journey with personalized meal plans tailored to your goals and preferences.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-fadeIn">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Unable to Generate Meal Plan</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Meal Plan Configuration</h2>
            <p className="text-primary-100 mt-1">Fill in your preferences to generate a customized plan</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Grid Layout for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Days Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/1250/1250615.png" 
                      alt="Calendar" 
                      className="w-6 h-6"
                    />
                  </div>
                  <label htmlFor="days" className="block text-lg font-semibold text-gray-800">
                    Plan Duration
                  </label>
                </div>
                <input
                  type="number"
                  name="days"
                  id="days"
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                />
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Choose between 1 and 30 days for your meal plan
                </p>
              </div>

              {/* Servings Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/3521/3521958.png" 
                      alt="Servings" 
                      className="w-6 h-6"
                    />
                  </div>
                  <label htmlFor="servings" className="block text-lg font-semibold text-gray-800">
                    Servings per Meal
                  </label>
                </div>
                <input
                  type="number"
                  name="servings"
                  id="servings"
                  min="1"
                  max="10"
                  value={formData.servings}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                />
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Perfect for {formData.servings} {formData.servings === 1 ? 'person' : 'people'}
                </p>
              </div>

              {/* Calories Input */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/7306/7306565.png" 
                      alt="Calories" 
                      className="w-6 h-6"
                    />
                  </div>
                  <label htmlFor="target_calories" className="block text-lg font-semibold text-gray-800">
                    Daily Calories
                  </label>
                </div>
                <input
                  type="number"
                  name="target_calories"
                  id="target_calories"
                  min="500"
                  max="5000"
                  step="100"
                  value={formData.target_calories}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200"
                />
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                  Target: {formData.target_calories.toLocaleString()} calories per day
                </p>
              </div>

              {/* Preferences Section - Full Width */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/128/13866/13866541.png" 
                      alt="Preferences" 
                      className="w-6 h-6"
                    />
                  </div>
                  <label htmlFor="preferences" className="block text-lg font-semibold text-gray-800">
                    Dietary Preferences
                  </label>
                </div>
                <textarea
                  name="preferences"
                  id="preferences"
                  rows="4"
                  value={formData.preferences}
                  onChange={handleChange}
                  placeholder="Tell us about your dietary needs... e.g., Vegetarian, Gluten-free, Nut allergy, Low-carb, Dairy-free, Keto, Mediterranean diet, etc."
                  className="mt-1 block w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-200 resize-vertical"
                />
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Optional: Specify any dietary restrictions, allergies, or preferences
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-primary-200 transform transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center space-x-3">
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating Your Perfect Meal Plan...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Generate My Meal Plan 🚀</span>
                  </span>
                )}
              </button>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">Pro Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    For best results, be specific about your dietary preferences. The more details you provide, the better we can tailor your meal plan!
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}