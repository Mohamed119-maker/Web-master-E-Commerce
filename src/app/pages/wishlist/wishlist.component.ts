import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly platformId = inject(PLATFORM_ID);

  isLoading: WritableSignal<boolean> = signal(true);
  wishlistItems: WritableSignal<IProduct[]> = signal([]);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllProduct();
    }
  }

  getAllProduct() {
    this.isLoading.set(true);
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.data);
      },
      error: (err) => {
        console.error('Error fetching wishlist:', err);
        this.wishlistService.error('Failed to load wishlist');
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  deleteProduct(id: string) {
    Swal.fire({
      title: "Remove from Wishlist?",
      text: "Are you sure you want to remove this item from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it",
      cancelButtonText: "No, keep it",
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.wishlistService.deleteProductFromWishlist(id).subscribe({
          next: (res) => {
            // Update wishlist count
            this.wishlistService.wishlistNumber.set(res.data);
            // Update local wishlist items
            this.wishlistItems.set(this.wishlistItems().filter(item => item._id !== id));

            this.wishlistService.success('Item removed from wishlist');
          },
          error: (err) => {
            console.error('Error removing item:', err);
            this.wishlistService.error('Failed to remove item from wishlist');
          }
        });
      }
    });
  }

  addToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        this.toastrService.success('Product added to cart successfully');
        // Update cart count if the response includes it
        if (response && response.data) {
          this.cartService.cartNumber.set(response.numOfCartItems);
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toastrService.error('Failed to add product to cart');
      }
    });
  }
}
