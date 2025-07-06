import { computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Component, HostListener, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProductsService } from '../../../core/services/products/products.service';
import { ICategory } from '../../../shared/interfaces/icategory';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, CurrencyPipe],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  categories: WritableSignal<ICategory[]> = signal([]);
  countCart: Signal<number> = computed(() => this.cartService.cartNumber());
  cartTotalPrice: Signal<number> = computed(() => this.cartService.cartTotalPrice());
  name: Signal<string> = computed(() => this.authService.userName());
  userInitial: string = '';

  // Language dropdown
  selectedLanguage: string = 'English';
  isLanguageDropdownOpen: boolean = false;
  languages: string[] = ['English', 'Arabic'];
  ngOnInit(): void {
    this.getAllCategories();

    this.authService.saveUserData();

    this.cartService.getUserCart().subscribe({
      next: (res) => {
        if (res && res.numOfCartItems != null) {
          this.cartService.cartNumber.set(res.numOfCartItems);
          if (res.data && res.data.totalCartPrice !== undefined) {
            this.cartService.cartTotalPrice.set(res.data.totalCartPrice);
          }
        } else {
          this.cartService.cartNumber.set(0);
          this.cartService.cartTotalPrice.set(0);
        }
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.cartService.cartNumber.set(0);
        this.cartService.cartTotalPrice.set(0);
      }
    });
    // Get user initial
    const user = JSON.parse(localStorage.getItem('userData') || '{}');
    this.userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  }

  getAllCategories(): void {
    this.productsService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      }
    })
  }

  //auth service
  authService = inject(AuthService)

  // Currency dropdown
  selectedCurrency: string = 'USD';
  isCurrencyDropdownOpen: boolean = false;
  currencies: string[] = ['USD', 'EGB'];

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      this.closeDropdowns();
    }
  }

  // Toggle language dropdown
  toggleLanguageDropdown(event: Event): void {
    event.stopPropagation();
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isCurrencyDropdownOpen = false; // Close other dropdown
  }

  // Toggle currency dropdown
  toggleCurrencyDropdown(event: Event): void {
    event.stopPropagation();
    this.isCurrencyDropdownOpen = !this.isCurrencyDropdownOpen;
    this.isLanguageDropdownOpen = false; // Close other dropdown
  }

  // Select language
  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.isLanguageDropdownOpen = false;
  }

  // Select currency
  selectCurrency(currency: string): void {
    this.selectedCurrency = currency;
    this.isCurrencyDropdownOpen = false;
  }

  // Close dropdowns when clicking outside
  closeDropdowns(): void {
    this.isLanguageDropdownOpen = false;
    this.isCurrencyDropdownOpen = false;
  }
}
