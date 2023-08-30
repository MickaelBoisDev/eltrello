import { SocketService } from 'src/app/shared/services/socket.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { TaskInterface } from 'src/app/shared/types/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private socketService: SocketService) {}
  board$ = new BehaviorSubject<BoardInterface | null>(null);
  columns$ = new BehaviorSubject<ColumnInterface[]>([]);
  tasks$ = new BehaviorSubject<TaskInterface[]>([]);

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }
  setColumns(columns: ColumnInterface[]): void {
    this.columns$.next(columns);
  }
  setTasks(tasks: TaskInterface[]): void {
    this.tasks$.next(tasks);
  }
  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }
  addColumn(column: ColumnInterface): void {
    const updatedColumns = [...this.columns$.getValue(), column];
    this.columns$.next(updatedColumns);
  }
}
