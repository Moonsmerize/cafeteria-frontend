import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  cartService = inject(CartService);

  // Acciones para la vista
  cerrar() {
    this.cartService.isOpen.set(false);
  }

  pagar() {
    alert('¡Funcionalidad de pago en construcción! (Próximo paso: Backend)');
  }
}