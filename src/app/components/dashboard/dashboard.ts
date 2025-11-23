import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ProductService, Producto } from '../../services/product';
import { HeaderComponent } from '../../components/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  
  productos = signal<Producto[]>([]);
  currentUser = this.authService.currentUser;

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}