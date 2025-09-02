'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header() {
  const { user, profile, loading, signInWithGitHub, signInWithEmail, signOut } =
    useAuth();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  if (loading) return null;

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#6B46C1' }}>
        🐱 Cat App
      </div>

      {user ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            position: 'relative',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#E9D8FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B46C1',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              transform: isHovering ? 'scale(1.1)' : 'scale(1)',
            }}
            onClick={() => signOut()}
            title="Sign out"
          >
            {profile?.display_name?.[0]?.toUpperCase() ||
              user.email?.[0]?.toUpperCase() ||
              '👤'}
          </div>
          {isHovering && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                whiteSpace: 'nowrap',
                fontSize: '0.875rem',
              }}
            >
              <div style={{ fontWeight: 500, color: '#4A5568' }}>
                {profile?.display_name || user.email}
              </div>
              <button
                onClick={signOut}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: '0.25rem 0',
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: '0.25rem',
                  ':hover': {
                    color: '#4A5568',
                    background: '#F7FAFC',
                  },
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {showEmailInput ? (
            <div
              style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.875rem',
                  width: '180px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  ':focus': {
                    borderColor: '#B794F4',
                    boxShadow: '0 0 0 2px rgba(167, 139, 250, 0.3)',
                  },
                }}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && email) {
                    try {
                      await signInWithEmail(email);
                      setEmail('');
                      setShowEmailInput(false);
                      alert('Check your email for the magic link!');
                    } catch (err) {
                      console.error(err);
                    }
                  }
                }}
              />
              <button
                onClick={() => setShowEmailInput(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  ':hover': {
                    background: '#F7FAFC',
                  },
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowEmailInput(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  ':hover': {
                    color: '#4A5568',
                    background: '#F7FAFC',
                  },
                }}
                title="Sign in with email"
              >
                ✉️
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
