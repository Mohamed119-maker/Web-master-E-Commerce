import { CurrencyPipe, NgStyle, DecimalPipe } from '@angular/common';
import { Component, Input, input, computed, inject } from '@angular/core';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  imports: [CurrencyPipe, NgStyle, DecimalPipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);

  @Input() title: string = '';
  @Input() imageCover: string = '';
  @Input() description: string = '';
  @Input() _id: string = '';
  @Input() ratingsAverage: number = 0;
  @Input() ratingsQuantity: number = 0;
  @Input() price: number = 0;
  @Input() quantity: number = 0;
  @Input() totalQuantity: number = 100; // Default total quantity
  @Input() showProgress: boolean = true;
  @Input() showBtn: boolean = true;

  // Calculate percentage
  progressPercentage = computed(() => {
    if (this.totalQuantity === 0) return 0;
    return Math.min((this.quantity / this.totalQuantity) * 100, 100);
  });

  // Get progress bar color based on percentage
  progressBarColor = computed(() => {
    const percentage = this.progressPercentage();

    if (percentage >= 80) {
      return '#10B981';
    } else if (percentage >= 50) {
      return '#F59E0B';
    } else if (percentage >= 20) {
      return '#EF4444';
    } else {
      return '#DC2626';
    }
  });

  // Get progress bar width style
  progressBarStyle = computed(() => {
    return {
      width: `${this.progressPercentage()}%`,
      backgroundColor: this.progressBarColor()
    };
  });


  addProductWishlist(id: string): void {
    if (this.isFavorite(id)) {
      // لو المنتج موجود → احذفه
      this.wishlistService.deleteProductFromWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.info(res.message, 'Basket');

          this.wishlistService.favoriteList.set(
            this.wishlistService.favoriteList().filter(productId => productId !== id)
          );
          this.wishlistService.favoriteNumber.set(this.wishlistService.favoriteList().length);
        }
      });
    } else {
      // لو المنتج مش موجود → ضيفه
      this.wishlistService.addProductToWishlist(id).subscribe({
        next: (res) => {
          this.toastrService.success(res.message, 'Basket');

          this.wishlistService.favoriteList.set([
            ...this.wishlistService.favoriteList(),
            id
          ]);
          this.wishlistService.favoriteNumber.set(this.wishlistService.favoriteList().length);
        }
      });
    }
  }

  isFavorite(id: string): boolean {
    return this.wishlistService.favoriteList().includes(id);
  }


}
