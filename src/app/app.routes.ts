import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/Menu/dashboard'; 
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { AdminProductsComponent } from './components/admin-products/admin-products';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'dashboard', component: DashboardComponent }, 
  { 
    path: 'admin', 
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];