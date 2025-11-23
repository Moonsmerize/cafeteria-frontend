import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ProductService, Producto } from '../../services/product';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);

  currentUser = this.authService.currentUser;
  productos = signal<Producto[]>([]);

  // Estadísticas
  totalProductos = computed(() => this.productos().length);
  productosActivos = computed(() => this.productos().filter(p => p.activo).length);
  categoriasUnicas = computed(() => new Set(this.productos().map(p => p.categoria)).size);

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error:', err)
    });
  }

  logout() {
    this.authService.logout();
  }
}