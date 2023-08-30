import { AuthService } from './../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'el-top-bar',
  templateUrl: './topbar.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class TopBarComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
