import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.service';

@Component({
  selector: 'el-boards',
  templateUrl: './boards.component.html',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
})
export class BoardsComponent implements OnInit {
  constructor(private boardsService: BoardsService) {}

  ngOnInit(): void {
    this.boardsService.getBoards().subscribe((boards) => {
      console.log('boards : ', boards);
    });
  }
}
