import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';
import { logout } from './api/sapApi';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    const userName = sessionStorage.getItem('userName');
    const companyDB = sessionStorage.getItem('companyDB');
    if (userName && companyDB) {
      setUser({ name: userName, company: companyDB });
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsLoggedIn(false);
    setView('dashboard');
    setSelectedItem(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (view === 'detail' && selectedItem) {
    return (
      <ArticleDetail
        item={selectedItem}
        user={user}
        onBack={() => setView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onSelectItem={(item) => {
        setSelectedItem(item);
        setView('detail');
      }}
    />
  );
}