import { Routes } from '@angular/router';
import { BoardsComponent } from './components/boards.component';
import { authGuard } from '../auth/guards/auth.guard';

export const boardsRoutes: Routes = [
  {
    path: '',
    component: BoardsComponent,
    canActivate: [authGuard],
  },
];
