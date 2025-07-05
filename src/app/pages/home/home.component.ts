import { IProduct } from './../../shared/interfaces/iproduct';
import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ProductsService } from '../../core/services/products/products.service';
import { RouterLink } from '@angular/router';
import { CardComponent } from "../../shared/components/card/card/card.component";
import { CurrencyPipe } from '@angular/common';
import { ICategory } from '../../shared/interfaces/icategory';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule, RouterLink, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private readonly toaster = inject(ToastrService);
  private readonly productsService = inject(ProductsService);
  allProducts: WritableSignal<IProduct[]> = signal([]);
  allCategories: WritableSignal<ICategory[]> = signal([]);
  images: string[] = ["/240_F_1200981667_22pBq7BCVENEncp18aBcjqImGqr5DDOt.jpg", "/240_F_794318391_9EUlZQma1cTfBYAraHfneIui0OmiUtjC.jpg", "/240_F_795018435_5nkOllwtJP9xDYxoIlYq8AwF2NwKmgea.jpg"]

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllCategories();
  }
  showSuccess(): void {
    this.toaster.success("Ok");
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
        items: 2 // موبايل صغير
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
        items: 2 // موبايل صغير
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
