import { Component, inject, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; 
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  @Input() userName: string = 'Usuario';
  @Output() logout = new EventEmitter<void>();
  cartService = inject(CartService);
  authService = inject(AuthService);

  isAdmin = computed(() => this.authService.currentUser()?.rol === 'Admin');

  onLogout() {
    this.logout.emit();
  }
}