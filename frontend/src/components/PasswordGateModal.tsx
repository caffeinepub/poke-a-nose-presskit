import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useVerifyPassword } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PasswordGateModalProps {
  onVerified: () => void;
}

export default function PasswordGateModal({ onVerified }: PasswordGateModalProps) {
  const { isDark } = useTheme();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const verifyMutation = useVerifyPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const ok = await verifyMutation.mutateAsync(password);
      if (ok) {
        try { sessionStorage.setItem('presskit-verified', '1'); } catch {}
        onVerified();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="password-modal relative z-10 w-full max-w-sm p-8 shadow-2xl"
        style={{
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          color: isDark ? '#ffffff' : '#111111',
          transition: 'background-color 0.3s ease, color 0.3s ease',
        }}
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <Lock size={28} />
          <h2 className="font-heading text-2xl text-center">Press Kit Access</h2>
          <p className="text-sm text-center opacity-60 font-body">
            This press kit is password protected. Enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            className="rounded-none text-sm"
            style={{
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
              color: isDark ? '#ffffff' : '#111111',
              borderColor: isDark ? '#444' : '#ccc',
            }}
          />
          {error && (
            <p className="text-xs text-red-500 font-body">{error}</p>
          )}
          <Button
            type="submit"
            disabled={verifyMutation.isPending || !password}
            className="rounded-none uppercase tracking-widest text-xs mt-1"
            style={{
              backgroundColor: isDark ? '#ffffff' : '#111111',
              color: isDark ? '#111111' : '#ffffff',
            }}
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Access Presskit'}
          </Button>
        </form>
      </div>
    </div>
  );
}
