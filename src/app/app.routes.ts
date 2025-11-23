import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { MenuComponent } from './components/Menu/menu'; 
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { AdminProductsComponent } from './components/admin-products/admin-products';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent }, 
  { path: 'menu', component: MenuComponent }, 
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