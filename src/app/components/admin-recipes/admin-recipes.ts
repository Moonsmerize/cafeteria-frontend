import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService, Producto } from '../../services/product';
import { InventoryService, Inventario } from '../../services/inventory';
import { RecipeService, Receta } from '../../services/recipe';

@Component({
  selector: 'app-admin-recipes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-recipes.html',
  styleUrl: './admin-recipes.css'
})
export class AdminRecipesComponent implements OnInit {
  productService = inject(ProductService);
  inventoryService = inject(InventoryService);
  recipeService = inject(RecipeService);
  fb = inject(FormBuilder);

  productos = signal<Producto[]>([]);
  insumos = signal<Inventario[]>([]);
  
  // Producto seleccionado actualmente
  selectedProduct = signal<Producto | null>(null);
  // Receta del producto seleccionado
  currentRecipe = signal<Receta[]>([]);

  recipeForm: FormGroup = this.fb.group({
    idInventario: ['', Validators.required],
    cantidadRequerida: [1, [Validators.required, Validators.min(0.0001)]]
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar productos y catálogo de insumos al iniciar
    this.productService.getProductos().subscribe(data => this.productos.set(data));
    this.inventoryService.getInventario().subscribe(data => this.insumos.set(data));
  }

  selectProduct(prod: Producto) {
    this.selectedProduct.set(prod);
    this.loadRecipe(prod.id);
  }

  loadRecipe(productId: number) {
    this.recipeService.getByProduct(productId).subscribe({
      next: (data) => this.currentRecipe.set(data),
      error: (err) => console.error('Error cargando receta', err)
    });
  }

  addIngredient() {
    if (this.recipeForm.invalid || !this.selectedProduct()) return;

    const formValue = this.recipeForm.value;
    
    const newReceta: Partial<Receta> = {
      idProducto: this.selectedProduct()!.id,
      idInventario: Number(formValue.idInventario),
      cantidadRequerida: formValue.cantidadRequerida
    };

    this.recipeService.addIngredient(newReceta).subscribe({
      next: () => {
        this.loadRecipe(this.selectedProduct()!.id);
        this.recipeForm.reset({ cantidadRequerida: 1 });
      },
      error: (err) => alert('Error: Verifica que el ingrediente no esté ya agregado o que la cantidad sea válida.')
    });
  }

  removeIngredient(id: number) {
    if (confirm('¿Quitar este ingrediente de la receta?')) {
      this.recipeService.removeIngredient(id).subscribe(() => {
        if (this.selectedProduct()) {
          this.loadRecipe(this.selectedProduct()!.id);
        }
      });
    }
  }
}