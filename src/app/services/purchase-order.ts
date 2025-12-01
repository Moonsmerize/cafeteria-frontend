import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface DetalleOrdenDto {
  idInventario: number;
  cantidadSolicitada: number;
  costoPactado: number;
}

export interface OrdenCompraDto {
  idProveedor: number;
  detalles: DetalleOrdenDto[];
}

export interface OrdenResumen {
  id: number;
  proveedor: string;
  solicitante: string;
  fecha: string;
  total: number;
  estado: string;
  itemsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Compras`; 

  createOrder(order: OrdenCompraDto) {
    return this.http.post(`${this.apiUrl}/orden`, order);
  }

  getOrders() {
    return this.http.get<OrdenResumen[]>(`${this.apiUrl}/ordenes`);
  }

  confirmOrder(id: number) {
    return this.http.put(`${this.apiUrl}/orden/${id}/recepcion`, {});
  }
}