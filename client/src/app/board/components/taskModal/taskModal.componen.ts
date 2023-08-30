import { Component, HostBinding, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import {
  filter,
  map,
  combineLatest,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { InlineFormComponent } from 'src/app/shared/components/inlineForm/inlineForm.component';
import { TaskInterface } from 'src/app/shared/types/task.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ColumnInterface } from 'src/app/shared/types/column.interface';

@Component({
  selector: 'el-task-model',
  templateUrl: './taskModal.componen.html',
  standalone: true,
  imports: [CommonModule, InlineFormComponent, ReactiveFormsModule],
})
export class TaskModalComponent implements OnDestroy {
  @HostBinding('class') classes = 'task-modal';

  boardId: string;
  taskId: string;
  task$: Observable<TaskInterface>;
  data$: Observable<{ task: TaskInterface; columns: ColumnInterface[] }>;
  unsubscribe$ = new Subject<void>();

  columnForm = this.fb.group({
    columnId: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private fb: FormBuilder
  ) {
    console.log(this.route.snapshot.paramMap);

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
      this.columnForm.patchValue({
        columnId: task.columnId,
      });
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  goToBoard(): void {
    this.router.navigate(['boards', this.boardId]);
  }
  updateTaskName(taskName: string): void {
    console.log('taskName :', taskName);
  }
  updateTaskDescription(taskDescription: string): void {
    console.log('taskDescription :', taskDescription);
  }
}
