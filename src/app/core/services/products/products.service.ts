import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../shared/environments';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  constructor(private httpClient: HttpClient) { }
  authService = inject(AuthService);

  getAllProducts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products`)
  }
  getSpecialProduct(id: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/products/${id}`)
  }
  addToCart(idProduct: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: idProduct
    }, {
      headers: {
        token: `${this.authService.getTokenUser()}`
      }
    })
  }
  addToWishList(idProduct: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, {
      productId: idProduct
    }, {
      headers: {
        token: `${this.authService.getTokenUser()}`
      }
    })
  }
}
