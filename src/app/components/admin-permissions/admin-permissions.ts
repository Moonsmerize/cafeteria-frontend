import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleService, Rol } from '../../services/role';
import { PermissionService, Permiso } from '../../services/permission';

@Component({
  selector: 'app-admin-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-permissions.html',
  styleUrl: './admin-permissions.css'
})
export class AdminPermissionsComponent implements OnInit {
  roleService = inject(RoleService);
  permissionService = inject(PermissionService);

  roles = signal<Rol[]>([]);
  permisos = signal<Permiso[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadMatrix();
  }

  async loadMatrix() {
    this.isLoading.set(true);
    try {
      const [rolesData, permisosData] = await Promise.all([
        this.roleService.getRoles().toPromise(),
        this.permissionService.getPermisos().toPromise()
      ]);

      this.roles.set(rolesData || []);
      this.permisos.set(permisosData || []);
    } catch (err) {
      console.error('Error cargando matriz', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  hasPermission(rol: Rol, permisoId: number): boolean {
    return rol.permisos?.some(p => p.id === permisoId) ?? false;
  }

  togglePermission(rol: Rol, permisoId: number, event: any) {
    const isChecked = event.target.checked;
    
    let currentPermisosIds = rol.permisos?.map(p => p.id) || [];

    if (isChecked) {
      currentPermisosIds.push(permisoId);
    } else {
      currentPermisosIds = currentPermisosIds.filter(id => id !== permisoId);
    }

    this.permissionService.updateRolPermisos(rol.id, currentPermisosIds).subscribe({
      next: () => {
        if (isChecked) {
          const permisoObj = this.permisos().find(p => p.id === permisoId);
          if (permisoObj && rol.permisos) rol.permisos.push(permisoObj);
          else if (permisoObj) rol.permisos = [permisoObj];
        } else {
          if (rol.permisos) {
            rol.permisos = rol.permisos.filter(p => p.id !== permisoId);
          }
        }
        console.log('Permisos actualizados para', rol.nombre);
      },
      error: (err) => {
        alert('Error al guardar cambios.');
        event.target.checked = !isChecked;
      }
    });
  }
}