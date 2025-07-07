import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill out the form correctly.';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<{ token: string }>('http://localhost:3000/api/auth/login', { email, password }).subscribe({
      next: (res) => {
        const token = res.token;
        if (!token) {
          this.errorMessage = 'Invalid response from server.';
          return;
        }

        localStorage.setItem('token', token);

        // Decode token payload to extract role
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;

        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Access denied: admin only.';
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
      }
    });
  }
}
