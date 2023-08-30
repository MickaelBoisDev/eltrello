import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { InlineFormComponent } from 'src/app/shared/components/inlineForm/inlineForm.component';
import { TopBarComponent } from 'src/app/shared/components/topbar/topbar.component';
import { BoardsService } from 'src/app/shared/services/boards.service';
import { BoardInterface } from 'src/app/shared/types/board.interface';

@Component({
  selector: 'el-boards',
  templateUrl: './boards.component.html',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    RouterLinkActive,
    CommonModule,
    InlineFormComponent,
    TopBarComponent,
  ],
})
export class BoardsComponent implements OnInit {
  boards: BoardInterface[] = [];
  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }
  createBoard(title: string): void {
    this.boardsService.createBoard(title).subscribe((createBoard) => {
      this.boards = [...this.boards, createBoard];
    });
  }
}
