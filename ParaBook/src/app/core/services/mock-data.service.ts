import { Injectable } from '@angular/core';
import { 
  ProjectEntity, TaskEntity, ResourceEntity, 
  AreaEntity, MeetingEntity, StatusProject, 
  StatusTask, StatusResource, StatusMeeting, Priority, TaskType 
} from '../models/entities';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  getAreas(): AreaEntity[] {
    return [
      { 
        id: 'area-1', title: 'Privat', isArchived: false, createdAt: Date.now(), updatedAt: Date.now(),
        projectIds: ['proj-1'], taskIds: ['task-1'], resourceIds: [], meetingIds: [], bookmarkIds: [] 
      },
      { 
        id: 'area-2', title: 'Arbeit', isArchived: false, createdAt: Date.now(), updatedAt: Date.now(),
        projectIds: ['proj-2'], taskIds: ['task-2'], resourceIds: ['res-1'], meetingIds: ['meet-1'], bookmarkIds: [] 
      }
    ];
  }

  getProjects(): ProjectEntity[] {
    return [
      {
        id: 'proj-1', title: 'Urlaubsplanung', status: 'aktiv', priority: 'mittel', 
        isArchived: false, isFavorite: true, createdAt: Date.now(), updatedAt: Date.now(),
        participants: [], taskIds: [], resourceIds: [], areaIds: ['area-1'], meetingIds: [], bookmarkIds: []
      },
      {
        id: 'proj-2', title: 'ParaBook Redesign', status: 'aktiv', priority: 'hoch', 
        isArchived: false, isFavorite: false, createdAt: Date.now(), updatedAt: Date.now(),
        participants: [], taskIds: [], resourceIds: ['res-1'], areaIds: ['area-2'], meetingIds: [], bookmarkIds: []
      }
    ];
  }

  getTasks(): TaskEntity[] {
    return [
      {
        id: 'task-1', title: 'Flüge buchen', details: 'Günstige Flüge nach Japan suchen.',
        status: 'offen', priority: 'hoch', type: 'aktiv', createdAt: Date.now(), updatedAt: Date.now(),
        resourceIds: [], meetingIds: [], sopIds: [], noteIds: [], areaId: 'area-1', projectId: 'proj-1'
      },
      {
        id: 'task-2', title: 'Mockup erstellen', details: 'Dashboard Mockup in Figma finalisieren.',
        status: 'in Arbeit', priority: 'mittel', type: 'aktiv', createdAt: Date.now(), updatedAt: Date.now(),
        resourceIds: [], meetingIds: [], sopIds: [], noteIds: [], areaId: 'area-2', projectId: 'proj-2'
      }
    ];
  }

  getMeetings(): MeetingEntity[] {
    const today = new Date();
    today.setHours(14, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 30, 0, 0);

    return [
      {
        id: 'meet-1', title: 'Sync mit Lisa', scheduledFor: today.getTime(), 
        status: 'geplant', topics: ['Fortschritt ParaBook'], participants: ['Lisa', 'Ich'],
        isArchived: false, createdAt: Date.now(), updatedAt: Date.now(),
        projectIds: ['proj-2'], areaIds: ['area-2'], resourceIds: [], taskIds: []
      },
      {
        id: 'meet-2', title: 'Review Design-Konzept', scheduledFor: tomorrow.getTime(), 
        status: 'geplant', topics: ['Farben', 'Kacheln'], participants: ['Team'],
        isArchived: false, createdAt: Date.now(), updatedAt: Date.now(),
        projectIds: [], areaIds: ['area-2'], resourceIds: [], taskIds: []
      }
    ];
  }

  getResources(): ResourceEntity[] {
    return [
      {
        id: 'res-1', title: 'Design Guide 2024', type: 'Dokumentation', status: 'überprüft',
        isFavorite: true, isArchived: false, isHidden: false, categories: ['Design'],
        targetGroups: [], createdAt: Date.now(), updatedAt: Date.now(),
        areaIds: ['area-2'], projectIds: ['proj-2'], taskIds: [], meetingIds: []
      }
    ];
  }
}
