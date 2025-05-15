import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const nav = useNavigate();
  const [f, set] = useState({ username: '', password: '' });
  const onChange = e => set({ ...f, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', f);
      localStorage.setItem('token', data.token);
      nav('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <input name="username" value={f.username} onChange={onChange} placeholder="Username" className="w-full p-3 border rounded" required />
        <input type="password" name="password" value={f.password} onChange={onChange} placeholder="Password" className="w-full p-3 border rounded" required />
        <button className="w-full py-3 rounded bg-blue-600 text-white hover:bg-blue-700">Sign In</button>
        <p className="text-center text-sm">No account? <Link to="/signup" className="text-blue-600">Sign up</Link></p>
      </form>
    </div>
  );
}