import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Proveedor } from './provider';

export interface ProductoProveedor {
  id: number; 
  insumo: string;
  descripcion: string;
  precioUltimoCosto: number;
  codigoCatalogoProveedor: string;
}

export interface PedidoProveedor {
  id: number;
  fecha: string;
  solicitante: string;
  total: number;
  estado: string;
  detalles: {
    insumo: string;
    cantidad: number;
    costoPactado: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProviderPortalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/PortalProveedor`;

  constructor() { }

  getPerfil() {
    return this.http.get<Proveedor>(`${this.apiUrl}/perfil`);
  }

  updatePerfil(datos: Partial<Proveedor>) {
    return this.http.put(`${this.apiUrl}/perfil`, datos);
  }

  getProductos() {
    return this.http.get<ProductoProveedor[]>(`${this.apiUrl}/productos`);
  }

  updateProducto(idRelacion: number, datos: { precioUltimoCosto: number, codigoCatalogoProveedor: string }) {
    return this.http.put(`${this.apiUrl}/producto/${idRelacion}`, datos);
  }

  getMisPedidos() {
    return this.http.get<PedidoProveedor[]>(`${this.apiUrl}/pedidos`);
  }
  
}