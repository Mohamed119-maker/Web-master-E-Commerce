import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../shared/environments';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartNumber:WritableSignal<number>=signal(0)
private readonly platformId = inject(PLATFORM_ID);
  constructor(private httpClient: HttpClient)  { }
 private isLoggedIn(): boolean {
    //  نتحقق إننا داخل المتصفح فقط
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  addProductToCart(id: string): Observable<any> {
    if (!this.isLoggedIn()) return of(null);
    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      productId: id});
  }

  getUserCart(): Observable<any> {
      if (!this.isLoggedIn()) return of(null);
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`);
  }
  deleteItem(id: string): Observable<any> {
    if (!this.isLoggedIn()) return of(null);
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`);
  }
  updateCartQuantity(id: string, newCount: number): Observable<any> {
    if (!this.isLoggedIn()) return of(null);
    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`, {
      count: newCount
    });
  }

  clearUserCart(): Observable<any> {
    if (!this.isLoggedIn()) return of(null);
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`);
  }


}
