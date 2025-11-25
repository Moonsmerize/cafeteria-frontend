import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Inventario } from './inventory';

export interface Receta {
  id: number;
  idProducto: number;
  idInventario: number;
  cantidadRequerida: number;
  inventario?: Inventario; // Para mostrar el nombre del insumo
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/receta`;

  constructor() { }

  getByProduct(idProducto: number) {
    return this.http.get<Receta[]>(`${this.apiUrl}/Producto/${idProducto}`);
  }

  addIngredient(receta: Partial<Receta>) {
    return this.http.post<Receta>(this.apiUrl, receta);
  }

  removeIngredient(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}