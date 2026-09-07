import { getConnectionStatus } from '../../config/db.js';
import serverInfo from '../../config/serverInfo.js';
import renderStatusPage from '../../templates/statusPage.template.js';

function formatUptime(seconds) {
    const totalSeconds = Math.floor(seconds);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
}

export const getStatus = (req, res) => {
    const dbStatus = getConnectionStatus();
    const uptimeSeconds = process.uptime();
    const startTime = new Date(Date.now() - uptimeSeconds * 1000);

    const dbStateLabels = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };

    const dbStateText = dbStateLabels[dbStatus.readyState] || 'Unknown';
    const isOperational = dbStatus.isConnected;

    const statusData = {
        isOperational,
        dbConnected: dbStatus.isConnected,
        dbStateText,
        uptimeSeconds: Math.floor(uptimeSeconds),
        uptimeFormatted: formatUptime(uptimeSeconds),
        startTimeIso: startTime.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        timestamp: new Date().toUTCString(),
    };

    // If API client explicitly requests JSON (e.g., automated health check ping)
    if (req.query.format === 'json' || req.headers.accept === 'application/json') {
        return res.status(200).json({
            status: isOperational ? 'ok' : 'degraded',
            server: serverInfo.name,
            version: serverInfo.version,
            operational: isOperational,
            database: {
                status: dbStateText,
                connected: dbStatus.isConnected,
            },
            uptime: statusData.uptimeFormatted,
            timestamp: statusData.timestamp,
            links: serverInfo.links,
        });
    }

    const html = renderStatusPage({ serverInfo, status: statusData });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
};

export default {
    getStatus,
};
