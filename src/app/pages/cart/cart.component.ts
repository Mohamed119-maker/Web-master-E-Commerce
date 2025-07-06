import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '../../shared/pipes/slice/slice.pipe';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, CurrencyPipe, RouterLink , SlicePipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  private _productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private toaster = inject(ToastrService);
  private router = inject(Router);

  CartTotalPrice: WritableSignal<number> = signal(0);
  cartProducts: WritableSignal<any[]> = signal([]);
  cartProductsID: WritableSignal<string[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(true);
  updatingItems: WritableSignal<Set<string>> = signal(new Set());
  removingItems: WritableSignal<Set<string>> = signal(new Set());
  userInitial: string = '';

  ngOnInit(): void {
    this.GetUserCart();
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    this.userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  }

  GetUserCart() {
    this.isLoading.set(true);
    this._productsService.getCartUser().subscribe({
      next: (res) => {
        this.cartProducts.set(res.data.products);
        if (res.data && res.data.totalCartPrice !== undefined) {
          this.CartTotalPrice.set(res.data.totalCartPrice);
        }
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.cartProductsID.set(this.cartProducts().map((p: any) => p.product.id));
        console.log('cartProductsID:', this.cartProductsID());
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        if (err.status === 401) {
          this.toaster.error('Please login to view your cart');
          this.router.navigate(['/sign-in']);
        } else {
          this.toaster.error(err.error?.message || 'Error fetching cart');
        }
        this.isLoading.set(false);
      }
    });
  }

  updateQuantity(productId: string, newCount: number) {
    // Validation checks
    if (newCount < 1) {
      this.toaster.warning('Quantity cannot be less than 1');
      return;
    }

    if (newCount > 99) {
      this.toaster.warning('Maximum quantity allowed is 99');
      return;
    }

    // Check if already updating this item
    if (this.updatingItems().has(productId)) {
      return;
    }

    // Add to updating items set
    const currentUpdating = new Set(this.updatingItems());
    currentUpdating.add(productId);
    this.updatingItems.set(currentUpdating);

    this.cartService.updateCartQuantity(productId, newCount).subscribe({
      next: (res) => {
        // Remove from updating items set
        const currentUpdating = new Set(this.updatingItems());
        currentUpdating.delete(productId);
        this.updatingItems.set(currentUpdating);

        if (res && res.error) {
          if (res.error === 'User not logged in') {
            this.toaster.error('Please login to update cart items');
            this.router.navigate(['/sign-in']);
          } else {
            this.toaster.error(res.error);
          }
        } else {
          this.toaster.success('Quantity updated successfully');
          this.GetUserCart();
        }
      },
      error: (err) => {
        // Remove from updating items set
        const currentUpdating = new Set(this.updatingItems());
        currentUpdating.delete(productId);
        this.updatingItems.set(currentUpdating);

        console.error('Error updating quantity:', err);
        if (err.status === 401) {
          this.toaster.error('Please login to update cart items');
          this.router.navigate(['/sign-in']);
        } else if (err.status === 400) {
          this.toaster.error('Invalid quantity. Please try again.');
        } else if (err.status === 404) {
          this.toaster.error('Product not found in cart');
          this.GetUserCart(); // Refresh cart to sync state
        } else {
          this.toaster.error(err.error?.message || 'Failed to update quantity');
        }
      }
    });
  }

  removeItem(productId: string) {
    // Check if already removing this item
    if (this.removingItems().has(productId)) {
      return;
    }

    // Add to removing items set
    const currentRemoving = new Set(this.removingItems());
    currentRemoving.add(productId);
    this.removingItems.set(currentRemoving);

    this.cartService.deleteCartItem(productId).subscribe({
      next: (res) => {
        // Remove from removing items set
        const currentRemoving = new Set(this.removingItems());
        this.cartService.cartNumber.set(res.numOfCartItems);
        this.cartService.cartTotalPrice.set(res.data.totalCartPrice);

        currentRemoving.delete(productId);
        this.removingItems.set(currentRemoving);

        if (res && res.error) {
          if (res.error === 'User not logged in') {
            this.toaster.error('Please login to remove cart items');
            this.router.navigate(['/sign-in']);
          } else {
            this.toaster.error(res.error);
          }
        } else {
          this.toaster.success('Item removed from cart successfully');
          this.GetUserCart();
        }
      },
      error: (err) => {
        // Remove from removing items set
        const currentRemoving = new Set(this.removingItems());
        currentRemoving.delete(productId);
        this.removingItems.set(currentRemoving);

        console.error('Error removing item:', err);
        if (err.status === 401) {
          this.toaster.error('Please login to remove cart items');
          this.router.navigate(['/sign-in']);
        } else if (err.status === 404) {
          this.toaster.error('Product not found in cart');
          this.GetUserCart(); // Refresh cart to sync state
        } else {
          this.toaster.error(err.error?.message || 'Failed to remove item from cart');
        }
      }
    });
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // Handle login redirect
  redirectToLogin(): void {
    this.toaster.info('Please login to access your cart');
    this.router.navigate(['/sign-in']);
  }

  // Check if item is being updated
  isUpdating(productId: string): boolean {
    return this.updatingItems().has(productId);
  }

  // Check if item is being removed
  isRemoving(productId: string): boolean {
    return this.removingItems().has(productId);
  }

  // Clear entire cart
  clearCart(): void {
    if (this.cartProducts().length === 0) {
      this.toaster.info('Cart is already empty');
      return;
    }

    this.cartService.clearUserCart().subscribe({
      next: (res) => {
        if (res && res.error) {
          if (res.error === 'User not logged in') {
            this.toaster.error('Please login to clear cart');
            this.router.navigate(['/sign-in']);
          } else {
            this.toaster.error(res.error);
          }
        } else {
          this.toaster.success('Cart cleared successfully');
          this.GetUserCart();
        }
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
        if (err.status === 401) {
          this.toaster.error('Please login to clear cart');
          this.router.navigate(['/sign-in']);
        } else {
          this.toaster.error(err.error?.message || 'Failed to clear cart');
        }
      }
    });
  }

  // Get total number of items in cart
  getTotalItems(): number {
    return this.cartProducts().reduce((total, item) => total + item.count, 0);
  }

  // Check if cart is empty
  isCartEmpty(): boolean {
    return this.cartProducts().length === 0;
  }
}
