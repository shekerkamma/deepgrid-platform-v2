'use client';
import { useEffect } from 'react';
import { isView, to } from './routes';

// The original showcase addressed every view by hash (#portfolio?product=ad2). Forward those to the
// real pages so links already shared keep working.
export function LegacyHashRedirect() {
  useEffect(() => {
    const raw = location.hash.slice(1);
    const v = raw.split('?')[0];
    if (raw && isView(v) && v !== 'overview') location.replace(to(raw));
  }, []);
  return null;
}
