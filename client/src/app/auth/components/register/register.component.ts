import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'el-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
})
export class RegisterComponent implements OnInit {
  form = this.fb.group({
    email: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}
  OnSubmit() {
    console.log('onSubmit', this.form.value);
  }
}
