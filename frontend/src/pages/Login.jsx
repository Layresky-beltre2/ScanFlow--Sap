import { useState } from 'react';
import { login } from '../api/sapApi';

export default function Login({ onLogin, darkMode, toggleDark }) {
  const [form, setForm] = useState({
    CompanyDB: '',
    UserName: '',
    Password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.CompanyDB || !form.UserName || !form.Password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form);
      onLogin({ name: form.UserName, company: form.CompanyDB });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bg = darkMode ? '#0a1628' : '#0096D6';
  const rightBg = darkMode ? '#0d1f3c' : 'white';
  const textColor = darkMode ? '#e0e0e0' : '#333';
  const inputBg = darkMode ? '#1a2f4e' : 'white';
  const inputBorder = darkMode ? '#2a4a7f' : '#ddd';
  const inputColor = darkMode ? '#e0e0e0' : '#333';
  const btnBg = darkMode ? '#1a56db' : '#0096D6';

  return (
    <div style={{
      display: 'flex', height: '100vh',
      margin: 0, padding: 0, overflow: 'hidden',
      position: 'relative'
    }}>

      {/* Botón modo oscuro */}
    <button
  onClick={toggleDark}
  style={{
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: darkMode ? '#1f2937' : 'white',
    border: darkMode
      ? '1px solid #374151'
      : '1px solid #ddd',
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    fontSize: '20px',
    cursor: 'pointer',
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    transition: 'all 0.3s'
  }}
>
  {darkMode ? '☀️' : '🌙'}
      </button>

      {/* Lado izquierdo */}
      <div style={{
        width: '50%', background: bg,
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', margin: 0, padding: 0
      }}>
        <img src="/Factorizar.svg" alt="SAP" style={{ width: '75%', maxWidth: '380px' }} />
      </div>

      {/* Lado derecho */}
      <div style={{
        width: '50%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px', background: rightBg,
        margin: 0, transition: 'background 0.3s'
      }}>
        <img src="/Login.svg" alt="SAP Logo" style={{ width: '100px', marginBottom: '-10px' }} />
        <h2 style={{ fontStyle: 'italic', color: textColor, marginBottom: '30px' }}>
          ScanFlow - SAP
        </h2>

        {error && (
          <p style={{ color: '#e74c3c', marginBottom: '15px', textAlign: 'center' }}>{error}</p>
        )}

        <input
          name="CompanyDB"
          type="text"
          placeholder="CompanyDB"
          value={form.CompanyDB}
          onChange={handleChange}
          style={{
            width: '100%', maxWidth: '380px',
            padding: '15px 20px', margin: '8px 0',
            border: `1px solid ${inputBorder}`,
            borderRadius: '30px', fontSize: '16px',
            outline: 'none', background: inputBg,
            color: inputColor, transition: 'all 0.3s'
          }}
        />
        <input
          name="UserName"
          type="text"
          placeholder="Username"
          value={form.UserName}
          onChange={handleChange}
          style={{
            width: '100%', maxWidth: '380px',
            padding: '15px 20px', margin: '8px 0',
            border: `1px solid ${inputBorder}`,
            borderRadius: '30px', fontSize: '16px',
            outline: 'none', background: inputBg,
            color: inputColor, transition: 'all 0.3s'
          }}
        />
        <input
          name="Password"
          type="password"
          placeholder="Password"
          value={form.Password}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%', maxWidth: '380px',
            padding: '15px 20px', margin: '8px 0',
            border: `1px solid ${inputBorder}`,
            borderRadius: '30px', fontSize: '16px',
            outline: 'none', background: inputBg,
            color: inputColor, transition: 'all 0.3s'
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', maxWidth: '380px',
            padding: '15px', marginTop: '20px',
            background: btnBg, color: 'white',
            border: 'none', borderRadius: '30px',
            fontSize: '18px', fontStyle: 'italic',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.3s'
          }}
        >
          {loading ? 'Conectando...' : 'acceder'}
        </button>
      </div>
    </div>
  );
}