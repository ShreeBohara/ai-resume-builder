import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm';

export default function EditProfile() {
  const nav = useNavigate();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Your Profile</h1>
      <ProfileForm onSave={() => nav('/dashboard')} />
    </div>
  );
}