import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'el-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
})
export class RegisterComponent implements OnInit {
  errorMessage: string | null = null;
  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {}
  OnSubmit() {
    console.log(this.form.value);

    this.authService.register(this.form.getRawValue()).subscribe({
      next: (currentUser) => {
        console.log('currentUser: ', currentUser);
        this.authService.setToken(currentUser);
        this.authService.setCurrentUser(currentUser);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('err', err.error);
        this.errorMessage = err.error.join(', ');
      },
    });
  }
}