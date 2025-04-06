import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // هذا كافٍ عادةً، ولكن إذا أضفتها في @Component فلا حاجة له
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:3000/user';

  constructor(private http: HttpClient) { }

  getUserDataById(id:string){
    return this.http.get(`${this.apiUrl}/get/${id}`)
  }


}