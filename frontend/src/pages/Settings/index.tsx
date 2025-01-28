import { ThemeToggle } from './ThemeToggle';

export function Settings() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-6">
        <ThemeToggle />
      </div>
    </div>
  );
}