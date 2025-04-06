import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

interface LoginResponse {
  message: string;
  user?: any;
  status?: string;
  token?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userLoginFormData = {
    email: '',
    password: ''
  };

  loggedInUser: any = null;

  constructor(private AuthService: AuthService, private router: Router) { }

  login() {
    console.log('Login data:', this.userLoginFormData);
    this.AuthService.login(this.userLoginFormData.email, this.userLoginFormData.password).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('token', response.token || '');
        
        if (response.user) {
          this.loggedInUser = response.user;
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('User data:', this.loggedInUser);

          // Navigate to /home after successful login
          this.router.navigate(['/home']);
        } else {
          alert('Login failed: ' + (response.message || 'Unknown error'));
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('An error occurred during login: ' + (error.error?.message || error.message));
      }
    });
  }
}