import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, WritableSignal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../shared/environments';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  // حفظ عدد المنتجات في المفضلة باستخدام signal
  favoriteNumber: WritableSignal<number> = signal(0);

  private platformId = inject(PLATFORM_ID);

  // تأكد إنك بتحمل البيانات من localStorage بس على الـ browser
  favoriteList = signal<string[]>(isPlatformBrowser(this.platformId)
    ? JSON.parse(localStorage.getItem('favoriteList') || '[]')
    : []);
  constructor(private httpClient: HttpClient) { }

  // ✅ 1. إضافة منتج للمفضلة
  addProductToWishlist(id: string): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/api/v1/wishlist`, { productId: id });
  }

  // ✅ 2. تحميل قائمة المفضلة من API
  loadWishlist(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }

  // ✅ 3. حذف منتج من المفضلة
  deleteProductFromWishlist(id: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${id}`);
  }

  // ✅ 4. إرجاع قائمة المنتجات المحفوظة في المفضلة
  getWishlist(): string[] {
    return this.favoriteList();

  }
}
