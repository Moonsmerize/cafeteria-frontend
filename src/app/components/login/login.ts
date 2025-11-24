import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  errorMessage = '';
  isLoading = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;


        if (response.rol === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (response.rol === 'Proveedor') {
          this.router.navigate(['/provider-portal']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error login:', err);
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
        } else {
          this.errorMessage = 'Error de conexión. Intenta más tarde.';
        }
      }
    });
  }
}