import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Usuario } from '../../services/user';
import { RoleService, Rol } from '../../services/role';

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-roles.html',
  styleUrl: './admin-roles.css'
})
export class AdminRolesComponent implements OnInit {
  userService = inject(UserService);
  roleService = inject(RoleService);

  users = signal<Usuario[]>([]);
  roles = signal<Rol[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadMatrixData();
  }

  async loadMatrixData() {
    this.isLoading.set(true);
    try {
      const [rolesData, usersData] = await Promise.all([
        this.roleService.getRoles().toPromise(),
        this.userService.getUsuarios().toPromise()
      ]);

      this.roles.set(rolesData || []);
      this.users.set(usersData || []);
    } catch (error) {
      console.error('Error cargando matriz:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  changeRole(user: Usuario, newRoleId: number) {
    if (user.idRol === newRoleId) return;

    if (user.id === 1) {
      alert('No se puede cambiar el rol del Super Admin principal.');
      this.loadMatrixData();
      return;
    }

    const updatedUser = { ...user, idRol: newRoleId };

    this.userService.updateUsuario(user.id, updatedUser).subscribe({
      next: () => {
        this.users.update(currentUsers => 
          currentUsers.map(u => u.id === user.id ? { ...u, idRol: newRoleId } : u)
        );
      },
      error: (err) => {
        alert('Error al actualizar el rol.');
        console.error(err);
        this.loadMatrixData();
      }
    });
  }
}