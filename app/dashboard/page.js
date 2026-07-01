import TelemetryDashboard from "./TelemetryDashboard";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <header className="dash-header">
        <div className="header-left">
          <div className="live-indicator">
            <span className="live-dot" />
            <span className="live-label">LIVE</span>
          </div>
          <h1 className="dash-title">ISS Telemetry Log</h1>
        </div>
        <div className="header-right">
          <span className="header-sub">
            International Space Station · ZARYA / 25544
          </span>
        </div>
      </header>

      <TelemetryDashboard />

      <style>{`
        .dashboard-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 24px 28px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--space-border);
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 20px;
          padding: 4px 10px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 6px var(--success);
          animation: live-pulse 1.5s ease-in-out infinite;
        }

        @keyframes live-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .live-label {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--success);
        }

        .dash-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .header-right {
          font-size: 12px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        @media (max-width: 600px) {
          .dashboard-page { padding: 16px; }
          .dash-title { font-size: 18px; }
          .header-right { display: none; }
        }
      `}</style>
    </main>
  );
}
