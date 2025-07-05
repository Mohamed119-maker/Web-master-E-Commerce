import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../shared/environments';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private httpClient: HttpClient, private toastrService: ToastrService) { }
  wishlistNumber: WritableSignal<number> = signal(0)

  success(message: string): void {
    this.toastrService.success(message, 'Basket');
  }

  error(message: string): void {
    this.toastrService.error(message, 'Basket');
  }
  getAllProductWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`, {
      headers: {
        token: `${localStorage.getItem('userToken')}`
      }
    })
  }
  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`,
      {
        productId: id
      },
      {
        headers: {
          token: `${localStorage.getItem('userToken')}`
        }
      }
    );
  }
  deleteProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${id}`, {
      headers: {
        token: `${localStorage.getItem('userToken')}`
      }
    }
    );
  }


}
