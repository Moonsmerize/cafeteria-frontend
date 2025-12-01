import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Permiso } from './permission';

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: Permiso[];
}

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/rol`;

  getRoles() {
    return this.http.get<Rol[]>(this.apiUrl);
  }
}