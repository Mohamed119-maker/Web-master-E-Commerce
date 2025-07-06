import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { PlateformService } from '../../core/services/plateForm/plateform.service';
import { ProductsService } from '../../core/services/products/products.service';
import { LoadingComponent } from "../../shared/components/loading/loading/loading.component";
import { IdetailsCart } from '../../shared/interfaces/idetails-cart';

@Component({
  selector: 'app-checkout',
  imports: [LoadingComponent, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  detailsCart: IdetailsCart[] = [];
  isLoading: boolean = true;
  @ViewChild("phone") phone!: ElementRef;
  @ViewChild("city") city!: ElementRef;
  private productsService = inject(ProductsService)
  private plateformService = inject(PlateformService)
  private cartId: string = "";
  ngOnInit(): void {
    this.getCartUser();
  }
  checkOutSesstion(): void {
    this.productsService.checkOutSeccion(this.phone.nativeElement, this.city.nativeElement, this.cartId).subscribe({
      next: res => {
        window.location.href = res.session.url;
      },
      error: err => console.log(err)
    });
  }
  private getCartUser(): void {
    if (this.plateformService.checkPlateform()) {
      this.productsService.getCartUser().subscribe({
        next: res => {
          this.isLoading = false
          this.detailsCart = [res]
          this.cartId = res.cartId;
        },
        error: err => console.error('Error:', err)
      });
    }
  }


}
