import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderPortalService, ProductoProveedor } from '../../services/provider-portal';
import { ProviderInventoryComponent } from '../provider-inventory/provider-inventory'; // Reutilizamos el componente anterior
import { HeaderComponent } from '../header/header';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-provider-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, ProviderInventoryComponent],
  templateUrl: './provider-dashboard.html',
  styleUrl: './provider-dashboard.css'
})
export class ProviderDashboardComponent implements OnInit {
  portalService = inject(ProviderPortalService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);

  activeTab = signal<'inventory' | 'products' | 'profile'>('inventory');

  misProductos = signal<ProductoProveedor[]>([]);
  
  profileForm: FormGroup = this.fb.group({
    nombreEmpresa: [{value: '', disabled: true}], 
    nombreContacto: ['', Validators.required],
    telefono: ['', Validators.required],
    email: [{value: '', disabled: true}] 
  });

  ngOnInit() {
    this.loadProducts();
    this.loadProfile();
  }

  loadProducts() {
    this.portalService.getProductos().subscribe(data => this.misProductos.set(data));
  }

  loadProfile() {
    this.portalService.getPerfil().subscribe(data => {
      this.profileForm.patchValue(data);
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.portalService.updatePerfil(this.profileForm.getRawValue()).subscribe(() => {
      alert('Perfil actualizado correctamente');
    });
  }

  updateProduct(prod: ProductoProveedor, nuevoPrecio: string, nuevoCodigo: string) {
    const precio = parseFloat(nuevoPrecio);
    this.portalService.updateProducto(prod.id, { 
      precioUltimoCosto: precio, 
      codigoCatalogoProveedor: nuevoCodigo 
    }).subscribe({
      next: () => alert('Producto actualizado'),
      error: () => alert('Error al actualizar')
    });
  }

  logout() {
    this.authService.logout();
  }
}