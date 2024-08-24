import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { LeaveFormComponent } from './leave-form/leave-form.component';
import { LeaveEditComponent } from './leave-edit/leave-edit.component';

// const routes: Routes = [
//   { path:'', redirectTo:'login', pathMatch:'full' },
//   { path:'login', component:LoginComponent },
//   { path:'register', component: RegisterComponent },
//   { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
//   { path: 'leave-form', component: LeaveFormComponent, canActivate: [authGuard] },
// ];
const routes: Routes = [
  { path:'', redirectTo:'login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path:'register', component: RegisterComponent },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [authGuard
    ],
    children: [
      { path: 'leave-form', component: LeaveFormComponent },
      { path: 'leave-edit', component: LeaveEditComponent },
      { path: '', redirectTo: '/leave-form', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
