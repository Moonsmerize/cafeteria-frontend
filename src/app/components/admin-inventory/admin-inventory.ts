import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService, Inventario } from '../../services/inventory';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-inventory.html',
  styleUrl: './admin-inventory.css'
})
export class AdminInventoryComponent implements OnInit {
  inventoryService = inject(InventoryService);
  fb = inject(FormBuilder);

  items = signal<Inventario[]>([]);
  showModal = false;
  isEditing = false;

  itemForm: FormGroup = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
    descripcion: [''],
    stockActual: [0, [Validators.required, Validators.min(0)]],
    stockMinimo: [5, [Validators.required, Validators.min(0)]],
    costoPromedio: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService.getInventario().subscribe({
      next: (data) => this.items.set(data),
      error: (err) => console.error('Error cargando inventario', err)
    });
  }

  openModal(item?: Inventario) {
    this.showModal = true;
    if (item) {
      this.isEditing = true;
      this.itemForm.patchValue(item);
    } else {
      this.isEditing = false;
      this.itemForm.reset({ id: 0, stockActual: 0, stockMinimo: 5, costoPromedio: 0 });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.itemForm.invalid) return;

    const data = this.itemForm.value;

    if (this.isEditing) {
      this.inventoryService.updateItem(data.id, data).subscribe(() => {
        this.loadInventory();
        this.closeModal();
      });
    } else {
      const { id, ...newItem } = data;
      this.inventoryService.createItem(newItem).subscribe(() => {
        this.loadInventory();
        this.closeModal();
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('¿Estás seguro de eliminar este insumo? Esto podría afectar recetas.')) {
      this.inventoryService.deleteItem(id).subscribe(() => this.loadInventory());
    }
  }
}