import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, Usuario } from '../../services/user';
import { RoleService, Rol } from '../../services/role'; 

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsersComponent implements OnInit {
  userService = inject(UserService);
  roleService = inject(RoleService); 
  fb = inject(FormBuilder);

  usuarios = signal<Usuario[]>([]);
  listaRoles = signal<Rol[]>([]); 
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
    this.loadData();
  }

  loadData() {
    this.userService.getUsuarios().subscribe(data => this.usuarios.set(data));
    this.roleService.getRoles().subscribe(data => this.listaRoles.set(data));
  }

  openModal(user?: Usuario) {
    this.showModal = true;
    
    if (user) {
      this.isEditing = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      
      const roleId = (user.roles && user.roles.length > 0) ? user.roles[0].id : 2;

      this.userForm.patchValue({
        id: user.id,
        nombreCompleto: user.nombreCompleto,
        email: user.email,
        idRol: roleId,
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

    const formValue = this.userForm.value;
    
    const userData = {
      ...formValue,
    };

    if (this.isEditing) {
      this.userService.updateUsuario(userData.id, userData).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    } else {
      this.userService.createUsuario(userData).subscribe(() => {
        this.loadData();
        this.closeModal();
      });
    }
  }

  deleteUsuario(id: number) {
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      this.userService.deleteUsuario(id).subscribe(() => this.loadData());
    }
  }
}