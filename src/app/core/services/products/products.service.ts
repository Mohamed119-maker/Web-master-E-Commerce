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
  getAllCategories(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/categories`)
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
  getCartUser(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.authService.getTokenUser()
      }
    });
  }
  checkOutSeccion(phone: number, city: string, cartId: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`, {
      "shippingAddress": {
        details: "details",
        phone: phone,
        city: city
      }
    }, {
      headers: {
        token: this.authService.getTokenUser()
      }
    })
  }
}
