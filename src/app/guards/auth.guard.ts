import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }
  // si no esta logueado se redirige a esta ruta
  router.navigate(['/login']);
  return false;
};

// Guard para Administradores
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();

  if (!user) {
    router.navigate(['/home']);
    return false;
  }

  if (user.rol === 'Admin') {
    return true;
  }

  // Si está logueado pero no es Admin lo mando a home
  alert('Acceso denegado. Se requieren permisos de administrador.');
  router.navigate(['/home']);
  return false;
};