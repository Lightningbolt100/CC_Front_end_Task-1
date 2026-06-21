'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface TelemetryEntry {
  id: number
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
  visibility: string
}

function formatCoord(val: number, isLat: boolean): string {
  const abs = Math.abs(val)
  const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W')
  return `${abs.toFixed(4)}° ${dir}`
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const RECORDS_PER_PAGE = 10
const ISS_API = 'https://api.wheretheiss.at/v1/satellites/25544'

export default function TelemetryDashboard() {
  const router = useRouter()
  const [log, setLog] = useState<TelemetryEntry[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [countdown, setCountdown] = useState(10)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const idRef = useRef(0)

  useEffect(() => {
    async function fetchISS() {
      try {
        const res = await axios.get(ISS_API)
        const data = res.data
        const entry: TelemetryEntry = {
          id: ++idRef.current,
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude,
          velocity: data.velocity,
          timestamp: data.timestamp,
          visibility: data.visibility,
        }
        setLog((prev) => [entry, ...prev])
        setFetchError('')
      } catch {
        setFetchError('Could not fetch ISS data. Will retry in 10 seconds.')
      } finally {
        setLoading(false)
      }
    }

    fetchISS()
    intervalRef.current = setInterval(fetchISS, 10000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (loading) return
    setCountdown(10)
    const tick = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 10 : c - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [log.length, loading])

  function handleLogout() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    document.cookie = 'iss_auth_token=; path=/; max-age=0'
    router.push('/login')
  }

  const totalPages = Math.max(1, Math.ceil(log.length / RECORDS_PER_PAGE))
  const pageStart = (page - 1) * RECORDS_PER_PAGE
  const pageData = log.slice(pageStart, pageStart + RECORDS_PER_PAGE)
  const latest = log[0] ?? null

  return (
    <div className="tdb-root">

      {/* latest values strip */}
      <div className="status-strip">
        {loading ? (
          <span className="loading-text">Fetching ISS position...</span>
        ) : latest ? (
          <>
            <div className="status-stat">
              <span className="stat-label">Latitude</span>
              <span className="stat-value">{formatCoord(latest.latitude, true)}</span>
            </div>
            <div className="status-divider" />
            <div className="status-stat">
              <span className="stat-label">Longitude</span>
              <span className="stat-value">{formatCoord(latest.longitude, false)}</span>
            </div>
            <div className="status-divider" />
            <div className="status-stat">
              <span className="stat-label">Altitude</span>
              <span className="stat-value">{latest.altitude.toFixed(1)} km</span>
            </div>
            <div className="status-divider" />
            <div className="status-stat">
              <span className="stat-label">Velocity</span>
              <span className="stat-value">{latest.velocity.toFixed(1)} km/h</span>
            </div>
            <div className="status-divider" />
            <div className="status-stat">
              <span className="stat-label">Next update</span>
              <span className="stat-value" style={{ color: 'var(--cyan)' }}>{countdown}s</span>
            </div>
          </>
        ) : null}

        <button className="logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>

      {fetchError && <div className="error-banner">{fetchError}</div>}

      {/* history table */}
      <div className="table-card">
        <div className="table-card-header">
          <h2 className="table-title">Flight History Log</h2>
          <p className="table-sub">
            {log.length === 0
              ? 'Waiting for first reading...'
              : `${log.length} reading${log.length === 1 ? '' : 's'} collected`}
          </p>
        </div>

        <div className="table-wrapper">
          <table className="tele-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Altitude (km)</th>
                <th>Velocity (km/h)</th>
                <th>Visibility</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="td-empty">Loading...</td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="td-empty">No data yet</td>
                </tr>
              ) : (
                pageData.map((entry) => (
                  <tr key={entry.id}>
                    <td className="mono muted">{entry.id}</td>
                    <td className="mono">{formatTime(entry.timestamp)}</td>
                    <td className="mono">{formatCoord(entry.latitude, true)}</td>
                    <td className="mono">{formatCoord(entry.longitude, false)}</td>
                    <td className="mono">{entry.altitude.toFixed(2)}</td>
                    <td className="mono">{entry.velocity.toFixed(2)}</td>
                    <td className="vis">{entry.visibility}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        <div className="pagination">
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <div className="page-btns">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .tdb-root {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .status-strip {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          background: var(--space-card);
          border: 1px solid var(--space-border);
          border-radius: var(--radius-md);
          padding: 14px 20px;
        }

        .loading-text {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .status-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 16px;
        }

        .status-stat:first-of-type { padding-left: 0; }

        .stat-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          font-family: var(--font-display);
        }

        .stat-value {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }

        .status-divider {
          width: 1px;
          height: 30px;
          background: var(--space-border);
          flex-shrink: 0;
        }

        .logout-btn {
          margin-left: auto;
          background: transparent;
          border: 1px solid var(--space-border-hi);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 12px;
          padding: 6px 14px;
          transition: all var(--transition);
        }

        .logout-btn:hover {
          border-color: var(--error);
          color: var(--error);
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-sm);
          padding: 10px 16px;
          font-size: 13px;
          color: #fca5a5;
        }

        .table-card {
          background: var(--space-card);
          border: 1px solid var(--space-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .table-card-header {
          padding: 18px 22px 14px;
          border-bottom: 1px solid var(--space-border);
        }

        .table-title {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .table-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 3px;
        }

        .table-wrapper { overflow-x: auto; }

        .tele-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .tele-table th {
          text-align: left;
          padding: 10px 16px;
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          border-bottom: 1px solid var(--space-border);
          white-space: nowrap;
        }

        .tele-table td {
          padding: 11px 16px;
          border-bottom: 1px solid rgba(30, 45, 69, 0.5);
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .tele-table tr:last-child td { border-bottom: none; }

        .tele-table tbody tr:hover td {
          background: rgba(255,255,255,0.02);
          color: var(--text-primary);
        }

        .mono { font-family: var(--font-mono); }
        .muted { color: var(--text-muted) !important; font-size: 12px; }
        .vis { color: var(--text-secondary); font-size: 13px; }

        .td-empty {
          text-align: center;
          padding: 40px 16px !important;
          color: var(--text-muted);
          font-size: 13px;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          border-top: 1px solid var(--space-border);
          flex-wrap: wrap;
          gap: 8px;
        }

        .page-info {
          font-size: 13px;
          color: var(--text-muted);
        }

        .page-btns { display: flex; gap: 8px; }

        .page-btn {
          background: var(--space-surface);
          border: 1px solid var(--space-border);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 13px;
          padding: 6px 14px;
          transition: all var(--transition);
        }

        .page-btn:hover:not(:disabled) {
          border-color: var(--cyan-dim);
          color: var(--cyan);
        }

        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        @media (max-width: 700px) {
          .status-divider { display: none; }
          .status-stat { padding: 0 10px 0 0; }
          .tele-table th, .tele-table td { padding: 9px 12px; }
        }
      `}</style>
    </div>
  )
}
