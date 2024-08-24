// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   Email = '';
//   Password = '';

//   public apiUrl = environment.LOGIN_BASEURL;

//   constructor(private http: HttpClient, private router: Router) {}

//   login() {
//     const url = `${this.apiUrl}/login`;
//     this.http.post(url, { Email: this.Email, Password: this.Password })
//       .subscribe({
//         next: (response: any) => {
//           localStorage.setItem('token', response.token);
//           localStorage.setItem('Email', this.Email);
//           console.log('Navigating to dashboard...');
//           this.router.navigate(['/leave-form']);
//           console.log(this.Email);
          
//         },
//         error: (error: any) => {
//           console.error('Login failed', error);
//           alert('Login failed: Invalid username or password');
//         }
//       });
//   }

//   navigateToRegister() {
//     this.router.navigate(['/register']);
//   }
// }


import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  Email = '';
  Password = '';
  isLoginVisible = true;

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.switchToSignUp();
    }, 1000);

    setTimeout(() => {
      this.switchToLogin();
    }, 3000);
  }

  switchToSignUp() {
    this.isLoginVisible = false;
  }

  switchToLogin() {
    this.isLoginVisible = true;
  }

  login() {
    const url = `${this.apiUrl}/login`;
    this.http.post(url, { Email: this.Email, Password: this.Password })
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('Email', this.Email);
          console.log('Navigating to dashboard...');
          this.router.navigate(['/leave-form']);
          console.log(this.Email);
          
        },
        error: (error: any) => {
          console.error('Login failed', error);
          alert('Login failed: Invalid username or password');
        }
      });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
