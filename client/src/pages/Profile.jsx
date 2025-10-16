import Header from '../components/Header';

export default function Profile({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Your account information</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg text-gray-900">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-500">{user?.id}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Future Features</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Update profile information</li>
              <li>• Change password</li>
              <li>• Set default dietary preferences</li>
              <li>• Manage saved meal templates</li>
              <li>• Export meal plans to PDF</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
