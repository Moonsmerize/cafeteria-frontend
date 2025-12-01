import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Permiso {
  id: number;
  nombre: string;
  codigoInterno: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getPermisos() {
    return this.http.get<Permiso[]>(`${this.apiUrl}/permiso`);
  }

  updateRolPermisos(rolId: number, permisosIds: number[]) {
    return this.http.put(`${this.apiUrl}/rol/${rolId}/permisos`, permisosIds);
  }
}