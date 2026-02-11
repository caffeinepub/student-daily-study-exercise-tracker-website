export function getDayKey(timestamp: bigint | Date): string {
  const date = typeof timestamp === 'bigint' 
    ? new Date(Number(timestamp / 1_000_000n)) // Convert nanoseconds to milliseconds
    : timestamp;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function getTodayKey(): string {
  return getDayKey(new Date());
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatDateShort(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

export function isToday(timestamp: bigint): boolean {
  return getDayKey(timestamp) === getTodayKey();
}

