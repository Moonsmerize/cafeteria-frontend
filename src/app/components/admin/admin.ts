import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from '../../components/admin-header/admin-header';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent],
  template: `
    <app-admin-header></app-admin-header>
    <div class="admin-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .admin-content { background: #f4f6f8; min-height: calc(100vh - 60px); }
  `]
})
export class AdminComponent {}