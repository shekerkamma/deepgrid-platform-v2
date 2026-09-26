'use client';
import { useEffect } from 'react';
import { to } from '../routes';

// Links shared before the split (/silicon?chapter=cube&domain=R100) go to the chapter's own page.
export function ChapterRedirect() {
  useEffect(() => {
    if (new URLSearchParams(location.search).get('chapter')) location.replace(to('silicon' + location.search));
  }, []);
  return null;
}
