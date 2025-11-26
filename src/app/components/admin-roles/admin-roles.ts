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

  hasRole(user: Usuario, roleId: number): boolean {
    return user.roles?.some(r => r.id === roleId) ?? false;
  }

  toggleRole(user: Usuario, roleId: number, event: any) {
    const isChecked = event.target.checked;

    if (user.id === 1 && !isChecked && this.hasRole(user, 1) && roleId === 1) {
      alert('No se puede quitar el rol de Admin al usuario principal.');
      event.target.checked = true;
      return;
    }

    let currentRoleIds = user.roles?.map(r => r.id) || [];
    if (isChecked) {
      currentRoleIds.push(roleId);
    } else {
      currentRoleIds = currentRoleIds.filter(id => id !== roleId);
    }

    this.userService.updateUserRoles(user.id, currentRoleIds).subscribe({
      next: () => {
        this.updateLocalUserRoles(user.id, currentRoleIds);
      },
      error: (err) => {
        alert('Error al actualizar roles.');
        console.error(err);
        event.target.checked = !isChecked;
      }
    });
  }

  private updateLocalUserRoles(userId: number, newRoleIds: number[]) {
    const newRolesObjects = this.roles().filter(r => newRoleIds.includes(r.id));

    this.users.update(currentUsers => 
      currentUsers.map(u => 
        u.id === userId ? { ...u, roles: newRolesObjects } : u
      )
    );
  }
}