import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, inject, input, output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IspecialProduct } from '../../../../../shared/interfaces/ispecial-product';
import { ProductsService } from './../../../../../core/services/products/products.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  imports: [CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  // Access the main section element to manipulate its style later
  @ViewChild("section") section!: ElementRef;

  // Input property for receiving product data from the parent
  product = input.required<IspecialProduct>();

  // Output event to inform parent to close the details modal
  fire = output<boolean>();

  // ProductService is injected using `inject()` API (modern Angular style)
  productsService = inject(ProductsService);

  // Inputs for scroll position to center the modal correctly
  scrollY = input.required<number>();
  scrollX = input.required<number>();

  // Used for closing subscriptions on destroy
  private closeApi: Subscription[] = [];
  // Display success process
  private readonly toaster = inject(ToastrService);

  isOpenWindowDetails: boolean = false;
  // Called after view is initialized, centers the modal
  ngAfterViewInit(): void {
    this.sentScrollXY();
  }

  // Always clean up active API subscriptions to prevent memory leaks
  ngOnDestroy(): void {
    this.closeApi.forEach((api) => api.unsubscribe());
  }

  // Emit to parent that the modal should be closed
  fireEventCloseWindowDetails(): void {
    this.fire.emit(this.isOpenWindowDetails);
  }

  // Center the modal using scroll position — good UX
  sentScrollXY(): void {
    if (this.product().data !== undefined) {
      const section = this.section.nativeElement as HTMLElement;
      section.style.position = 'fixed';
      section.style.top = '50%';
      section.style.left = '50%';
      section.style.transform = 'translate(-50%, -50%)';
    }
  }

  // Add product to cart — API call with subscription stored for cleanup
  addToCart(idProduct: string): void {
    this.closeApi.push(
      this.productsService.addToCart(idProduct).subscribe({
        next: res => console.log(res),
        error: err => console.error(err)
      })
    );
    this.toaster.success("success add to cart")
  }

  // Add product to wishlist — same cleanup logic as above
  addToWishList(idProduct: string): void {
    this.closeApi.push(
      this.productsService.addToWishList(idProduct).subscribe({
        next: res => console.log(res),
        error: err => console.error(err)
      })
    );
    this.toaster.success("success add to wishList")
  }
  // Share details in any application
  shareProduct(img: string): void {
    const data = this.product().data;
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: data.description,
        url: data.imageCover,
      }).then(() => {
        console.log('Shared successfully');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  }

}


