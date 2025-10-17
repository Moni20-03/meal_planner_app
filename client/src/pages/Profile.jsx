import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { mealPlansAPI } from '../api';

export default function Profile({ user, onLogout }) {
  const [userStats, setUserStats] = useState({
    totalPlans: 0,
    totalDays: 0,
    memberSince: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const response = await mealPlansAPI.getAll();
      const mealPlans = response.data.meal_plans || [];
      
      // Calculate total plans and days
      const totalPlans = mealPlans.length;
      const totalDays = mealPlans.reduce((sum, plan) => sum + (plan.days || 0), 0);
      
      // Get member since date (use first plan's date or current date)
      const memberSince = mealPlans.length > 0 
        ? new Date(mealPlans[0].created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          })
        : new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
          });

      setUserStats({
        totalPlans,
        totalDays,
        memberSince
      });
    } catch (err) {
      console.error('Failed to load user stats:', err);
      // Set default values if API fails
      setUserStats({
        totalPlans: 0,
        totalDays: 0,
        memberSince: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        })
      });
    } finally {
      setLoading(false);
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
      
      {/* Motivational Quote Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-500 text-white text-center py-4 shadow-md">
        <p className="text-lg italic font-medium">Your journey to better health starts with you! 🌟</p>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Your Profile 🎯
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your account settings and personalize your meal planning experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-xl rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block">
                <img 
                  src="images/avatar.png" 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-primary-500 object-cover mx-auto shadow-lg"
                />
                <div className="absolute bottom-2 right-2 bg-green-500 border-2 border-white rounded-full p-1">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* User Info */}
              <h2 className="text-2xl font-bold text-gray-900 mt-4 uppercase tracking-wide">
                {user?.username}
              </h2>
              <p className="text-gray-600 mt-2">{user?.email}</p>
              
              {/* Stats - Real Data from Database */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600">{userStats.totalPlans}</p>
                  <p className="text-xs text-gray-600">
                    {userStats.totalPlans === 1 ? 'Plan' : 'Plans'}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <p className="text-2xl font-bold text-green-600">{userStats.totalDays}</p>
                  <p className="text-xs text-gray-600">
                    {userStats.totalDays === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
              </div>

              {/* Member Since - Real Data */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Member since</p>
                <p className="text-sm font-medium text-gray-700">{userStats.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Information */}
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt="User" className="w-6 h-6" />
                Account Information
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-primary-500">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-green-500">
                  <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                  <p className="text-sm font-mono text-gray-700 bg-white px-3 py-2 rounded-md border">{user?.id}</p>
                </div>

                {/* Real Statistics */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-xl border border-primary-200">
                  <label className="block text-sm font-medium text-gray-600 mb-3">Your Meal Planning Progress</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">{userStats.totalPlans}</p>
                      <p className="text-xs text-gray-600">Total Plans Created</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{userStats.totalDays}</p>
                      <p className="text-xs text-gray-600">Total Days Planned</p>
                    </div>
                  </div>
                  {userStats.totalPlans > 0 && (
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Great job! You've planned {userStats.totalDays} days of healthy meals! 🎉
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-purple-500">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account Status</label>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-semibold">Active</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {userStats.totalPlans > 5 ? 'Pro Planner' : 
                       userStats.totalPlans > 0 ? 'Active Member' : 'New Member'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Features */}
            <div className="bg-white shadow-xl rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <img src="https://cdn-icons-png.flaticon.com/128/3281/3281342.png" alt="Features" className="w-6 h-6" />
                Exciting Features Coming Soon! 🚀
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <img src="https://cdn-icons-png.flaticon.com/128/13866/13866541.png" alt="Preferences" className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-blue-800">Default Preferences</h4>
                  </div>
                  <p className="text-sm text-blue-700">Set your favorite dietary preferences for quick planning</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt="Templates" className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-green-800">Meal Templates</h4>
                  </div>
                  <p className="text-sm text-green-700">Save and reuse your favorite meal combinations</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <img src="https://cdn-icons-png.flaticon.com/128/1046/1046784.png" alt="PDF" className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-purple-800">PDF Export</h4>
                  </div>
                  <p className="text-sm text-purple-700">Download your meal plans as beautiful PDF documents</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-500 p-2 rounded-lg">
                      <img src="https://cdn-icons-png.flaticon.com/128/2910/2910761.png" alt="Progress" className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-amber-800">Progress Tracking</h4>
                  </div>
                  <p className="text-sm text-amber-700">Track your nutrition goals and health progress</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}