import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent, AppMode } from '../types';
import { getStoredDemoEvents, saveDemoEventsToStorage } from '../services/mockData';

interface UseCalendarEventsOptions {
  mode: AppMode;
  startDate: Date;
  endDate: Date;
  accessToken?: string;
  isPublicView?: boolean;
  publicCalId?: string;
  publicApiKey?: string;
}

export const useCalendarEvents = ({
  mode,
  startDate,
  endDate,
  accessToken,
  isPublicView = false,
  publicCalId = '',
  publicApiKey = ''
}: UseCalendarEventsOptions) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMs = startDate.getTime();
  const endMs = endDate.getTime();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (mode === 'DEMO') {
      setTimeout(() => {
        const rawDemoEvents = getStoredDemoEvents();
        const filtered = rawDemoEvents.filter(evt => {
          const evtStart = new Date(evt.start.dateTime || evt.start.date || new Date());
          return evtStart >= startDate && evtStart <= endDate;
        });
        setEvents(filtered);
        setIsLoading(false);
      }, 300);
    } else if (isPublicView) {
      if (!publicCalId || !publicApiKey) {
        setEvents([]);
        setIsLoading(false);
        return;
      }
      try {
        const timeMin = startDate.toISOString();
        const timeMax = endDate.toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(publicCalId)}/events?key=${publicApiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Public API Error: ${response.statusText}`);
        }
        
        const data = await response.json();
        setEvents(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!accessToken) {
        setEvents([]);
        setIsLoading(false);
        return;
      }
      try {
        const timeMin = startDate.toISOString();
        const timeMax = endDate.toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }
        
        const data = await response.json();
        setEvents(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }, [mode, startMs, endMs, accessToken, isPublicView, publicCalId, publicApiKey]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const saveEvent = async (eventData: Partial<CalendarEvent>) => {
    if (isPublicView) throw new Error("Cannot save events in public view.");
    
    if (mode === 'DEMO') {
      let storedEvents = getStoredDemoEvents();
      if (eventData.id) {
        storedEvents = storedEvents.map(item => item.id === eventData.id ? { ...item, ...eventData } as CalendarEvent : item);
      } else {
        const newId = `demo-evt-${Date.now()}`;
        storedEvents.unshift({ ...eventData, id: newId } as CalendarEvent);
      }
      saveDemoEventsToStorage(storedEvents);
      await fetchEvents();
    } else {
      if (!accessToken) throw new Error("No access token available.");
      let url = `https://www.googleapis.com/calendar/v3/calendars/primary/events`;
      let method = 'POST';

      if (eventData.id) {
        url += `/${encodeURIComponent(eventData.id)}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || res.statusText);
      }
      await fetchEvents();
    }
  };

  const deleteEvent = async (id: string) => {
    if (isPublicView) throw new Error("Cannot delete events in public view.");

    if (mode === 'DEMO') {
      let storedEvents = getStoredDemoEvents();
      storedEvents = storedEvents.filter(e => e.id !== id);
      saveDemoEventsToStorage(storedEvents);
      await fetchEvents();
    } else {
      if (!accessToken) throw new Error("No access token available.");
      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!res.ok) {
        throw new Error(`Delete failed: ${res.status}`);
      }
      await fetchEvents();
    }
  };

  return {
    events,
    isLoading,
    error,
    saveEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
