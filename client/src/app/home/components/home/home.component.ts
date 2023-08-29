import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'el-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [RouterLink],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedInSubcription: Subscription | undefined;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.isLoggedInSubcription = this.authService.isLogged$.subscribe(
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigateByUrl('/register');
        }
      }
    );
  }
  ngOnDestroy(): void {
    this.isLoggedInSubcription?.unsubscribe();
  }
}
