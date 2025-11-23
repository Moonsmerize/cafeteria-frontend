import { Injectable, signal, computed } from '@angular/core';
import { Producto } from './product';

export interface CartItem extends Producto {
  cantidad: number;
  subtotal: number;
}



@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>([]);
  isOpen = signal(false);
  totalVenta = computed(() => this.items().reduce((acc, item) => acc + item.subtotal, 0));
  totalItems = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0));

  constructor() { }

  addToCart(producto: Producto) {
    this.items.update(currentItems => {
      const existingItem = currentItems.find(i => i.id === producto.id);

      if (existingItem) {
        return currentItems.map(i => i.id === producto.id
          ? { 
              ...i, 
              cantidad: i.cantidad + 1, 
              subtotal: (i.cantidad + 1) * i.precioVenta 
            }
          : i);
      }

      return [...currentItems, { 
        ...producto, 
        cantidad: 1, 
        subtotal: producto.precioVenta 
      }];
    });
    console.log('Carrito actualizado:', this.items());
  }

  removeFromCart(productId: number) {
    this.items.update(items => items.filter(i => i.id !== productId));
  }

  increaseQuantity(productId: number) {
    this.items.update(items => items.map(i => i.id === productId 
      ? { ...i, cantidad: i.cantidad + 1, subtotal: (i.cantidad + 1) * i.precioVenta } 
      : i
    ));
  }

  decreaseQuantity(productId: number) {
    this.items.update(items => {
      return items.map(i => {
        if (i.id === productId) {
          const newQuantity = i.cantidad - 1;
          return { ...i, cantidad: newQuantity, subtotal: newQuantity * i.precioVenta };
        }
        return i;
      }).filter(i => i.cantidad > 0); 
    });
  }

  clearCart() {
    this.items.set([]);
  }

  toggleCart() {
    this.isOpen.update(value => !value);
  }
  
}
