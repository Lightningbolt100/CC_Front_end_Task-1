import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-center">
        <div className="login-card">
          <div className="login-card-header">
            <span className="logo-icon">🛸</span>
            <h1>ISS Telemetry</h1>
            <p>Sign in to view the live tracking dashboard</p>
          </div>

          <LoginForm />
        </div>

        <p className="login-note">Any username and password will work</p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          width: 100%;
        }

        .login-card {
          width: 100%;
          max-width: 380px;
          background: var(--space-card);
          border: 1px solid var(--space-border);
          border-radius: var(--radius-lg);
          padding: 36px 32px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .login-card-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .logo-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 12px;
        }

        .login-card-header h1 {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .login-card-header p {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .login-note {
          font-size: 12px;
          color: var(--text-muted);
        }
      `}</style>
    </main>
  )
}
