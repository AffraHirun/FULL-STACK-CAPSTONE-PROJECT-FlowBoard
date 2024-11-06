// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService } from '../services/user.service'; // Adjust the path if necessary

// @Component({
//   selector: 'app-register-user',
//   templateUrl: './register-user.component.html',
//   styleUrls: ['./register-user.component.css']
// })
// export class RegisterUserComponent {
//   registerForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private snackBar: MatSnackBar,
//     private userService: UserService
//   ) {
//     this.registerForm = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(4)]],
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]]
//     });
//   }

//   get username() {
//     return this.registerForm.get('username');
//   }

//   get email() {
//     return this.registerForm.get('email');
//   }

//   get password() {
//     return this.registerForm.get('password');
//   }

//   onSubmit() {
//     if (this.registerForm.valid) {
//       const user = {
//         userId: this.email?.value,
//         userName: this.username?.value,
//         userPassword: this.password?.value
//       };
  
//       this.userService.registerUser(user)
//         .subscribe({
//           next: (response) => {
//             this.snackBar.open(response, 'Close', {
//               duration: 2000,
//               verticalPosition: 'top',
//               horizontalPosition: 'center',
//               panelClass: ['success-snackbar']
//             });
//             this.router.navigate(['/home']);
//           },
//           error: (error) => {
//             console.error('Registration error:', error);
//             this.snackBar.open('Registration failed. Please try again.', 'Close', {
//               duration: 2000,
//               verticalPosition: 'top',
//               horizontalPosition: 'center',
//               panelClass: ['error-snackbar']
//             });
//           }
//         });
//     }
//   }
// }
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UserService } from '../services/user.service'; // Adjust the path if necessary

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email, this.emailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get username() {
    return this.registerForm.get('username');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = {
        userId: this.email?.value,
        userName: this.username?.value,
        userPassword: this.password?.value
      };
  
      // this.userService.registerUser(user)
      //   .subscribe({
      //     next: (response) => {
      //       this.snackBar.open(response, 'Close', {
      //         duration: 2000,
      //         verticalPosition: 'top',
      //         horizontalPosition: 'center',
      //         panelClass: ['success-snackbar']
      //       });
      //       this.router.navigate(['/home']);
      //     },
          this.userService.registerUser(user)
      .subscribe({
        next: (response) => {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/home']);
        },
          error: (error) => {
            console.error('Registration error:', error);
            this.snackBar.open('Registration failed. Please try again.', 'Close', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'center',
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  emailValidator(): ValidatorFn {
    // Regular expression to check the full email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    // Regular expression to ensure the domain part does not start with a number or special character
    const domainRegex = /^[A-Za-z][A-Za-z0-9.-]*[A-Za-z]$/;

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value) {
        const emailParts = control.value.split('@');
        if (emailParts.length === 2) {
          const localPart = emailParts[0];
          const domainPart = emailParts[1];
          
          // Check if the email format is correct and the domain does not start with a number or special character
          if (!emailRegex.test(control.value) || !domainRegex.test(domainPart)) {
            return { 'invalidEmail': true };
          }
        }
      }
      return null;
    };
  }
}