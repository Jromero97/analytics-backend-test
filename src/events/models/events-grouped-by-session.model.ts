export interface EventsGroupedBySession {
  sessionId: string;
  events: {
    event: string;
    timestamp: Date;
    metadata: any;
  };
}
