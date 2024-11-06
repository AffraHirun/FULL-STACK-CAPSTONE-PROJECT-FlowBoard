import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  constructor(private router: Router) {}

  navigateToHomeView(): void {
    this.router.navigate(["home"]);
  }

  navigateToLoginView(): void {
    this.router.navigate(['/login']);
  }
}
