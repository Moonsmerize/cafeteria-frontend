import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { MenuComponent } from './components/Menu/menu';
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { AdminProductsComponent } from './components/admin-products/admin-products';
import { adminGuard } from './guards/auth.guard';
import { ProviderInventoryComponent } from './components/provider-inventory/provider-inventory';
import { providerGuard } from './guards/provider.guard';
import { AdminUsersComponent } from './components/admin-users/admin-users';
import { ProviderDashboardComponent } from './components/provider-dashboard/provider-dashboard';
import { AdminInventoryComponent } from './components/admin-inventory/admin-inventory';
import { AdminRecipesComponent } from './components/admin-recipes/admin-recipes';
import { AdminRolesComponent } from './components/admin-roles/admin-roles';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'admin',component: AdminComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      { path: 'products', component: AdminProductsComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'inventory', component: AdminInventoryComponent },
      { path: 'recipes', component: AdminRecipesComponent },
      { path: 'roles', component: AdminRolesComponent },
    ]},
    { 
    path: 'provider-portal',
    component: ProviderDashboardComponent,
    canActivate: [providerGuard]
  },
  { path: 'provider-inventory', component: ProviderInventoryComponent,
    canActivate: [providerGuard]},
  { path: '**', redirectTo: '' }
];