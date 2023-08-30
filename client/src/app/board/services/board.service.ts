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
  addTask(task: TaskInterface): void {
    const updatedTask = [...this.tasks$.getValue(), task];
    this.tasks$.next(updatedTask);
  }
  updateBoard(updateBoard: BoardInterface): void {
    const board = this.board$.getValue();
    if (!board) {
      throw new Error('Board is not initialized');
    }
    this.board$.next({ ...board, title: updateBoard.title });
  }
  updateColumn(updateColumn: ColumnInterface): void {
    const updatedColumns = this.columns$.getValue().map((column) => {
      if (column.id === updateColumn.id) {
        return { ...column, title: updateColumn.title };
      }
      return column;
    });

    this.columns$.next(updatedColumns);
  }
  deleteColumn(columnId: string): void {
    const updatedColumns = this.columns$
      .getValue()
      .filter((column) => column.id !== columnId);
    this.columns$.next(updatedColumns);
  }
}
