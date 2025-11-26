import { useState } from 'react';

interface Props {
  onSubmit: (username: string, password: string) => Promise<void>;
}

function LoginForm({ onSubmit }: Props) {
  const [username, setUsername] = useState('bluek9');
  const [password, setPassword] = useState('warhammer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await onSubmit(username, password);
    } catch (err) {
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-950 border border-slate-800 rounded-xl p-8 w-96 shadow-2xl">
      <div className="text-2xl font-bold text-center text-slate-50 mb-4">BlueK9 Login</div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Username</label>
          <input
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-300 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2 rounded font-semibold transition"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
