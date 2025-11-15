import { Lock } from 'lucide-react';
export const Login = ({handleLogin, passwordInput, setPasswordInput, passwordError}) => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-emerald-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
              <p className="text-gray-500 text-sm">Enter the admin password to continue</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }