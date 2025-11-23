import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Producto } from '../../services/product';
import { HeaderComponent } from '../header/header';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  
  currentUser = this.authService.currentUser;
  productos = signal<Producto[]>([]);
  
  productosActivos = computed(() => this.productos().filter(p => p.activo));

  ngOnInit() {
    this.productService.getProductos().subscribe(data => this.productos.set(data));
  }

  agregarAlCarrito(producto: Producto) {
    this.cartService.addToCart(producto);
  }

  logout() {
    this.authService.logout();
  }
}