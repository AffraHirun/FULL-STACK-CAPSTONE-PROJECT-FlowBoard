import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  isHomePage: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/home';
    });
  }

  isLandingPage(): boolean {
    return this.router.url === '/home'; // Check if on the landing page
  }

  isRegisterPage(): boolean {
    return this.router.url === '/register'; // Check if on the register page
  }
}
