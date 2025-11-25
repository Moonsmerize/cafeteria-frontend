import { Component, inject, signal } from '@angular/core'; // Importar signal
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { TicketService, VentaRequest } from '../../services/ticket'; // Importar servicio
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent {
  cartService = inject(CartService);
  ticketService = inject(TicketService);
  router = inject(Router);
  
  isProcessing = signal(false);

  cerrar() {
    this.cartService.isOpen.set(false);
  }

  pagar() {
    if (this.cartService.items().length === 0) return;   
    if (!confirm(`¿Confirmar venta por $${this.cartService.totalVenta()}?`)) return;
    this.isProcessing.set(true);

    const venta: VentaRequest = {
      productos: this.cartService.items().map(item => ({
        idProducto: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precioVenta
      }))
    };

    this.ticketService.procesarVenta(venta).subscribe({
      next: (res) => {
        alert(`¡Venta exitosa! Ticket #${res.ticketId}`);
        this.cartService.clearCart();
        this.cerrar();
        this.isProcessing.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Error al procesar la venta. ' + (err.error || 'Revisa si hay una caja abierta.'));
        this.isProcessing.set(false);
      }
    });
  }
}