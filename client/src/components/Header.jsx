import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
              🍽️ AI Meal Planner
            </Link>
            <nav className="hidden md:flex space-x-4">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                to="/planner" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Generate Plan
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="text-gray-700 hover:text-primary-600"
            >
              <span className="text-sm font-medium">{user?.username || 'Profile'}</span>
            </Link>
            <button
              onClick={onLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
