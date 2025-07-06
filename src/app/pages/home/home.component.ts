import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products/products.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { CardComponent } from "../../shared/components/card/card/card.component";
import { ICategory } from '../../shared/interfaces/icategory';
import { IProduct } from './../../shared/interfaces/iproduct';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, CardComponent ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private readonly toaster = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  allProducts: WritableSignal<IProduct[]> = signal([]);
  allCategories: WritableSignal<ICategory[]> = signal([]);
  allProductWishlist = signal<IProduct[]>([]);
  images: string[] = ["/240_F_1200981667_22pBq7BCVENEncp18aBcjqImGqr5DDOt.jpg", "/240_F_794318391_9EUlZQma1cTfBYAraHfneIui0OmiUtjC.jpg", "/240_F_795018435_5nkOllwtJP9xDYxoIlYq8AwF2NwKmgea.jpg"]

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
    this.cartService.initializeCartCount();
  }
  showSuccess(): void {
    this.toaster.success("Ok");
  }
  handleAddToCart(productId: string): void {
    this.cartService.addProductToCart(productId).subscribe({
      next: (response) => {
        this.toaster.success('Product added to cart successfully');
        // Update cart count if the response includes it
        if (response && response.data) {
          this.cartService.cartNumber.set(response.numOfCartItems);
          this.cartService.cartTotalPrice.set(response.data.totalCartPrice);

          console.log(this.cartService.cartNumber());

        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.toaster.error('Failed to add product to cart');
      }
    });
  }

  getAllProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts.set(res.data);

      }
    })
  }


  getAllCategories(): void {
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories.set(res.data);

      }
    })
  }

  getAllProductWishlist() {
    this.wishlistService.getAllProductWishlist().subscribe({
      next: (res) => {
        console.log(res.data.wishlist);
        this.allProductWishlist.set(res.data.wishlist);

      }
    })
  }

  isInWishlist(productId: string): boolean {
    return this.allProductWishlist().some(p => p._id === productId);
  }



  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,

    autoplay: true,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  categorySlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left"></i>',
      '<i class="fa-solid fa-arrow-right"></i>'
    ],
    responsive: {
      0: {
        items: 1 // موبايل صغير
      },
      576: {
        items: 3 // موبايل كبير أو تابلت صغير
      },
      768: {
        items: 4 // تابلت
      },
      992: {
        items: 5 // لابتوب صغير
      }
    },
    nav: true
  };
  productSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    autoplay: true,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-arrow-left"></i>',
      '<i class="fa-solid fa-arrow-right"></i>'
    ],
    responsive: {
      0: {
        items: 1 // موبايل صغير
      },
      576: {
        items: 3 // موبايل كبير أو تابلت صغير
      },
      768: {
        items: 4 // تابلت
      },
      992: {
        items: 5 // لابتوب صغير
      }
    },
    nav: true
  };


}
