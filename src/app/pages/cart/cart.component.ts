import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private _productsService = inject(ProductsService);
  private toaster = inject(ToastrService);
  private router = inject(Router);
  private productsService = inject(CartService);

  CartTotalPrice: number = 0;
  cartProducts: any[] = [];
  cartProductsID: string[] = [];

  ngOnInit(): void {
    this.GetUserCart();
  }

  GetUserCart() {
    this._productsService.getCartUser().subscribe({
      next: (res) => {
        this.cartProducts = res.data.products;
        this.CartTotalPrice = res.data.totalCartPrice;
        this.cartProductsID = this.cartProducts.map(p => p.product.id);
        console.log('cartProductsID:', this.cartProductsID);
      },
      error: (err) => {
        this.toaster.error(err.error?.message || 'Error fetching cart');
      }
    });
  }

  updateQuantity(productId: string, newCount: number) {
    if (newCount < 1) return;
    this.productsService.updateCartQuantity(productId, newCount).subscribe({
      next: () => {
        this.toaster.success('Quantity updated');
        this.GetUserCart();
      },
      error: (err) => {
        this.toaster.error(err.error?.message || 'Failed to update quantity');
      }
    });
  }

  removeItem(productId: string) {
    this.productsService.deleteCartItem(productId).subscribe({
      next: () => {
        this.toaster.success('Product removed from cart');
        this.GetUserCart();
      },
      error: (err) => {
        this.toaster.error(err.error?.message || 'Failed to remove product');
      }
    });
  }
}
