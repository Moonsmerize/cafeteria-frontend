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
  esCompuesto?: boolean;
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

  getProduct(id: number) {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProduct(producto: Partial<Producto>) {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProduct(id: number, producto: Partial<Producto>) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}