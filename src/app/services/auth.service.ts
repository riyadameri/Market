import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(userData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/register`, userData);
  }

  verifyEmail(userId: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/verify`, { userId, verificationCode });
  }

  login(email: string, password: string): Observable<any> {
    const loginData = { email, password };
    return this.http.post(`${this.apiUrl}/user/login`, loginData, { headers: { 'Content-Type': 'application/json' } });
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/logout`, {});
  }

  
}