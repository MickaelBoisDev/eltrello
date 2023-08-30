import { ColumnInputInterface } from './../../../shared/types/columnInput.interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardService } from '../../services/board.service';
import { Observable, combineLatest, filter, map, tap } from 'rxjs';
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
export class BoardComponent implements OnInit {
  boardId: string;
  data$: Observable<{
    board: BoardInterface;
    columns: ColumnInterface[];
    tasks: TaskInterface[];
  }>;

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

  initializeListeners(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.boardService.leaveBoard(this.boardId);
      }
    });
    this.socketService
      .listen<ColumnInterface>(SocketEventsEnum.columnsCreateSuccess)
      .subscribe((column) => {
        this.boardService.addColumn(column);
      });
    this.socketService
      .listen<TaskInterface>(SocketEventsEnum.tasksCreateSuccess)
      .subscribe((task) => {
        this.boardService.addTask(task);
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
}
