import { SocketService } from 'src/app/shared/services/socket.service';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private socketService: SocketService) {}
  board$ = new BehaviorSubject<BoardInterface | null>(null);

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }
  leaveBoard(boardId: string): void {
    this.board$.next(null);
    this.socketService.emit(SocketEventsEnum.boardsLeave, { boardId });
  }
}
