import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardInterface } from '../types/board.interface';
import { Observable } from 'rxjs';
import { TaskInterface } from '../types/task.interface';
import { environment } from 'src/environments/environment.development';
import { TaskInputInterface } from '../types/taskInput.interface';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvents.enum';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getTasks(boardId: string): Observable<TaskInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/tasks`;
    return this.http.get<TaskInterface[]>(url);
  }
}
