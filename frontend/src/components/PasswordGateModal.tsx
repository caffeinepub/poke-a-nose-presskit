import React, { useState } from 'react';
import { useActor } from '../hooks/useActor';

interface PasswordGateModalProps {
  onVerified: () => void;
}

export default function PasswordGateModal({ onVerified }: PasswordGateModalProps) {
  const { actor, isFetching: actorFetching } = useActor();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!actor) {
      setError('Service not available yet. Please try again in a moment.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await actor.verifyPassword(password);
      if (isValid) {
        sessionStorage.setItem('presskit_verified', 'true');
        onVerified();
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      console.error('Password verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#111',
            textAlign: 'center',
          }}
        >
          Press Kit Access
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: '#666',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          This press kit is password protected. Please enter the password to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isSubmitting || actorFetching}
            autoFocus
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginBottom: '0.75rem',
              outline: 'none',
              color: '#111',
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
          />

          {error && (
            <p
              style={{
                color: '#dc2626',
                fontSize: '0.8rem',
                marginBottom: '0.75rem',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || actorFetching || !password.trim()}
            style={{
              width: '100%',
              padding: '0.625rem',
              backgroundColor: isSubmitting || actorFetching ? '#9ca3af' : '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: isSubmitting || actorFetching ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            {(isSubmitting || actorFetching) && (
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(255,255,255,0.4)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }}
              />
            )}
            {actorFetching ? 'Loading...' : isSubmitting ? 'Verifying...' : 'Enter'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
