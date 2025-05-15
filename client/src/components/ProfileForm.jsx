import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ProfileForm({ onSave }) {
  const [prof, setProf] = useState({
    personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
    education: [{ school: '', degree: '', field: '', startDate: '', endDate: '', details: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', responsibilities: '' }],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    skills: '',
    certifications: [{ name: '', issuer: '', date: '' }]
  });

  useEffect(() => { api.get('/profile').then(({ data }) => setProf(prev => ({ ...prev, ...data }))); }, []);

  const handle = (section, field, idx = null) => e => {
    setProf(prev => {
      const next = structuredClone(prev);
      if (idx !== null) next[section][idx][field] = e.target.value; else next[section][field] = e.target.value;
      return next;
    });
  };

  const submit = async e => {
    e.preventDefault();
    await api.post('/profile', prof);
    onSave && onSave();
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Personal section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={prof.personal.fullName} onChange={handle('personal', 'fullName')} placeholder="Full Name" className="p-3 border rounded" />
        <input value={prof.personal.email} onChange={handle('personal', 'email')} placeholder="Email" className="p-3 border rounded" />
        <input value={prof.personal.phone} onChange={handle('personal', 'phone')} placeholder="Phone" className="p-3 border rounded" />
        <input value={prof.personal.location} onChange={handle('personal', 'location')} placeholder="Location" className="p-3 border rounded" />
      </section>
      <textarea value={prof.personal.summary} onChange={handle('personal', 'summary')} className="w-full p-3 border rounded" rows="4" placeholder="Professional Summary" />

      {/* Add similar inputs or mapped UI for education, experience, projects, skills, certifications */}

      <button className="py-3 px-6 bg-green-600 text-white rounded">Save Profile</button>
    </form>
  );
}