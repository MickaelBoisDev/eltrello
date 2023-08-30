import { Route } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const registerRoutes: Route[] = [
  {
    path: '',
    component: RegisterComponent,
  },
];
export const loginRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
];
