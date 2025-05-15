import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [p, setP] = useState(null);
  useEffect(() => { api.get('/profile').then(({ data }) => setP(data)); }, []);
  if (!p) return <p className="p-8">Loading…</p>;
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">Welcome, {p.personal?.fullName || 'User'}</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-x-auto">{JSON.stringify(p, null, 2)}</pre>
      <Link to="/edit" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Edit Profile</Link>
    </div>
  );
}