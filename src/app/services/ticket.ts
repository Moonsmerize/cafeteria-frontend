import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface DetalleVenta {
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
}

export interface VentaRequest {
  productos: DetalleVenta[];
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ticket`;

  constructor() { }

  procesarVenta(venta: VentaRequest) {
    return this.http.post<{mensaje: string, ticketId: number}>(`${this.apiUrl}/venta`, venta);
  }
}