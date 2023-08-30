import { Route } from '@angular/router';
import { AppComponent } from './app.component';
import { authGuard } from './auth/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'register',
    loadChildren: () =>
      import('src/app/auth/auth.routes').then((m) => m.registerRoutes),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('src/app/auth/auth.routes').then((m) => m.loginRoutes),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('src/app/home/home.routes').then((m) => m.homeRoutes),
  },
  {
    path: 'boards',
    loadChildren: () =>
      import('src/app/boards/boards.routes').then((m) => m.boardsRoutes),
    canActivate: [authGuard],
  },
  {
    path: 'boards/:boardId',
    loadChildren: () =>
      import('src/app/board/board.routes').then((m) => m.boardRoutes),
    canActivate: [authGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];
