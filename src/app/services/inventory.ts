import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Inventario {
  id: number;
  nombre: string;
  descripcion?: string;
  stockActual: number;
  stockMinimo: number;
  costoPromedio: number;
}

export interface ProveedorInsumo {
  idProveedor: number;
  nombreEmpresa: string;
  ultimoCosto: number;
  codigoCatalogo: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/inventario`;

  constructor() { }

  getInventario() {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  getItem(id: number) {
    return this.http.get<Inventario>(`${this.apiUrl}/${id}`);
  }

  createItem(item: Partial<Inventario>) {
    return this.http.post<Inventario>(this.apiUrl, item);
  }

  updateItem(id: number, item: Partial<Inventario>) {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }

  deleteItem(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProvidersByInventory(id: number) {
    return this.http.get<ProveedorInsumo[]>(`${this.apiUrl}/${id}/proveedores`);
  }
}