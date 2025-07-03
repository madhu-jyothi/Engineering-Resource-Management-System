
import { useAuth } from './components/useAuth';
import LoginPage from './pages/LoginPage';


import './index.css';
import ManagerDashboard from './pages/ManagerDashboard';
import EngineerDashboard from './pages/EngineerDashboard';

function App() {
  const { user, token, login, logout } = useAuth();
  console.log("user", user)
  if (!user) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="p-4 bg-neutral-light min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">Welcome, {user.name} ({user.role})</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-colors duration-150"
        >
          Logout
        </button>
      </div>
      {user.role === 'manager' ? (
        <ManagerDashboard token={token} />
      ) : user.role === 'engineer' ? (
        <EngineerDashboard token={token} />
      ) : (
        <div className="text-center text-neutral">Unknown role</div>
      )}
    </div>
  );
}

export default App
