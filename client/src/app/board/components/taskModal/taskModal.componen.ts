import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import {
  filter,
  map,
  combineLatest,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { InlineFormComponent } from 'src/app/shared/components/inlineForm/inlineForm.component';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import { ColumnInterface } from 'src/app/shared/types/column.interface';
import { TasksService } from 'src/app/shared/services/task.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { SocketEventsEnum } from 'src/app/shared/types/socketEvents.enum';

@Component({
  selector: 'el-task-model',
  templateUrl: './taskModal.componen.html',
  standalone: true,
  imports: [CommonModule, InlineFormComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  columnForm = this.fb.group({
    columnId: [null as string | null],
  });
  unsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private fb: FormBuilder,
    private tasksService: TasksService,
    private socketService: SocketService
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    const boardId = this.route.parent?.snapshot.paramMap.get('boardId');

    if (!boardId) {
      throw new Error("Can't get boardID from URL");
    }

    if (!taskId) {
      throw new Error("Can't get taskID from URL");
    }

    this.taskId = taskId;
    this.boardId = boardId;
    this.task$ = this.boardService.tasks$.pipe(
      map((tasks) => {
        return tasks.find((task) => task.id === this.taskId);
      }),
      filter(Boolean)
    );
    this.data$ = combineLatest([this.task$, this.boardService.columns$]).pipe(
      map(([task, columns]) => ({
        task,
        columns,
      }))
    );

    this.task$.pipe(takeUntil(this.unsubscribe$)).subscribe((task) => {
      this.columnForm.patchValue({ columnId: task.columnId });
    });

    combineLatest([this.task$, this.columnForm.get(['columnId'])!.valueChanges])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([task, columnId]) => {
        if (task.columnId !== columnId) {
          this.tasksService.updateTask(this.boardId, task.id, { columnId });
        }
      });
    this.socketService
      .listen<string>(SocketEventsEnum.tasksDeleteSuccess)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.goToBoard());
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }

  updateTaskName(taskName: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      title: taskName,
    });
  }

  updateTaskDescription(taskDesctiption: string): void {
    this.tasksService.updateTask(this.boardId, this.taskId, {
      description: taskDesctiption,
    });
  }
  deleteTask(): void {
    this.tasksService.deleteTask(this.boardId, this.taskId);
  }
}
