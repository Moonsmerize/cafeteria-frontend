import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Rol {
  id: number;
  nombre: string;
}

export interface Usuario {
  id: number;
  nombreCompleto: string;
  email: string;
  idRol: number;
  rol?: Rol;
  activo: boolean;
  password?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuario`; // Endpoint del backend

  constructor() { }

  getUsuarios() {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: Partial<Usuario>) {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: Partial<Usuario>) {
    return this.http.put(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}