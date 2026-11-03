export const formatHumanDateTime = (dateVal) => {
  if (!dateVal) return 'Immediate / ASAP';
  if (
    typeof dateVal === 'string' &&
    (dateVal.includes('Immediate') ||
      dateVal.includes('mins') ||
      dateVal.includes('hours') ||
      dateVal.includes('Today') ||
      dateVal.includes('Tomorrow'))
  ) {
    return dateVal;
  }
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal);

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) return `Today at ${timeStr}`;
  if (isTomorrow) return `Tomorrow at ${timeStr}`;

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  });

  return `${dateStr} at ${timeStr}`;
};

export const formatDistanceKm = (dist) => {
  if (dist == null || isNaN(dist)) return 'Nearby';
  const num = typeof dist === 'number' ? dist : parseFloat(dist);
  if (isNaN(num)) return 'Nearby';
  return `${(Math.round(num * 10) / 10).toFixed(1)} km away`;
};
