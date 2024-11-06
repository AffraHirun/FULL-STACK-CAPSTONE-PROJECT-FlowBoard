import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator } from './email.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private authService:AuthService,private fb: FormBuilder, private router: Router,private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      userId: ['', [Validators.required, emailValidator()]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.loginForm.get('userId');
  }

  get password() {
    return this.loginForm.get('userPassword');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log("here in submit");
      const { username, password } = this.loginForm.value;
      
      console.log(this.loginForm.value);

      this.authService.generateToken(this.loginForm.value).subscribe(
        (response: any) => {
        console.log(response);
        console.log("token"+ response.token);

        this.authService.login(response.token);  // save the token in local storage 

        // alert("login successful");
        this.router.navigateByUrl("home");
      },
      (err) => {
        this.snackBar.open('Invalid credentials', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              });
      })

      // this.authService.login(this.loginForm.value).subscribe(isValid => {
      //   if (isValid) {
      //     this.router.navigate(['/home']);
      //   } else {
      //     this.snackBar.open('Invalid credentials', 'Close', {
      //       duration: 3000,
      //       horizontalPosition: 'center',
      //       verticalPosition: 'bottom'
      //     });
      //   }
    //  });
    }
  }
}
