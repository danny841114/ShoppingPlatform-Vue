export function formatLocalDate(isoString, formatStyle = 'datetime') {
    if (!isoString) return '';
  
    const date = new Date(isoString);
  
    if (isNaN(date.getTime())) {
      return '無效時間';
    }
  
    const pad = (num) => String(num).padStart(2, '0');
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    switch (formatStyle) {
      case 'date':
        return `${year}/${month}/${day}`;
      case 'time':
        return `${hours}:${minutes}:${seconds}`;
      case 'datetime':
      default:
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
  }