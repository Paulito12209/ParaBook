import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { 
  TaskEntity, 
  ProjectEntity, 
  AreaEntity, 
  ResourceEntity, 
  MeetingEntity, 
  BookmarkEntity 
} from '../models/entities';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  tasks!: Table<TaskEntity, string>;
  projects!: Table<ProjectEntity, string>;
  areas!: Table<AreaEntity, string>;
  resources!: Table<ResourceEntity, string>;
  meetings!: Table<MeetingEntity, string>;
  bookmarks!: Table<BookmarkEntity, string>;

  constructor() {
    // Name der lokalen IndexedDB-Datenbank
    super('ParaBookDB');

    // Definition der Stores/Tabellen und deren auslesbare Indizes.
    // Nur Felder, nach denen gefiltert oder sortiert wird, müssen hier als Indizes deklariert werden.
    // Das Sternchen (*) indiziert jedes Element im Array als Suchtreffer (MultiEntry).
    this.version(1).stores({
      tasks: 'id, title, status, priority, type, projectId, areaId, *resourceIds, *meetingIds, createdAt',
      projects: 'id, title, status, priority, isArchived, *areaIds, createdAt',
      areas: 'id, title, isArchived, createdAt',
      resources: 'id, title, type, status, isFavorite, isArchived, isHidden, *areaIds, *projectIds, *taskIds, createdAt',
      meetings: 'id, title, scheduledFor, status, isArchived, *projectIds, *areaIds, createdAt',
      bookmarks: 'id, title, url, createdAt'
    });
  }
}
