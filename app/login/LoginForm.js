"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const mockToken = btoa(
        JSON.stringify({ user: username, iat: Date.now() }),
      );
      document.cookie = `iss_auth_token=${mockToken}; path=/; max-age=86400; SameSite=Lax`;

      router.push("/dashboard");
    }, 600);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="field-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="e.g. astronaut42"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="field-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="anything works"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="login-btn" disabled={loading}>
        {loading ? (
          <span className="btn-loading">
            <span className="spinner" />
            Authenticating...
          </span>
        ) : (
          "Access Dashboard →"
        )}
      </button>

      <style>{`
        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .field-group label {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
          font-family: var(--font-display);
        }

        .field-group input {
          background: var(--space-surface);
          border: 1px solid var(--space-border);
          border-radius: var(--radius-sm);
          padding: 11px 14px;
          font-size: 14px;
          color: var(--text-primary);
          font-family: var(--font-body);
          outline: none;
          transition: border-color var(--transition), box-shadow var(--transition);
        }

        .field-group input::placeholder {
          color: var(--text-muted);
        }

        .field-group input:focus {
          border-color: var(--cyan-dim);
          box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
        }

        .form-error {
          font-size: 13px;
          color: var(--error);
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-sm);
          padding: 9px 12px;
        }

        .login-btn {
          margin-top: 6px;
          width: 100%;
          padding: 12px;
          background: var(--cyan);
          color: #0a0e1a;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          font-family: var(--font-display);
          letter-spacing: 0.02em;
          transition: opacity var(--transition), transform var(--transition);
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(10, 14, 26, 0.3);
          border-top-color: #0a0e1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
