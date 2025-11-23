import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService, Producto } from '../../services/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProductsComponent implements OnInit {
  productService = inject(ProductService);
  fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  showModal = false;
  isEditing = false;
  
  productForm: FormGroup = this.fb.group({
    id: [0],
    nombre: ['', Validators.required],
    precioVenta: [0, [Validators.required, Validators.min(0)]],
    categoria: ['', Validators.required],
    imagenUrl: [''],
    activo: [true]
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProductos().subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error(err)
    });
  }

  openModal(prod?: Producto) {
    this.showModal = true;
    if (prod) {
      this.isEditing = true;
      this.productForm.patchValue(prod);
    } else {
      this.isEditing = false;
      this.productForm.reset({ id: 0, activo: true, precioVenta: 0 });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.isEditing) {
      this.productService.updateProduct(productData.id, productData).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    } else {
      const { id, ...newProduct } = productData; 
      this.productService.createProduct(newProduct).subscribe(() => {
        this.loadProducts();
        this.closeModal();
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('¿Estás seguro de desactivar este producto?')) {
      this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}