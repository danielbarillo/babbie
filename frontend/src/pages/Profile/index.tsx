import { ProfileForm } from './ProfileForm';
import { useUser } from '../../store/useStore';

export function Profile() {
  const { user } = useUser();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
}