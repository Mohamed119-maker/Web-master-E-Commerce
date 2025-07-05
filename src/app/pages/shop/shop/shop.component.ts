import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../../core/services/products/products.service';
import { LoadingComponent } from "../../../shared/components/loading/loading/loading.component";
import { IProduct } from '../../../shared/interfaces/iproduct';
import { IspecialProduct } from '../../../shared/interfaces/ispecial-product';
import { SlicePipe } from '../../../shared/pipes/slice/slice.pipe';
import { DetailsComponent } from './details/details/details.component';

@Component({
  selector: 'app-shop',
  imports: [FormsModule, LoadingComponent, SlicePipe, DetailsComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  // All products fetched from the API
  product: IProduct[] = [];

  // Products shown after filters/search/sorting applied
  filteredProducts: IProduct[] = [];

  // Available categories and brands for filtering
  categories: string[] = [];
  brands: string[] = [];

  // Selected filters
  selectedBrands = new Set<string>();
  selectCategory = new Set<string>();

  // Search input value
  search: string = "";

  // Loading states
  isLoading: boolean = true;       // actual API loading
  isFakeLoading: boolean = true;   // fake delay to simulate smooth UI transition

  // Current product details
  specialProduct: IspecialProduct = {} as IspecialProduct;

  // Product details window toggle
  isOpenWindowDetails: boolean = false;

  // Scroll positions (used to restore after closing details window)
  scrollX: number = 0;
  scrollY: number = 0;

  // Timeout used to delay UI scroll handling
  timeOut: any;

  // Option selected in sort dropdown
  getValueOption: string = "";

  // Reference to the product details component
  @ViewChild(DetailsComponent) detailsComp!: DetailsComponent;

  // Initial state of filter checkboxes (true = selected)
  isBrandChecked: boolean[] = [true, true, true, true, true, true, true, true, true];
  isCategoryChecked: boolean[] = [true, true, true];

  // Track and unsubscribe from all subscriptions on destroy
  private closeApi: Subscription[] = [];

  // Inject ProductsService for API calls
  private productsService = inject(ProductsService);

  ngOnInit(): void {
    this.getProducts(); // Load all products on component init
  }
  ngOnDestroy(): void {
    // Unsubscribe from all active API subscriptions to prevent memory leaks
    this.closeApi.forEach((api) => api.unsubscribe());

    // Clear any active timeouts
    if (this.timeOut) {
      clearTimeout(this.timeOut);
    }
  }

  onSearchChange(): void {
    this.applyFilters(); // Filter products based on current search term
  }

  // Toggle selected brand and reapply filters after a short delay (simulating loading)
  toggleBrand(brand: string, isChecked: boolean, index: number): void {
    this.isFakeLoading = true;
    setTimeout(() => {
      isChecked ? this.selectedBrands.add(brand) : this.selectedBrands.delete(brand);
      this.isBrandChecked[index] = !isChecked;
      this.applyFilters();
      this.isFakeLoading = false;
    }, 2000)
  }
  // Toggle selected category and reapply filters after a short delay (simulating loading)
  toggleCategory(category: string, isChecked: boolean, index: number): void {
    this.isFakeLoading = true;
    setTimeout(() => {
      isChecked ? this.selectCategory.add(category) : this.selectCategory.delete(category);
      this.isCategoryChecked[index] = !isChecked;
      this.applyFilters();
      this.isFakeLoading = false;
    }, 2000)
  }
  // Fetch full details of a specific product (by id) and open the details window

  getSpecialProduct(id: string): void {
    this.closeApi.push(this.productsService.getSpecialProduct(id).subscribe({
      next: res => {
        this.specialProduct = res;
        this.isOpenWindowDetails = true;
        this.timeOut = setTimeout(() => {
          this.detailsComp.sentScrollXY();
        }, 50);
      },
      error: err => {
        console.log(err);
      }
    }))
  }
  // Store current scroll position before opening details window

  setScrollXY(id: string): void {
    this.scrollX = window.scrollX;
    this.scrollY = window.scrollY;
    this.getSpecialProduct(id);
  }
  // Toggle the visibility of the details window

  closeWindowDetails(value: boolean): void {
    this.isOpenWindowDetails = value;
  }
  // Sort products based on selected type (price or title)
  sortProducts(type: string) {
    this.filteredProducts = this.filteredProducts.sort((a, b) => {
      return type === "asc" ? a.price - b.price : type === "desc" ? b.price - a.price : type === "a-z" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });
  }
  // Extract selected value from <select> element
  getNameOption(value: any): string {
    return value.target.value;
  }
  // Fetch all products from backend and initialize filters and default sorting
  private getProducts(): void {
    this.closeApi.push(this.productsService.getAllProducts().subscribe({
      next: res => {
        this.product = res.data;
        this.filteredProducts = this.product.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        this.categories = [...new Set(this.product.map(p => p.category.name))];
        this.brands = [...new Set(this.product.map(p => p.brand.name))];
        this.isLoading = false;
        this.isFakeLoading = false;
      },
      error: err => {
        console.log(err);
        this.isLoading = false;
        this.isFakeLoading = false;
      }
    }))
  }
  // Filter products by brand, category, and search text
  private applyFilters(): void {
    this.filteredProducts = this.product.filter(p => {
      const matchBrand = this.selectedBrands.size === 0 || this.selectedBrands.has(p.brand.name);
      const matchSearch = this.search.trim() === '' || p.title.toLowerCase().includes(this.search.toLowerCase());
      const matchCategory = this.selectCategory.size === 0 || this.selectCategory.has(p.category.name)
      console.log(p.category.name);
      return matchBrand && matchSearch && matchCategory;
    });
  }
}
