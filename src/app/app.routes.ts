import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard'; 
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];