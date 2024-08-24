import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  headers = new HttpHeaders().set('content-type', 'application/json');

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  // Local authentication method
  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'password') {
      this.loggedIn = true;
      localStorage.setItem('auth', username); // Store user details in localStorage
      return true;
    }
    return false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn || !!localStorage.getItem('auth');
  }

  logout() {
    this.loggedIn = false;
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }

  public signIn(email: string, password: string) {
    this.http.post(`${environment.nodeUri}`, { email, password }, { headers: this.headers })
      .subscribe((response: any) => {
        if (response.exists) {
          // User authenticated successfully
          localStorage.setItem('auth', email);
          localStorage.setItem('role',response.role)
          this.redirectBasedOnRole(response.role, response.email); // Redirect based on user role and email
          this.loggedIn = true;
          this.snackBar.open('Logged In  Successfully!', 'Close', {
            duration: 1019,
            verticalPosition: 'bottom',
            horizontalPosition: 'right'
          });
          // alert("success");
        } else {
          // Authentication failed
          //console.log('Authentication failed');
          localStorage.setItem('error', JSON.stringify(response));
          this.snackBar.open('Incorrect Credential', 'Close', {
            duration: 1019,
            verticalPosition: 'bottom',
            horizontalPosition: 'right'
          });
        }
      }, (error) => {
        console.error('Error while signing in:', error);
        // Handle error (e.g., display error message)
      });
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  // Method to redirect user based on role
  private redirectBasedOnRole(role: number, email: string) {
    switch (role) {
      case 1:
        this.router.navigate(['/edit']); // Redirect to admin page for admins
        break;
      case 2:
        // Redirect to edit page with email as a query parameter for guests
        this.router.navigate(['/edit']);
        break;
      case 3:
        // Redirect to edit page with email as a query parameter for other roles or if role is undefined
        this.router.navigate(['/profile']);
        break;
      case 4:
        // Redirect to edit page with email as a query parameter for other roles or if role is undefined
        this.router.navigate(['/edit']);
        break;
    }
  }
}


// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment } from 'src/app/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })


//   // constructor(private http: HttpClient, private router: Router) { }
//   export class AuthService {
//     headers = new HttpHeaders().set('content-type', 'application/json');

//     constructor(private http: HttpClient, private router: Router) { }

//     public isUserLoggedIn(): boolean {
//       return !!(localStorage.getItem('auth'));
//     }

//   public signIn(email: string, password: string) {
//     this.http.post(`${environment.nodeUri}`, { email, password }, { headers: this.headers })
//       .subscribe((response: any) => {
//         if (response.exists) {
//           // User authenticated successfully
//           localStorage.setItem('auth', JSON.stringify(response)); // Save user details in localStorage
//           this.router.navigate(['/profile']);
//         } else {
//           // Authentication failed
//           //console.log('Authentication failed');
//           localStorage.setItem('error', JSON.stringify(response)); // Save user details in localStorage

//           // Handle authentication failure (e.g., display error message)
//         }
//       }, (error) => {
//         console.error('Error while signing in:', error);
//         // Handle error (e.g., display error message)
//       });
//   }

//   // Your other methods (getUserDetails, signUp) remain unchanged
// }

// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { environment } from 'src/app/environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   userName:any;
//   headers=new HttpHeaders().set('content-type','application/json');
//   constructor(private http:HttpClient,private router:Router) { }

//   public get isUserLoggedIn(){
//     return !!(localStorage.getItem('auth'));
//   }
//   public get userDetails(){
//     return (localStorage.getItem('auth'));
//   }
//   public signIn(email:string,password:string){
//      this.http.post(`${environment.nodeUri}`,{email,password},{headers:this.headers})
//      .subscribe((res:any)=>{
//       localStorage.setItem(email,JSON.stringify(res));
//       this.router.navigate(['/profile']);
//     },(error)=>{
//       //console.log('Error occuring while calling login()',error.message);
//       localStorage.clear();
//     })
//   }
//   public signUp(firstName:string,middleName:string,secondName:string,gender:any,dob:any,mobile:number,email:string,userName:string,password:string,bio:any,hobbies:string,roles:any[]){
//     this.http.post(`${environment.nodeUri}/signup`,{firstName,middleName,secondName,gender,dob,mobile,email,userName,password,bio,hobbies,roles},{headers:this.headers}).subscribe((res:any)=>{
//      this.router.navigate(['/register']);
//    },(error)=>{
//      //console.log('Error occuring while calling signup()',error.message);
//    })
//  }
// }
