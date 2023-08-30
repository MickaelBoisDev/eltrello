import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BoardInterface } from '../types/board.interface';
import { Observable } from 'rxjs';
import { ColumnInterface } from '../types/column.interface';
import { environment } from 'src/environments/environment.development';
import { ColumnInputInterface } from '../types/columnInput.interface';
import { SocketService } from './socket.service';
import { SocketEventsEnum } from '../types/socketEvents.enum';

@Injectable({
  providedIn: 'root',
})
export class ColumnsService {
  constructor(private http: HttpClient, private socketService: SocketService) {}

  getColumns(boardId: string): Observable<ColumnInterface[]> {
    const url = `${environment.apiUrl}/boards/${boardId}/columns`;
    return this.http.get<ColumnInterface[]>(url);
  }
  createColumn(columnInput: ColumnInputInterface): void {
    this.socketService.emit(SocketEventsEnum.columnsCreate, columnInput);
  }
}
