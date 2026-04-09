export enum Screen {
  HOME = 'HOME',
  MAP = 'MAP',
  CONTROL = 'CONTROL',
  VOTING = 'VOTING',
  ARCHIVE = 'ARCHIVE',
}

export interface LogEntry {
  timestamp: string;
  type: 'INFO' | 'API' | 'THOUGHT' | 'WARN' | 'DEBUG';
  content: string;
  details?: string;
}

export interface Task {
  id: string;
  description: string;
  status: 'SUCCESS' | 'ABORTED' | 'PENDING';
  consensus: number;
  time: string;
}
