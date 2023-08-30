import { ColumnInputInterface } from './../../../shared/types/columnInput.interface';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import {
  Observable,
  Subject,
  combineLatest,
  filter,
  map,
  takeUntil,
  tap,
} from 'rxjs';
import { BoardInterface } from 'src/app/shared/types/board.interface';
import { CommonModule } from '@angular/common';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';
import { ColumnsService } from 'src/app/shared/services/column.service';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { TopBarComponent } from 'src/app/shared/components/topbar/topbar.component';
import { InlineFormComponent } from 'src/app/shared/components/inlineForm/inlineForm.component';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { TasksService } from 'src/app/shared/services/task.service';
import { TaskInputInterface } from 'src/app/shared/types/taskInput.interface';
@Component({
  selector: 'el-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [CommonModule, TopBarComponent, InlineFormComponent],
})
export class BoardComponent implements OnInit, OnDestroy {
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;
  unsubscribe$ = new Subject<void>();

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private socketService: SocketService,
    private columnService: ColumnsService,
    private tasksService: TasksService
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error("Can't get boardID from url");
    }
    this.boardId = boardId;

    this.data$ = combineLatest([
      this.boardService.board$.pipe(filter(Boolean)),
      this.boardService.columns$,
      this.boardService.tasks$,
    ]).pipe(
      takeUntil(this.unsubscribe$),
      map(([board, columns, tasks]) => ({
        board,
        columns,
        tasks,
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
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((task) => {
        this.boardService.addTask(task);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.boardsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedBoard) => {
        this.boardService.updateBoard(updatedBoard);
      });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsUpdateSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((updatedColumn) => {
        this.boardService.updateColumn(updatedColumn);
      });
    this.socketService
      .listen<void>(SocketEventsEnum.boardsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigateByUrl('/boards');
      });
    this.socketService
      .listen<string>(SocketEventsEnum.columnsDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((columnId) => {
        this.boardService.deleteColumn(columnId);
      });
  }

  fetchData(): void {
    this.boardsService.getBoard(this.boardId).subscribe((board) => {
      this.boardService.setBoard(board);
    });
    this.columnService.getColumns(this.boardId).subscribe((columns) => {
      this.boardService.setColumns(columns);
    });
    this.tasksService.getTasks(this.boardId).subscribe((tasks) => {
      this.boardService.setTasks(tasks);
    });
  }
  createColumn(title: string): void {
    const columnInput: ColumnInputInterface = {
      title,
      boardId: this.boardId,
    };
    this.columnService.createColumn(columnInput);
  }
  getTasksByColumn(columnId: string, tasks: TaskInterface[]): TaskInterface[] {
    return tasks.filter((task) => task.columnId === columnId);
  }
  createTask(title: string, columnId: string): void {
    const taskInput: TaskInputInterface = {
      title,
      columnId,
      boardId: this.boardId,
    };
    this.tasksService.createTask(taskInput);
  }
  updateBoardName(boardName: string): void {
    this.boardsService.updateBoard(this.boardId, { title: boardName });
  }
  updateColumnName(columnName: string, columnId: string): void {
    this.columnService.updateColumn(this.boardId, columnId, {
      title: columnName,
    });
  }
  deleteBoard(): void {
    if (confirm('Are you sure you want to delete the board')) {
      this.boardsService.deleteBoard(this.boardId);
    }
  }
  deleteColumn(columnId: string): void {
    if (confirm('Are you sure you want to delete the board')) {
      this.columnService.deleteColumn(this.boardId, columnId);
    }
  }
}
