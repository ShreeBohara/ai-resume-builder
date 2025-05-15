import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '../api/axios';

// -------------------------- helpers --------------------------
const Input = ({ label, ...rest }) => (
  <label className="w-full">
    <span className="text-sm text-gray-600">{label}</span>
    <input {...rest} className="mt-1 w-full p-2 border rounded focus:ring focus:ring-blue-200" />
  </label>
);
const blank = {
  education: { school: '', degree: '', field: '', startDate: '', endDate: '', details: '' },
  experience: { company: '', position: '', startDate: '', endDate: '', responsibilities: '' },
  projects: { name: '', description: '', technologies: '', link: '' },
  certifications: { name: '', issuer: '', date: '' }
};

export default function ProfileForm({ onSave }) {
  const [prof, setProf] = useState({
    personal: { fullName: '', email: '', phone: '', location: '', summary: '' },
    education: [blank.education],
    experience: [blank.experience],
    projects: [blank.projects],
    skills: '',      // keep as CSV string in UI
    certifications: [blank.certifications]
  });

  // Fetch
  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      if (!data) return;
      // convert skills array → comma string for textarea
      const skillsStr = Array.isArray(data.skills) ? data.skills.join(', ') : data.skills || '';
      setProf(prev => ({ ...prev, ...data, skills: skillsStr }));
    });
  }, []);

  // Field handler
  const handle = (section, field, idx = null) => e => {
    setProf(prev => {
      const next = structuredClone(prev);
      if (idx !== null) next[section][idx][field] = e.target.value;
      else next[section][field] = e.target.value;
      return next;
    });
  };

  // list helpers
  const addRow = section => () =>
    setProf(prev => ({ ...prev, [section]: [...prev[section], structuredClone(blank[section])] }));
  const removeRow = (section, idx) => () =>
    setProf(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== idx) }));

  // Submit
  const submit = async e => {
    e.preventDefault();
    const payload = {
      ...prof,
      skills: Array.isArray(prof.skills)
        ? prof.skills // already array (rare)
        : (prof.skills || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
    };
    await api.post('/profile', payload);
    onSave && onSave();
  };

  return (
    <form onSubmit={submit} className="space-y-8 max-w-4xl mx-auto">
      {/* PERSONAL ------------------------------------------------------ */}
      <h2 className="text-xl font-semibold">Personal</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={prof.personal.fullName} onChange={handle('personal','fullName')} />
        <Input label="Email" value={prof.personal.email} onChange={handle('personal','email')} />
        <Input label="Phone" value={prof.personal.phone} onChange={handle('personal','phone')} />
        <Input label="Location" value={prof.personal.location} onChange={handle('personal','location')} />
      </div>
      <textarea
        value={prof.personal.summary}
        onChange={handle('personal','summary')}
        className="w-full p-3 border rounded focus:ring focus:ring-blue-200"
        rows="4"
        placeholder="Professional Summary"
      />

      {/* EDUCATION ----------------------------------------------------- */}
      <SectionList title="Education" items={prof.education} add={addRow('education')}>
        {(edu, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="School" value={edu.school} onChange={handle('education','school',i)} />
            <Input label="Degree" value={edu.degree} onChange={handle('education','degree',i)} />
            <Input label="Field" value={edu.field} onChange={handle('education','field',i)} />
            <Input type="date" label="Start" value={edu.startDate} onChange={handle('education','startDate',i)} />
            <Input type="date" label="End" value={edu.endDate} onChange={handle('education','endDate',i)} />
            <textarea value={edu.details} onChange={handle('education','details',i)} placeholder="Details / Achievements" className="md:col-span-2 p-2 border rounded" />
            <RemoveButton onClick={removeRow('education', i)} hidden={prof.education.length === 1} />
          </div>
        )}
      </SectionList>

      {/* EXPERIENCE ---------------------------------------------------- */}
      <SectionList title="Experience" items={prof.experience} add={addRow('experience')}>
        {(exp, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Company" value={exp.company} onChange={handle('experience','company',i)} />
            <Input label="Position" value={exp.position} onChange={handle('experience','position',i)} />
            <Input type="date" label="Start" value={exp.startDate} onChange={handle('experience','startDate',i)} />
            <Input type="date" label="End" value={exp.endDate} onChange={handle('experience','endDate',i)} />
            <textarea value={exp.responsibilities} onChange={handle('experience','responsibilities',i)} placeholder="Responsibilities" className="md:col-span-2 p-2 border rounded" />
            <RemoveButton onClick={removeRow('experience', i)} hidden={prof.experience.length === 1} />
          </div>
        )}
      </SectionList>

      {/* PROJECTS ------------------------------------------------------- */}
      <SectionList title="Projects" items={prof.projects} add={addRow('projects')}>
        {(pr, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={pr.name} onChange={handle('projects','name',i)} />
            <Input label="Technologies" value={pr.technologies} onChange={handle('projects','technologies',i)} />
            <Input label="Link" value={pr.link} onChange={handle('projects','link',i)} />
            <textarea value={pr.description} onChange={handle('projects','description',i)} placeholder="Description" className="md:col-span-2 p-2 border rounded" />
            <RemoveButton onClick={removeRow('projects', i)} hidden={prof.projects.length === 1} />
          </div>
        )}
      </SectionList>

      {/* SKILLS --------------------------------------------------------- */}
      <h2 className="text-xl font-semibold mt-8">Skills</h2>
      <textarea
        value={prof.skills}
        onChange={e => setProf(prev => ({ ...prev, skills: e.target.value }))}
        className="w-full p-3 border rounded focus:ring focus:ring-blue-200"
        rows="2"
        placeholder="Comma-separated list e.g. React, Node.js, MongoDB"
      />

      {/* CERTIFICATIONS ------------------------------------------------ */}
      <SectionList title="Certifications" items={prof.certifications} add={addRow('certifications')}>
        {(cert, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input label="Name" value={cert.name} onChange={handle('certifications','name',i)} />
            <Input label="Issuer" value={cert.issuer} onChange={handle('certifications','issuer',i)} />
            <Input type="date" label="Date" value={cert.date} onChange={handle('certifications','date',i)} />
            <RemoveButton onClick={removeRow('certifications', i)} hidden={prof.certifications.length === 1} />
          </div>
        )}
      </SectionList>

      {/* SUBMIT --------------------------------------------------------- */}
      <div className="text-center pt-4">
        <button className="py-3 px-8 bg-green-600 text-white rounded hover:bg-green-700 shadow">Save Profile</button>
      </div>
    </form>
  );
}

// reusable section wrapper
function SectionList({ title, items, add, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button type="button" onClick={add} className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
          <Plus size={18} /> Add
        </button>
      </div>
      {items.map(children)}
      <hr className="my-6" />
    </section>
  );
}

const RemoveButton = ({ hidden, ...rest }) =>
  !hidden && (
    <button type="button" {...rest} className="mt-2 flex items-center gap-1 text-red-600 hover:text-red-800">
      <Trash2 size={16} /> Remove
    </button>
  );
