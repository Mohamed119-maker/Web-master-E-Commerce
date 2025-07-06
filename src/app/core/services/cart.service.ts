import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../shared/environments';
import { isPlatformBrowser } from '@angular/common';
import { ProductsService } from './products/products.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartNumber: WritableSignal<number> = signal(0)
  cartTotalPrice: WritableSignal<number> = signal(0)
  private readonly platformId = inject(PLATFORM_ID);
  myToken: any = localStorage.getItem('userToken');
  constructor(private httpClient: HttpClient) { }
  private isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('userToken');
    }
    return false;
  }

  addProductToCart(id: string): Observable<any> {
    if (!this.isLoggedIn()) {
      return of({ error: 'User not logged in' });
    }

    return this.httpClient.post(`${environment.baseUrl}/api/v1/cart`, {
      "productId": id
    },
      {
        headers: {
          token: this.myToken
        }
      })
  }

  updateCartQuantity(id: string, newCount: number): Observable<any> {
    if (!this.isLoggedIn()) {
      return of({ error: 'User not logged in' });
    }

    return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`, {
      count: newCount
    }, {
      headers: {
        token: this.myToken
      }
    }).pipe(
      catchError((error) => {
        console.error('Error updating cart quantity:', error);
        return of({ error: error.message || 'Failed to update quantity' });
      })
    );
  }

  clearUserCart(): Observable<any> {
    if (!this.isLoggedIn()) {
      return of({ error: 'User not logged in' });
    }

    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.myToken
      }
    }).pipe(
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return of({ error: error.message || 'Failed to clear cart' });
      })
    );
  }
  deleteCartItem(productId: string): Observable<any> {
    if (!this.isLoggedIn()) {
      return of({ error: 'User not logged in' });
    }

    return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${productId}`, {
      headers: {
        token: this.myToken
      }
    })
  }

  getUserCart(): Observable<any> {
    if (!this.isLoggedIn()) return of(null);
    return this.httpClient.get(`${environment.baseUrl}/api/v1/cart`, {
      headers: {
        token: this.myToken
      }
    }).pipe(
      tap((response: any) => {
        // Update cart count if response includes it
        if (response && response.data && response.data.length !== undefined) {
          this.cartNumber.set(response.data.length);
        }
      }),
      catchError((error) => {
        console.error('Error getting cart:', error);
        return of({ error: error.message || 'Failed to get cart' });
      })
    );
  }

  // Initialize cart count on service creation
  initializeCartCount(): void {
    if (this.isLoggedIn()) {
      this.getUserCart().subscribe();
    }
  }

  // Refresh cart count
  refreshCartCount(): void {
    this.initializeCartCount();
  }

  // Get current cart count
  getCartCount(): number {
    return this.cartNumber();
  }
}
