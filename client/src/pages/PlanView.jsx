import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import Header from '../components/Header';
import { mealPlansAPI } from '../api';

export default function PlanView({ user, onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    loadPlan();
  }, [id]);

  const loadPlan = async () => {
    try {
      const response = await mealPlansAPI.getOne(id);
      const planData = response.data.meal_plan;
      setPlan(planData);
      setEditData({
        days: planData.days,
        servings: planData.servings,
        target_calories: planData.target_calories,
        preferences: planData.preferences || ''
      });
    } catch (err) {
      setError('Failed to load meal plan. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meal plan? This action cannot be undone.')) {
      try {
        await mealPlansAPI.delete(id);
        navigate('/dashboard');
      } catch (err) {
        alert('Failed to delete meal plan. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update the plan with new basic data
      const updateResponse = await mealPlansAPI.update(id, editData);
      const updatedPlan = updateResponse.data.meal_plan;
      
      // Update the plan content to reflect the changes
      const updatedPlanContent = updatePlanContent(updatedPlan.plan_content, editData);
      
      // Set the complete updated plan
      setPlan({
        ...updatedPlan,
        plan_content: updatedPlanContent
      });
      
      setEditing(false);
      alert('Meal plan updated successfully!');
    } catch (err) {
      alert('Failed to update meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to update plan content based on new parameters
  const updatePlanContent = (planContent, newData) => {
    if (!planContent) return planContent;

    const updatedContent = { ...planContent };
    
    // Update summary
    if (updatedContent.summary) {
      updatedContent.summary = {
        ...updatedContent.summary,
        total_days: newData.days,
        avg_daily_calories: newData.target_calories,
        dietary_notes: newData.preferences || updatedContent.summary.dietary_notes
      };
    }
    
    // Update days array if days count changed
    if (updatedContent.days) {
      if (newData.days > updatedContent.days.length) {
        // Add more days
        const daysToAdd = newData.days - updatedContent.days.length;
        for (let i = 0; i < daysToAdd; i++) {
          const newDayNumber = updatedContent.days.length + 1;
          updatedContent.days.push(createNewDay(newDayNumber, newData.target_calories));
        }
      } else if (newData.days < updatedContent.days.length) {
        // Remove extra days
        updatedContent.days = updatedContent.days.slice(0, newData.days);
      }
      
      // Update each day's total calories and meal calories
      updatedContent.days = updatedContent.days.map(day => ({
        ...day,
        total_calories: newData.target_calories,
        meals: day.meals?.map(meal => ({
          ...meal,
          calories: Math.round(meal.calories * (newData.target_calories / plan.target_calories))
        }))
      }));
    }
    
    // Update title
    updatedContent.title = `${newData.days}-Day ${newData.preferences ? newData.preferences + ' ' : ''}Meal Plan`;
    
    return updatedContent;
  };

  // Helper function to create a new day
  const createNewDay = (dayNumber, targetCalories) => {
    const breakfastCalories = Math.round(targetCalories * 0.25);
    const lunchCalories = Math.round(targetCalories * 0.35);
    const dinnerCalories = Math.round(targetCalories * 0.35);
    
    return {
      day: dayNumber,
      date: `Day ${dayNumber}`,
      total_calories: targetCalories,
      meals: [
        {
          type: "Breakfast",
          name: "Custom Meal",
          ingredients: ["Custom ingredients based on your preferences"],
          calories: breakfastCalories,
          protein: "15g",
          carbs: "45g",
          fat: "10g",
          instructions: "Prepare according to your dietary preferences."
        },
        {
          type: "Lunch",
          name: "Custom Meal",
          ingredients: ["Custom ingredients based on your preferences"],
          calories: lunchCalories,
          protein: "20g",
          carbs: "50g",
          fat: "15g",
          instructions: "Prepare according to your dietary preferences."
        },
        {
          type: "Dinner",
          name: "Custom Meal",
          ingredients: ["Custom ingredients based on your preferences"],
          calories: dinnerCalories,
          protein: "25g",
          carbs: "40g",
          fat: "20g",
          instructions: "Prepare according to your dietary preferences."
        }
      ]
    };
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset edit data to original values
    setEditData({
      days: plan.days,
      servings: plan.servings,
      target_calories: plan.target_calories,
      preferences: plan.preferences || ''
    });
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
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
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Meal Plan</h3>
                <p className="text-sm text-red-700 mt-1">{error || 'Meal plan not found'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const planContent = plan.plan_content;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      {/* Motivational Quote Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 text-white text-center py-4 shadow-md">
        <p className="text-lg italic font-medium">Your journey to better health starts here! 🌟</p>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src="/images/avatar.png" 
                  alt="Meal Plan" 
                  className="w-9 h-9"
                />
                <h1 className="text-3xl font-bold text-gray-900">
                  {planContent.title || `${plan.days}-Day Meal Plan`}
                </h1>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {editing ? (
                  <>
                    <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/1250/1250615.png" alt="Days" className="w-4 h-4" />
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={editData.days}
                        onChange={(e) => handleEditChange('days', parseInt(e.target.value))}
                        className="w-12 bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-500 text-center"
                      />
                      days
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/1046/1046784.png" alt="Servings" className="w-4 h-4" />
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editData.servings}
                        onChange={(e) => handleEditChange('servings', parseInt(e.target.value))}
                        className="w-12 bg-transparent border-b border-green-300 focus:outline-none focus:border-green-500 text-center"
                      />
                      servings
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/7306/7306565.png" alt="Calories" className="w-4 h-4" />
                      <input
                        type="number"
                        min="500"
                        max="5000"
                        value={editData.target_calories}
                        onChange={(e) => handleEditChange('target_calories', parseInt(e.target.value))}
                        className="w-20 bg-transparent border-b border-amber-300 focus:outline-none focus:border-amber-500 text-center"
                      />
                      cal/day
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/1250/1250615.png" alt="Days" className="w-4 h-4" />
                      {plan.days} days
                    </span>
                    <span className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/1046/1046784.png" alt="Servings" className="w-4 h-4" />
                      {plan.servings} servings
                    </span>
                    <span className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/7306/7306565.png" alt="Calories" className="w-4 h-4" />
                      {plan.target_calories} cal/day
                    </span>
                  </>
                )}
                {editing ? (
                  <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                    <img src="https://cdn-icons-png.flaticon.com/128/13866/13866541.png" alt="Preferences" className="w-4 h-4" />
                    <input
                      type="text"
                      value={editData.preferences}
                      onChange={(e) => handleEditChange('preferences', e.target.value)}
                      placeholder="Dietary preferences"
                      className="bg-transparent border-b border-purple-300 focus:outline-none focus:border-purple-500 text-center min-w-32"
                    />
                  </div>
                ) : (
                  plan.preferences && (
                    <span className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                      <img src="https://cdn-icons-png.flaticon.com/128/13866/13866541.png" alt="Preferences" className="w-4 h-4" />
                      {plan.preferences}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-sm transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-sm transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-sm transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Plan
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-200 shadow-sm transform hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Plan
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        {planContent.summary && (
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border-l-4 border-primary-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <img src="https://cdn-icons-png.flaticon.com/128/3281/3281342.png" alt="Summary" className="w-6 h-6" />
              Plan Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">Total Days</p>
                <p className="text-2xl font-bold text-primary-600">{planContent.summary.total_days}</p>
              </div>
              <div className="text-center bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">Avg Daily Calories</p>
                <p className="text-2xl font-bold text-green-600">{planContent.summary.avg_daily_calories}</p>
              </div>
              <div className="text-center bg-amber-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 font-medium">Total Servings</p>
                <p className="text-2xl font-bold text-amber-600">{plan.days * plan.servings}</p>
              </div>
            </div>
            {planContent.summary.dietary_notes && (
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Dietary Notes</h4>
                <p className="text-sm text-gray-600">{planContent.summary.dietary_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Meal Plan Days */}
        <div className="space-y-8">
          {planContent.days?.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Day {day.day} 
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">
                      Total Calories: <span className="font-semibold">{day.total_calories}</span>
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-primary-700">
                      {Math.round(day.total_calories / plan.target_calories * 100)}% of daily goal
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Meals */}
              <div className="divide-y divide-gray-100">
                {day.meals?.map((meal, mealIndex) => (
                  <div key={mealIndex} className="p-6 hover:bg-gray-50 transition duration-200">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {meal.type}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">{meal.name}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-2 rounded-xl text-sm font-bold bg-orange-100 text-orange-800 shadow-sm">
                          <img src="https://cdn-icons-png.flaticon.com/128/7306/7306565.png" alt="Calories" className="w-4 h-4 mr-1" />
                          {meal.calories} cal
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Ingredients */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <img src="https://cdn-icons-png.flaticon.com/128/1046/1046784.png" alt="Ingredients" className="w-4 h-4" />
                          Ingredients
                        </h4>
                        <ul className="space-y-2">
                          {meal.ingredients?.map((ingredient, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Nutrition & Instructions */}
                      <div className="space-y-4">
                        {/* Nutrition Info */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <img src="https://cdn-icons-png.flaticon.com/128/3281/3281342.png" alt="Nutrition" className="w-4 h-4" />
                            Nutrition Facts
                          </h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center bg-blue-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Protein</p>
                              <p className="text-sm font-bold text-blue-700">{meal.protein}</p>
                            </div>
                            <div className="text-center bg-green-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Carbs</p>
                              <p className="text-sm font-bold text-green-700">{meal.carbs}</p>
                            </div>
                            <div className="text-center bg-amber-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600">Fat</p>
                              <p className="text-sm font-bold text-amber-700">{meal.fat}</p>
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        {meal.instructions && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <img src="https://cdn-icons-png.flaticon.com/128/3281/3281342.png" alt="Instructions" className="w-4 h-4" />
                              Instructions
                            </h4>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{meal.instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
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