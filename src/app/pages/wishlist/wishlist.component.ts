import { Component, inject, OnInit, PLATFORM_ID, WritableSignal, signal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  imports: [CurrencyPipe],
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  private readonly wishlistService = inject(WishlistService);
  private readonly toastrService = inject(ToastrService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  numOfItems: number = this.wishlistService.favoriteNumber();
  productsWishlist: WritableSignal<IProduct[]> = signal([]);

  ngOnInit(): void {
    if (localStorage.getItem('token') !== null) {
      this.loadWishlist();
    }

  }

  loadWishlist(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('User not logged in — skipping wishlist load');
        return;
      }

      this.wishlistService.loadWishlist().subscribe({
        next: (res) => {
          this.numOfItems = res.count;
          this.productsWishlist = res.data;

          const ids = res.data.map((product: any) => product.id);
          this.wishlistService.favoriteList.set(ids);
          this.wishlistService.favoriteNumber.set(ids.length);
          localStorage.setItem('favoriteList', JSON.stringify(ids));
        }
      });
    }
  }


  // addToCart(id: string): void {
  //   this.cartService.addProductToCart(id).subscribe({
  //     next: (res) => {
  //       console.log(res);

  //       this.cartService.cartNumber.set(res.numOfCartItems);

  //       this.toastrService.success(res.message, 'Trendify');

  //     }
  //   })
  // }

  // ✅ إضافة منتج للمفضلة
  addProductWishlist(id: string): void {
    this.wishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        this.wishlistService.favoriteList.set([...this.wishlistService.favoriteList(), id]);
        this.wishlistService.favoriteNumber.set(this.wishlistService.favoriteList().length);
        localStorage.setItem('favoriteList', JSON.stringify(this.wishlistService.favoriteList()));
      }
    });
  }

  deleteProductFromWishlist(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        this.wishlistService.deleteProductFromWishlist(id).subscribe({
          next: () => {
            // ✅ حذف المنتج من الـ signal مباشرة بدون تحديث القائمة بالكامل
            const updatedList = this.wishlistService.favoriteList().filter(productId => productId !== id);
            this.wishlistService.favoriteList.set(updatedList);
            this.wishlistService.favoriteNumber.set(this.productsWishlist().length);

            // ✅ تحديث المنتجات في الـ UI فقط بدون تحميل جديد
            this.productsWishlist.set(this.productsWishlist().filter(product => product.id !== id));

            // ✅ تحديث الـ localStorage
            localStorage.setItem('favoriteList', JSON.stringify(updatedList));
            this.wishlistService.favoriteNumber.set(this.productsWishlist().length);
            this.numOfItems = this.wishlistService.favoriteNumber();
          }
        });
      }
    });

  }

  isFavorite(id: string): boolean {
    return this.wishlistService.favoriteList().includes(id);
  }
}
