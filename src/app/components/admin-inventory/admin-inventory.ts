import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService, Inventario, ProveedorInsumo } from '../../services/inventory';
import { PurchaseOrderService, OrdenCompraDto, OrdenResumen } from '../../services/purchase-order';

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-inventory.html',
  styleUrl: './admin-inventory.css'
})
export class AdminInventoryComponent implements OnInit {
  inventoryService = inject(InventoryService);
  purchaseService = inject(PurchaseOrderService);
  fb = inject(FormBuilder);
  showOrdersModal = false;
  orders = signal<OrdenResumen[]>([]);

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

  showRestockModal = false;
  selectedRestockItem: Inventario | null = null;
  proveedoresDisponibles = signal<ProveedorInsumo[]>([]);
  selectedProvider: ProveedorInsumo | null = null;
  cantidadSurtir: number = 1;

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

  openRestockModal(item: Inventario) {
    this.selectedRestockItem = item;
    this.selectedProvider = null;
    this.cantidadSurtir = Math.max(1, Number(item.stockMinimo) - Number(item.stockActual) + 5); // Sugerencia de cantidad
    this.proveedoresDisponibles.set([]); 

    this.inventoryService.getProvidersByInventory(item.id).subscribe({
      next: (data) => {
        this.proveedoresDisponibles.set(data);
        this.showRestockModal = true;
      },
      error: (err) => alert('Error cargando proveedores para este producto.')
    });
  }

  closeRestockModal() {
    this.showRestockModal = false;
    this.selectedRestockItem = null;
  }

  selectProvider(prov: ProveedorInsumo) {
    this.selectedProvider = prov;
  }

  confirmRestock() {
    if (!this.selectedProvider || !this.selectedRestockItem || this.cantidadSurtir <= 0) return;

    if (!confirm(`¿Generar orden de compra a ${this.selectedProvider.nombreEmpresa} por $${(this.cantidadSurtir * this.selectedProvider.ultimoCosto).toFixed(2)}?`)) return;

    const orden: OrdenCompraDto = {
      idProveedor: this.selectedProvider.idProveedor,
      detalles: [{
        idInventario: this.selectedRestockItem.id,
        cantidadSolicitada: this.cantidadSurtir,
        costoPactado: this.selectedProvider.ultimoCosto
      }]
    };

    this.purchaseService.createOrder(orden).subscribe({
      next: (res) => {
        alert('¡Orden generada exitosamente!');
        this.closeRestockModal();
      },
      error: (err) => {
        console.error(err);
        alert('Error al generar la orden.');
      }
    });
  }

  openOrdersModal() {
    this.purchaseService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.showOrdersModal = true;
      },
      error: (err) => console.error('Error cargando órdenes', err)
    });
  }

  closeOrdersModal() {
    this.showOrdersModal = false;
  }

  confirmReception(orden: OrdenResumen) {
    if (!confirm(`¿Confirmar que recibiste la mercancía de la Orden #${orden.id}?`)) return;

    this.purchaseService.confirmOrder(orden.id).subscribe({
      next: () => {
        alert('¡Recepción confirmada! El inventario ha sido actualizado.');
        this.openOrdersModal(); 
        this.loadInventory();  
      },
      error: (err) => alert('Error al confirmar recepción: ' + err.error)
    });
  }

}