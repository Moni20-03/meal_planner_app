import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { mealPlansAPI } from '../api';

export default function PlanView({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    try {
      const response = await mealPlansAPI.getOne(id);
      setPlan(response.data.meal_plan);
    } catch (err) {
      setError('Failed to load meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      try {
        await mealPlansAPI.delete(id);
        navigate('/dashboard');
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

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Meal plan not found'}
          </div>
        </div>
      </div>
    );
  }

  const planContent = plan.plan_content;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {planContent.title || `${plan.days}-Day Meal Plan`}
            </h1>
            <p className="mt-2 text-gray-600">
              {plan.days} days • {plan.servings} servings • {plan.target_calories} cal/day
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Delete Plan
            </button>
          </div>
        </div>

        {/* Summary */}
        {planContent.summary && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="text-lg font-medium">{planContent.summary.total_days}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Daily Calories</p>
                <p className="text-lg font-medium">{planContent.summary.avg_daily_calories}</p>
              </div>
              {planContent.summary.dietary_notes && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Dietary Notes</p>
                  <p className="text-sm">{planContent.summary.dietary_notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Days */}
        <div className="space-y-6">
          {planContent.days?.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="bg-primary-600 text-white px-6 py-4">
                <h2 className="text-xl font-semibold">
                  Day {day.day} - {day.date}
                </h2>
                <p className="text-sm text-primary-100">
                  Total: {day.total_calories} calories
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {day.meals?.map((meal, mealIndex) => (
                  <div key={mealIndex} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{meal.type}</h3>
                        <p className="text-xl text-gray-700 mt-1">{meal.name}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          {meal.calories} cal
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {meal.ingredients?.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Nutrition</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600">Protein</p>
                            <p className="font-medium">{meal.protein}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Carbs</p>
                            <p className="font-medium">{meal.carbs}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fat</p>
                            <p className="font-medium">{meal.fat}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {meal.instructions && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Instructions</h4>
                        <p className="text-sm text-gray-600">{meal.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
