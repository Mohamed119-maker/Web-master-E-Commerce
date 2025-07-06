import { CurrencyPipe, isPlatformBrowser, NgStyle } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnInit, Output, PLATFORM_ID, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../../interfaces/iproduct';
import { SlicePipe } from '../../../pipes/slice/slice.pipe';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe, NgStyle , SlicePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly cartService = inject(CartService);
  private readonly platformId = inject(PLATFORM_ID);

  // Input properties
  @Input() title!: string;
  @Input() imageCover!: string;
  @Input() description!: string;
  @Input() _id!: string;
  @Input() ratingsAverage!: number;
  @Input() ratingsQuantity!: number;
  @Input() price!: number;
  @Input() quantity!: number;
  @Input() totalQuantity!: number;
  @Input() showProgress!: boolean;
  @Input() showBtn!: boolean;

  // Reactive state using signals
  isInWishlist = signal<boolean>(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkWishlistStatus();
    }
  }
  @Input() product: IProduct = {} as IProduct;
  @Output() addToCart = new EventEmitter<string>();

  emitAddToCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!localStorage.getItem('userToken')) {
      this.toastrService.error('Please login to add items to cart');
      return;
    }

    this.addToCart.emit(this._id);
  }


  /**
   * Check if product is in wishlist on component initialization
   */
  private checkWishlistStatus(): void {
    const wishlist = this.getWishlistFromStorage();
    this.isInWishlist.set(wishlist.includes(this._id));
  }

  /**
   * Get wishlist array from localStorage
   */
  private getWishlistFromStorage(): string[] {
    try {
      const wishlistData = localStorage.getItem('wishlist');
      return wishlistData ? JSON.parse(wishlistData) : [];
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error);
      return [];
    }
  }

  /**
   * Save wishlist array to localStorage
   */
  private saveWishlistToStorage(wishlist: string[]): void {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }

  /**
   * Toggle product in wishlist
   */
  toggleWishlist(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!localStorage.getItem('userToken')) {
      this.toastrService.error('Please login to add items to wishlist');
      return;
    }

    const currentWishlist = this.getWishlistFromStorage();
    const isCurrentlyInWishlist = currentWishlist.includes(this._id);

    if (isCurrentlyInWishlist) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  /**
   * Add product to wishlist
   */
  private addToWishlist(): void {
    this.wishlistService.addProductToWishlist(this._id).subscribe({
      next: (response) => {
        // Update local state immediately
        this.isInWishlist.set(true);

        // Update localStorage
        const currentWishlist = this.getWishlistFromStorage();
        if (!currentWishlist.includes(this._id)) {
          currentWishlist.push(this._id);
          this.saveWishlistToStorage(currentWishlist);
        }

        // Update wishlist count
        this.wishlistService.wishlistNumber.set(response.data);
        this.toastrService.success('Added to wishlist successfully');
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
        this.toastrService.error('Failed to add to wishlist');
      }
    });
  }

  /**
   * Remove product from wishlist
   */
  private removeFromWishlist(): void {
    this.wishlistService.deleteProductFromWishlist(this._id).subscribe({
      next: (res) => {
        // Update local state immediately
        this.isInWishlist.set(false);

        // Update localStorage
        const currentWishlist = this.getWishlistFromStorage();
        const updatedWishlist = currentWishlist.filter(id => id !== this._id);
        this.saveWishlistToStorage(updatedWishlist);

        // Update wishlist count
        this.wishlistService.wishlistNumber.set(res.data);
        this.toastrService.success('Removed from wishlist successfully');
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.toastrService.error('Failed to remove from wishlist');
      }
    });
  }


  // Progress bar computed properties (existing code)
  progressPercentage = computed(() => {
    if (this.totalQuantity === 0) return 0;
    return Math.min((this.quantity / this.totalQuantity) * 100, 100);
  });

  progressBarColor = computed(() => {
    const percentage = this.progressPercentage();
    if (percentage >= 80) return '#10B981';
    if (percentage >= 50) return '#F59E0B';
    if (percentage >= 20) return '#EF4444';
    return '#DC2626';
  });

  progressBarStyle = computed(() => ({
    width: `${this.progressPercentage()}%`,
    backgroundColor: this.progressBarColor()
  }));
}
