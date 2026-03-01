import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { Loader2, Lock } from 'lucide-react';

interface PasswordGateModalProps {
  onVerified: () => void;
}

export default function PasswordGateModal({ onVerified }: PasswordGateModalProps) {
  const { actor } = useActor();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setError('Connection not ready. Please wait a moment and try again.');
      return;
    }
    setIsVerifying(true);
    setError('');
    try {
      const isValid = await actor.verifyPassword(password);
      if (isValid) {
        sessionStorage.setItem('presskit_verified', 'true');
        onVerified();
      } else {
        setError('Incorrect password. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    // Full-screen fixed overlay — rendered at the top of the DOM via the page component
    <div
      style={{ zIndex: 9999 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
    >
      <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 mb-2">
            <Lock className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">Press Kit Access</h2>
          <p className="text-sm text-muted-foreground">
            This press kit is password protected. Enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            className="w-full border border-border rounded p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={isVerifying || !password.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-foreground text-background rounded font-medium hover:opacity-80 disabled:opacity-50 transition-opacity"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying…
              </>
            ) : (
              'Enter Press Kit'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
