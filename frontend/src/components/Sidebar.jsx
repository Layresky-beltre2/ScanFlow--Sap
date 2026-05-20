export default function Sidebar({ user, activeView, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/sap-logo.png" alt="SAP" />
      </div>

      <nav className="sidebar-nav">
        <button
          className={activeView === 'dashboard' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeView === 'items' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onNavigate('items')}
        >
          Items
        </button>
      </nav>

      <div className="sidebar-user">
        <div className="user-avatar">👤</div>
        <button className="logout-btn" onClick={onLogout}>
          → Logout
        </button>
        <p className="user-name">{user?.name} - {user?.company}</p>
      </div>
    </aside>
  );
}