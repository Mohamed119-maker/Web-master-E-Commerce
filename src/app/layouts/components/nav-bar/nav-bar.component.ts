import { AuthService } from './../../../core/services/auth.service';
import { Component, HostListener, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {



  // Language dropdown
  selectedLanguage: string = 'English';
  isLanguageDropdownOpen: boolean = false;
  languages: string[] = ['English', 'Arabic', 'French', 'Spanish'];

  //auth service
  authService=inject(AuthService)

  // Currency dropdown
  selectedCurrency: string = 'USD';
  isCurrencyDropdownOpen: boolean = false;
  currencies: string[] = ['USD', 'EUR', 'EGB', 'JPY'];

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
