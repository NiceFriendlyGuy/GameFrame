import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  regEmail = '';
  regPassword = '';
  regError = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post<any>('http://localhost:3000/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        console.log('Logged in!');
        this.router.navigate(['/']);
      },
      error: err => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }

  onRegister() {
    this.http.post<any>('http://localhost:3000/api/auth/register', {
      email: this.regEmail,
      password: this.regPassword
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        console.log('Registered!');
        this.router.navigate(['/']);
      },
      error: err => {
        this.regError = err.error?.message || 'Registration failed';
      }
    });
  }
}
