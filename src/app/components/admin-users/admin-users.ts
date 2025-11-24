import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, Usuario } from '../../services/user';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsersComponent implements OnInit {
  userService = inject(UserService);
  fb = inject(FormBuilder);

  usuarios = signal<Usuario[]>([]);
  showModal = false;
  isEditing = false;

  userForm: FormGroup = this.fb.group({
    id: [0],
    nombreCompleto: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''], 
    idRol: [2, Validators.required],
    activo: [true]
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }

  openModal(user?: Usuario) {
    this.showModal = true;
    
    if (user) {
      this.isEditing = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      this.userForm.patchValue({
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        email: user.email,
        idRol: user.idRol,
        activo: user.activo,
        password: ''
      });
    } else {
      this.isEditing = false;
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();

      this.userForm.reset({ id: 0, idRol: 2, activo: true });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.isEditing) {
      this.userService.updateUsuario(userData.id, userData).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.userService.createUsuario(userData).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUsuario(id: number) {
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      this.userService.deleteUsuario(id).subscribe(() => this.loadUsers());
    }
  }
}