import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';


// Definimos la interfaz para la respuesta del Login
interface LoginResponse {
  token: string;
  usuario: string;
  rol: string;
  rolId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<LoginResponse | null>(null);


  private logoutTimer: any;

  constructor() {
    this.loadSession();
  }

  login(credentials: any) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('cafeteria_token');
    localStorage.removeItem('cafeteria_user');
    this.currentUser.set(null);

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.router.navigate(['/login']);
  }

  // MÉTODOS PRIVADOS PARA MANEJO DE SESIÓN

  private saveSession(response: LoginResponse) {
    localStorage.setItem('cafeteria_token', response.token);
    localStorage.setItem('cafeteria_user', JSON.stringify(response));
    this.currentUser.set(response);
    this.autoLogout(response.token);
  }

  private loadSession() {
    const token = localStorage.getItem('cafeteria_token');
    const userStr = localStorage.getItem('cafeteria_user');

    if (token && userStr) {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        this.logout();
      } else {
        this.currentUser.set(JSON.parse(userStr));
        this.autoLogout(token);
      }
    }
  }

  // Lógica de cierre de sesion al pasar 10 minutos
  private autoLogout(token: string) {
    const decoded: any = jwtDecode(token);
    const expirationDate = decoded.exp * 1000;
    const timeUntilLogout = expirationDate - Date.now();

    console.log(`Sesión expira en: ${timeUntilLogout / 1000} segundos`);

    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = setTimeout(() => {
      alert('Tu sesión ha expirado por inactividad (10 min).');
      this.logout();
    }, timeUntilLogout);
  }

  getToken() {
    return localStorage.getItem('cafeteria_token');
  }
}