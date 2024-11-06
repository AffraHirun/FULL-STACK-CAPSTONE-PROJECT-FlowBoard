import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

interface User {
  userId: string;
  role: 'admin' | 'user'; // Extend this based on your roles
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false; // Use private to encapsulate the status
  private currentUser: User | null = null; // Store the currently logged-in user
  private apiUrl = 'http://localhost:8080/api/v1/'; // Replace with your API URL
  private tokenKey = 'token'; // Key for token storage

  constructor(private httpClient: HttpClient) { }

  // Login with username and password
  // login(userId: string, userPassword: string): Observable<boolean> {
  //   console.log("here in login 1");
  //   const payload = { userId: userId, userPassword: userPassword };

  //   return this.httpClient.post<{ token: string }>(`${this.apiUrl}login`, payload).pipe(
  //     map(response => {
  //       console.log("here in login 2");
  //       if (response && response.token) {
  //         this.loggedInStatus = true;
  //         console.log("here in login 3");
  //         // Decode the token to extract user info (assuming JWT)
  //         const user = this.decodeToken(response.token);
  //         this.currentUser = user;
  //         console.log(response.token);
  //         localStorage.setItem(this.tokenKey, response.token); // Store the token
  //         return true;
  //       } else {
  //         console.log("here in login 4");
  //         this.loggedInStatus = false;
  //         this.currentUser = null;
  //         localStorage.removeItem(this.tokenKey); // Clear the token
  //         return false;
  //       }
  //     }),
  //     catchError(() => {
  //       this.loggedInStatus = false;
  //       this.currentUser = null;
  //       localStorage.removeItem(this.tokenKey); // Clear the token
  //       return of(false); // Return false in case of an error
  //     })
  //   );
  // }

  // login(obj:any): Observable<boolean> {
  //   console.log("here in login 1");
  //   // console.log(username);
  //   // console.log(password);
  //   console.log(obj)
  //   // const payload = { userId: username, userPassword: password };
  //   // const payload=null
  //   // console.log(payload)

  //   return this.httpClient.post<any>(`${this.apiUrl}login`, obj).pipe(
  //     map(response => {
  //       console.log("here in login 2");
  //       console.log(response.token);
  //       return this.handleLoginResponse(response);
        
  //     }),
  //     catchError(() => {
  //       this.handleLoginError();
  //       return of(false); // Return false in case of an error
  //     })
  //   );
  // }

  // // Function to handle login response
  // private handleLoginResponse(response: { token: string }): boolean {
  //   console.log("here in login 3");
  //   if (response && response.token) {
  //     this.loggedInStatus = true;
  //     console.log(response.token);
  //     // Decode the token to extract user info (assuming JWT)
  //     const user = this.decodeToken(response.token);
  //     this.currentUser = user;
  //     localStorage.setItem(this.tokenKey, response.token); // Store the token
  //     return true;
  //   } else {
  //     console.log("here in login 4");
  //     this.loggedInStatus = false;
  //     this.currentUser = null;
  //     localStorage.removeItem(this.tokenKey); // Clear the token
  //     return false;
  //   }
  // }

  // // Function to handle login error
  // private handleLoginError(): void {
  //   this.loggedInStatus = false;
  //   this.currentUser = null;
  //   localStorage.removeItem(this.tokenKey); // Clear the token
  // }

  // // Function to generate token (if needed separately)
  // private generateToken(data: any): Observable<{ token: string }> {
  //   return this.httpClient.post<{ token: string }>(`${this.apiUrl}generateToken`, data);
  // }
  login(token: any) {
    localStorage.setItem('token', token); // api+token
    const user=this.decodeToken(token);
    this.currentUser =user;
    this.loggedInStatus=true;
    return true;
}
  generateToken(data: any): Observable<any> {
    
    return this.httpClient.post<any>(this.apiUrl + 'login', data);
  }


  // Logout the user
  logout(): void {
    this.loggedInStatus = false;
    this.currentUser = null;
    localStorage.removeItem(this.tokenKey); // Clear the token
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.loggedInStatus;
  }

  // Check if the current user is an admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Decode the token to extract user information
  private decodeToken(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("in decodetoken : "+payload.userId);
      console.log("in decodetoken : "+payload.userRole);
      return { userId: payload.userId, role: payload.userRole };
    } catch (e) {
      console.error('Token decoding failed', e);
      return { userId: '', role: 'user' }; // Fallback default user
    }
  }
}