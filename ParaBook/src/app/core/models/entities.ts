/**
 * Kernstruktur für das ParaBook-Datenmodell (PARA-Prinzip + Aufgaben & Termine).
 * Hierbei handelt es sich um flache Strukturen, ideal für IndexedDB / NoSQL.
 * Verknüpfungen (Relationen) zwischen den Dokumenten werden durch Arrays von IDs (`string[]`) abgebildet.
 */

export type StatusTask = 'offen' | 'in Arbeit' | 'erledigt' | 'geblockt';
export type StatusProject = 'geplant' | 'aktiv' | 'pausiert' | 'abgeschlossen';
export type StatusResource = 'zu prüfen' | 'in Prüfung' | 'überprüft';
export type StatusMeeting = 'geplant' | 'abgehalten' | 'abgesagt';

export type Priority = 'niedrig' | 'mittel' | 'hoch';
export type TaskType = 'Idee' | 'aktiv' | 'archiviert';
export type ResourceType = 'SOP' | 'Notiz' | 'Ressource' | 'Dokumentation';

export interface BaseEntity {
  id: string; // UUIDv4
  createdAt: number; // Unix Timestamp für effiziente Sortierbarkeit
  updatedAt: number; 
}

export interface TaskEntity extends BaseEntity {
  title: string;
  details?: string;
  status: StatusTask;
  priority: Priority;
  assignee?: string;
  dueDate?: number;
  type: TaskType;

  // Relationen (IDs)
  projectId?: string; 
  areaId?: string;
  resourceIds: string[];
  meetingIds: string[];
  sopIds: string[];
  noteIds: string[];
}

export interface ProjectEntity extends BaseEntity {
  title: string;
  status: StatusProject;
  priority: Priority;
  startDate?: number;
  dueDate?: number;
  timeline?: { start: number; end: number };
  assignee?: string;
  participants: string[];
  isArchived: boolean;
  isFavorite: boolean;

  // Relationen (IDs)
  taskIds: string[];
  resourceIds: string[];
  areaIds: string[];
  meetingIds: string[];
  bookmarkIds: string[];
}

export interface AreaEntity extends BaseEntity {
  title: string;
  description?: string;
  isArchived: boolean;

  // Relationen (IDs)
  projectIds: string[];
  taskIds: string[];
  resourceIds: string[];
  meetingIds: string[];
  bookmarkIds: string[];
}

export interface ResourceEntity extends BaseEntity {
  title: string;
  type: ResourceType;
  status: StatusResource;
  isFavorite: boolean;
  categories: string[];
  targetGroups: string[];
  description?: string;
  url?: string;
  files?: string[];
  isArchived: boolean;
  isHidden: boolean;

  // Relationen (IDs)
  areaIds: string[];
  projectIds: string[];
  taskIds: string[];
  meetingIds: string[];
}

export interface MeetingEntity extends BaseEntity {
  title: string;
  scheduledFor?: number; // falls null -> "Unterminiert"
  status: StatusMeeting;
  topics: string[];
  assignee?: string;
  participants: string[];
  location?: string;
  videoLink?: string;
  isArchived: boolean;

  // Relationen (IDs)
  projectIds: string[];
  areaIds: string[];
  resourceIds: string[];
  taskIds: string[];
}

export interface BookmarkEntity extends BaseEntity {
  title: string;
  url: string;
  description?: string;

  // Relationen (IDs)
  projectIds: string[];
  areaIds: string[];
  resourceIds: string[];
}
