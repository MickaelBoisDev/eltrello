import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardService } from './services/board.service';
import { Observable, combineLatest, filter, map, tap } from 'rxjs';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { CommonModule } from '@angular/common';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';
import { ColumnsService } from 'src/app/shared/services/column.service';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { TopBarComponent } from 'src/app/shared/components/topbar/topbar.component';
@Component({
  selector: 'el-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [CommonModule, TopBarComponent],
})
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
  }>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnService: ColumnsService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error("Can't get boardID from url");
    }
    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
    ]).pipe(
      map(([board, columns]) => ({
        board,
        columns,
      }))
    );
  }

  ngOnInit(): void {
    this.socketService.emit(SocketEventsEnum.boardsJoin, {
      boardId: this.boardId,
    });
    this.fetchData();
    this.initializeListeners();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
    this.columnService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });
  }
}
