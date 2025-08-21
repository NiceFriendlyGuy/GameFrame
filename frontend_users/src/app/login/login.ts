import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  public email = '';
  public password = '';
  public error = '';

  public regEmail = '';
  public regPassword = '';
  public regError = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post<any>('https://api.gameframe.ch/api/auth/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: res => {
        localStorage.setItem('token', res.token);
        console.log('Logged in!');
        this.router.navigate(['/']).then(() => {
        // Optionally force a reload of the component
        window.location.reload();  // place it here if really needed
      });
      },
      error: err => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }

  onRegister() {
    this.http.post<any>('https://api.gameframe.ch/api/auth/register', {
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
