export function renderStatusPage({ serverInfo, status }) {
    const { isOperational, dbConnected, dbStateText, uptimeFormatted, startTimeIso, timestamp } = status;

    const overallStatusClass = isOperational ? 'status-ok' : 'status-warning';
    const overallStatusText = isOperational ? 'All Systems Operational' : 'Degraded System Performance';
    const overallStatusBadge = isOperational ? 'OPERATIONAL' : 'ACTION REQUIRED';

    const dbStatusClass = dbConnected ? 'badge-success' : 'badge-danger';
    const dbDotClass = dbConnected ? 'dot-success' : 'dot-danger';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${serverInfo.name} — Status</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #07090e;
            --bg-surface: #0e131f;
            --bg-card: #131b2e;
            --bg-card-hover: #18223a;
            --border-subtle: #1e293b;
            --border-highlight: #334155;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --crimson: #e63946;
            --crimson-glow: rgba(230, 57, 70, 0.25);
            --crimson-subtle: rgba(230, 57, 70, 0.12);
            --emerald: #10b981;
            --emerald-glow: rgba(16, 185, 129, 0.25);
            --emerald-subtle: rgba(16, 185, 129, 0.12);
            --amber: #f59e0b;
            --amber-subtle: rgba(245, 158, 11, 0.12);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            line-height: 1.5;
            background-image: 
                radial-gradient(circle at 50% 0%, rgba(230, 57, 70, 0.08) 0%, transparent 60%),
                radial-gradient(circle at 100% 100%, rgba(15, 23, 42, 0.6) 0%, transparent 50%);
        }

        .container {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
        }

        /* Header / Brand */
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .brand-group {
            display: flex;
            align-items: center;
            gap: 0.875rem;
        }

        .brand-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, #e63946 0%, #ba1a29 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px var(--crimson-glow);
            color: #ffffff;
            flex-shrink: 0;
        }

        .brand-title {
            font-size: 1.35rem;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .brand-version {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.75rem;
            font-weight: 700;
            padding: 0.15rem 0.5rem;
            border-radius: 9999px;
            background: var(--crimson-subtle);
            color: var(--crimson);
            border: 1px solid rgba(230, 57, 70, 0.25);
        }

        .brand-subtitle {
            font-size: 0.875rem;
            color: var(--text-secondary);
            font-weight: 500;
        }

        /* Banner Status */
        .status-banner {
            border-radius: 16px;
            padding: 1.15rem 1.5rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid transparent;
            backdrop-filter: blur(8px);
        }

        .status-banner.status-ok {
            background: linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(19, 27, 46, 0.8) 100%);
            border-color: rgba(16, 185, 129, 0.25);
        }

        .status-banner.status-warning {
            background: linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(19, 27, 46, 0.8) 100%);
            border-color: rgba(245, 158, 11, 0.25);
        }

        .status-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .pulse-indicator {
            position: relative;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--emerald);
        }

        .status-warning .pulse-indicator {
            background: var(--amber);
        }

        .pulse-indicator::after {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border-radius: 50%;
            background: var(--emerald);
            opacity: 0.4;
            animation: pulse 2s infinite ease-out;
        }

        .status-warning .pulse-indicator::after {
            background: var(--amber);
        }

        @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(2.2); opacity: 0; }
        }

        .status-headline {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-primary);
        }

        .status-badge-pill {
            font-size: 0.7rem;
            font-weight: 800;
            letter-spacing: 0.06em;
            padding: 0.35rem 0.75rem;
            border-radius: 9999px;
            text-transform: uppercase;
        }

        .status-ok .status-badge-pill {
            background: var(--emerald-subtle);
            color: var(--emerald);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .status-warning .status-badge-pill {
            background: var(--amber-subtle);
            color: var(--amber);
            border: 1px solid rgba(245, 158, 11, 0.3);
        }

        /* Metrics Grid */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 14px;
            padding: 1.25rem;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .card:hover {
            border-color: var(--border-highlight);
            transform: translateY(-2px);
        }

        .card-label {
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .card-value {
            font-size: 1.15rem;
            font-weight: 800;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            letter-spacing: -0.015em;
        }

        .card-meta {
            font-size: 0.75rem;
            color: var(--text-secondary);
            margin-top: 0.35rem;
            font-family: 'JetBrains Mono', monospace;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
        }

        .dot-success { background: var(--emerald); box-shadow: 0 0 8px var(--emerald-glow); }
        .dot-danger { background: var(--crimson); box-shadow: 0 0 8px var(--crimson-glow); }

        /* Project Info Section */
        .info-card {
            background: var(--bg-surface);
            border: 1px solid var(--border-subtle);
            border-radius: 14px;
            padding: 1.25rem 1.5rem;
            margin-bottom: 1.5rem;
        }

        .info-title {
            font-size: 0.85rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
        }

        .info-body {
            font-size: 0.9rem;
            color: var(--text-secondary);
            line-height: 1.6;
        }

        /* Public Links Section */
        .links-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 0.75rem;
            margin-bottom: 2rem;
        }

        .link-button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 0.875rem 1.15rem;
            color: var(--text-primary);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s ease;
        }

        .link-button:hover {
            background: var(--bg-card-hover);
            border-color: rgba(230, 57, 70, 0.4);
            transform: translateY(-2px);
            color: #ffffff;
        }

        .link-left {
            display: flex;
            align-items: center;
            gap: 0.6rem;
        }

        .link-icon {
            color: var(--crimson);
            width: 18px;
            height: 18px;
        }

        .link-arrow {
            color: var(--text-muted);
            transition: transform 0.2s ease, color 0.2s ease;
        }

        .link-button:hover .link-arrow {
            transform: translate(2px, -2px);
            color: var(--text-primary);
        }

        /* Footer */
        .footer {
            text-align: center;
            border-top: 1px solid var(--border-subtle);
            padding-top: 1.5rem;
            color: var(--text-muted);
            font-size: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }

        .footer-time {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: var(--text-secondary);
        }
    </style>
</head>
<body>
    <main class="container">
        <!-- Header -->
        <header class="header">
            <div class="brand-group">
                <div class="brand-icon" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                    </svg>
                </div>
                <div>
                    <h1 class="brand-title">
                        ${serverInfo.name}
                        <span class="brand-version">v${serverInfo.version}</span>
                    </h1>
                    <p class="brand-subtitle">${serverInfo.description}</p>
                </div>
            </div>
        </header>

        <!-- Overall Live Status Banner -->
        <section class="status-banner ${overallStatusClass}" aria-label="System Status">
            <div class="status-info">
                <div class="pulse-indicator" aria-hidden="true"></div>
                <span class="status-headline">${overallStatusText}</span>
            </div>
            <span class="status-badge-pill">${overallStatusBadge}</span>
        </section>

        <!-- Live Runtime Metrics Grid -->
        <section class="grid" aria-label="Live Metrics">
            <!-- Server Status Card -->
            <div class="card">
                <div class="card-label">
                    <span>Server State</span>
                    <span class="dot dot-success"></span>
                </div>
                <div class="card-value">Operational</div>
                <div class="card-meta">Uptime: ${uptimeFormatted}</div>
            </div>

            <!-- Database Status Card -->
            <div class="card">
                <div class="card-label">
                    <span>Database Engine</span>
                    <span class="dot ${dbDotClass}"></span>
                </div>
                <div class="card-value">${dbStateText}</div>
                <div class="card-meta">Cluster: ${dbConnected ? 'Active' : 'Offline'}</div>
            </div>

            <!-- Started At Card -->
            <div class="card">
                <div class="card-label">
                    <span>Process Session</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                </div>
                <div class="card-value" style="font-size: 0.95rem; font-family: 'JetBrains Mono', monospace;">
                    ${startTimeIso}
                </div>
                <div class="card-meta">UTC Initialization</div>
            </div>
        </section>

        <!-- About BloodWeb Platform -->
        <section class="info-card">
            <h2 class="info-title">About BloodWeb</h2>
            <p class="info-body">${serverInfo.about}</p>
        </section>

        <!-- Public Resources & Links -->
        <section aria-label="Public Resources">
            <h2 class="info-title" style="margin-bottom: 0.75rem;">Public Resources</h2>
            <div class="links-group">
                <a href="${serverInfo.links.website}" target="_blank" rel="noopener noreferrer" class="link-button">
                    <div class="link-left">
                        <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <span>BloodWeb App</span>
                    </div>
                    <svg class="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                </a>

                <a href="${serverInfo.links.github}" target="_blank" rel="noopener noreferrer" class="link-button">
                    <div class="link-left">
                        <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                        </svg>
                        <span>Source Code</span>
                    </div>
                    <svg class="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                </a>

                <a href="${serverInfo.links.documentation}" target="_blank" rel="noopener noreferrer" class="link-button">
                    <div class="link-left">
                        <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                        </svg>
                        <span>Documentation</span>
                    </div>
                    <svg class="link-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                </a>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div>BloodWeb Platform &bull; Dedicated to Real-Time Emergency Lifesaving</div>
            <div class="footer-time">Generated at: ${timestamp}</div>
        </footer>
    </main>
</body>
</html>`;
}

export default renderStatusPage;
