export interface Attendee {
  email: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  category?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  description?: string;
  attendees?: Attendee[];
}

export type ViewMode = 'detailed' | 'compact';
export type AppMode = 'DEMO' | 'API';
