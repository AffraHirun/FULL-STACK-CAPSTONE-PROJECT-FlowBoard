import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/v2/'; 

  constructor(private http: HttpClient) {}

  registerUser(user: { userName: string, userId: string, userPassword: string }): Observable<string> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<string>(`${this.apiUrl}user/register`, user, { headers, responseType: 'text' as 'json' });
  }
  
}