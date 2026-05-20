import { useState } from 'react';
import { login } from '../api/sapApi';

export default function Login({ onLogin }) {
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

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0 }}>

      {/* Lado izquierdo azul */}
      <div style={{
        width: '50%',
        background: '#0096D6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src="/Nubesb1.svg" alt="SAP Cloud" style={{ width: '80%', maxWidth: '400px' }} />
      </div>

      {/* Lado derecho blanco */}
      <div style={{
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        background: 'white'
      }}>
        <img src="/Login.svg" alt="SAP Logo" style={{ width: '80px', marginBottom: '10px' }} />
        <h2 style={{ fontStyle: 'italic', color: '#333', marginBottom: '30px' }}>ScanFlow - SAP</h2>

        {error && (
          <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>
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
            border: '1px solid #ddd', borderRadius: '30px',
            fontSize: '16px', outline: 'none'
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
            border: '1px solid #ddd', borderRadius: '30px',
            fontSize: '16px', outline: 'none'
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
            border: '1px solid #ddd', borderRadius: '30px',
            fontSize: '16px', outline: 'none'
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', maxWidth: '380px',
            padding: '15px', marginTop: '20px',
            background: '#0096D6', color: 'white',
            border: 'none', borderRadius: '30px',
            fontSize: '18px', fontStyle: 'italic',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Conectando...' : 'acceder'}
        </button>
      </div>
    </div>
  );
}