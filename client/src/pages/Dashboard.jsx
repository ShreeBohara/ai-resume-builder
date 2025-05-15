import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Section = ({ title, children }) => (
  <section className="bg-white shadow rounded p-6 space-y-2">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    {children}
  </section>
);

const Badge = ({ text }) => (
  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
    {text}
  </span>
);

export default function Dashboard() {
  const [p, setP] = useState(null);

  useEffect(() => {
    api.get('/profile').then(({ data }) => setP(data));
  }, []);

  if (!p) return <p className="p-8">Loading…</p>;

  const {
    personal = {},
    education = [],
    experience = [],
    projects = [],
    skills = [],
    certifications = []
  } = p;

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8">
      {/* Top bar ---------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Welcome, {personal.fullName || 'User'}</h1>
        <Link
          to="/edit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow self-start sm:self-auto"
        >
          Edit Profile
        </Link>
      </div>

      {/* Personal --------------------------------------------------------- */}
      <Section title="Personal">
        <p><strong>Email:</strong> {personal.email}</p>
        <p><strong>Phone:</strong> {personal.phone}</p>
        {personal.location && <p><strong>Location:</strong> {personal.location}</p>}
        {personal.summary && <p className="mt-2 text-gray-700 whitespace-pre-line">{personal.summary}</p>}
      </Section>

      {/* Skills ----------------------------------------------------------- */}
      {!!skills.length && (
        <Section title="Skills">
          <div>{skills.map((s, i) => <Badge key={i} text={s} />)}</div>
        </Section>
      )}

      {/* Education -------------------------------------------------------- */}
      {!!education.length && (
        <Section title="Education">
          {education.map((e, i) => (
            <div key={i} className="border-l-4 border-blue-600 pl-4 mb-4">
              <p className="font-semibold">{e.degree} in {e.field}</p>
              <p>{e.school}</p>
              {(e.startDate || e.endDate) && (
                <p className="text-sm text-gray-500">{e.startDate?.slice(0, 10)} – {e.endDate?.slice(0, 10) || 'Present'}</p>
              )}
              {e.details && <p className="text-gray-700 mt-1 whitespace-pre-line">{e.details}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Experience ------------------------------------------------------- */}
      {!!experience.length && (
        <Section title="Experience">
          {experience.map((ex, i) => (
            <div key={i} className="border-l-4 border-green-600 pl-4 mb-4">
              <p className="font-semibold">{ex.position} @ {ex.company}</p>
              {(ex.startDate || ex.endDate) && (
                <p className="text-sm text-gray-500">{ex.startDate?.slice(0, 10)} – {ex.endDate?.slice(0, 10) || 'Present'}</p>
              )}
              {ex.responsibilities && <p className="text-gray-700 mt-1 whitespace-pre-line">{ex.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Projects --------------------------------------------------------- */}
      {!!projects.length && (
        <Section title="Projects">
          {projects.map((pr, i) => (
            <div key={i} className="mb-4">
              <p className="font-semibold flex items-center gap-2">
                {pr.link ? (
                  <a href={pr.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {pr.name}
                  </a>
                ) : (
                  pr.name
                )}
              </p>
              {pr.description && <p className="text-gray-700 whitespace-pre-line">{pr.description}</p>}
              {pr.technologies && <p className="text-sm text-gray-500">Tech: {pr.technologies}</p>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications --------------------------------------------------- */}
      {!!certifications.length && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <p key={i}>• {c.name} – {c.issuer} {c.date && `(${c.date.slice(0, 10)})`}</p>
          ))}
        </Section>
      )}
    </div>
  );
}
