import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  board$ = new BehaviorSubject<BoardInterface | null>(null);

  setBoard(board: BoardInterface): void {
    this.board$.next(board);
  }
}
