import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

interface LoginResponse {
  message: string;
  user?: any;
  status?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], // Removed duplicate FormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userLoginFormData = {
    email: '',
    password: ''
  };

  loggedInUser: any = null;

  constructor(private AuthService: AuthService) { }

  login() {
    console.log('Login data:', this.userLoginFormData);
    this.AuthService.login(this.userLoginFormData.email, this.userLoginFormData.password).subscribe({
      next: (response: LoginResponse) => {
        if (response.user) { // Check for user instead of status
          this.loggedInUser = response.user;
          alert('Login successful');
          console.log('User data:', this.loggedInUser);
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