import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../header/header';
import { AuthService } from '../../services/auth';

interface Inventario {
  id: number;
  nombre: string;
  descripcion: string;
  stockActual: number;
  stockMinimo: number;
  costoPromedio: number;
}

@Component({
  selector: 'app-provider-inventory',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './provider-inventory.html',
  styleUrl: './provider-inventory.css'
})
export class ProviderInventoryComponent implements OnInit {
  private http = inject(HttpClient);
  authService = inject(AuthService);
  
  inventory = signal<Inventario[]>([]);

  lowStockItems = computed(() => 
    this.inventory().filter(i => i.stockActual <= i.stockMinimo)
  );

  ngOnInit() {
    this.http.get<Inventario[]>(`${environment.apiUrl}/inventario`)
      .subscribe(data => this.inventory.set(data));
  }

  logout() {
    this.authService.logout();
  }
}