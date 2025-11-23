import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Producto {
  id: number;
  nombre: string;
  precioVenta: number;
  categoria: string;
  activo: boolean;
  imagenUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor() { }

  getProductos() {
    return this.http.get<Producto[]>(this.apiUrl);
  }
}