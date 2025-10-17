import { Link } from 'react-router-dom';
import { Home, PlusCircle, LogOut, User } from 'lucide-react';
export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Logo + Nav */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-2xl font-extrabold text-primary-600 hover:text-primary-700 flex items-center space-x-1"
            >
              <span>🍽️</span>
              <span>AI Meal Planner</span>
            </Link>

            <nav className="hidden md:flex space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>

              <Link 
                to="/planner" 
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition"
              >
                <PlusCircle size={18} />
                <span>Generate Plan</span>
              </Link>
            </nav>
          </div>

          {/* Right: User + Logout */}
<div className="flex items-center space-x-5">
  {/* Avatar + Name */}
  <Link to="/profile" className="flex items-center space-x-3 group">
    <img 
      src="images/avatar.png"
      alt="User Avatar" 
      className="w-12 h-12 rounded-full border-2 border-primary-500 object-cover group-hover:scale-105 transition-transform shadow-sm"
    />
    <span className="hidden sm:block text-lg font-bold uppercase text-gray-800 group-hover:text-primary-600 tracking-wide">
      {user?.username || 'Profile'}
    </span>
  </Link>

  {/* Logout Button */}
  <button
    onClick={onLogout}
    className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-transform transform hover:scale-105"
  >
    <LogOut size={18} />
    <span>Logout</span>
  </button>
</div>
        </div>
      </div>
    </header>
  );
}
