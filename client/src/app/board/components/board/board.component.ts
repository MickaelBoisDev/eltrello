import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoardsService } from 'src/app/shared/services/boards.service';
@Component({
  selector: 'el-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [],
})
export class BoardComponent implements OnInit {
  boardId: string;
  constructor(
    private boardService: BoardsService,
    private route: ActivatedRoute
  ) {
    const boardId = this.route.snapshot.paramMap.get('boardId');
    if (!boardId) {
      throw new Error("Can't get boardID from url");
    }
    this.boardId = boardId;
  }
  ngOnInit(): void {
    this.fetchData();
  }
  fetchData(): void {
    this.boardService.getBoard(this.boardId).subscribe((board) => {
      console.log(board);
    });
  }
}
