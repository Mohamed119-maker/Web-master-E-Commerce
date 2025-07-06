import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { AuthLayoutComponent } from './layouts/components/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/components/main-layout/main-layout.component';
import { SignInComponent } from './pages/auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth/pages/sign-up/sign-up.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    title: 'Home',
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        title: 'Login',
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        title: 'Register',
      },
      {
        path: 'forgetpassword',
        component: ForgetPasswordComponent,
        title: 'Forget Password',
      },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
        canActivate: [authGuard],
      },
      {
        path: 'shop',
        loadComponent: () =>
          import('./pages/shop/shop/shop.component').then((m) => m.ShopComponent),
        title: 'Shop',
        canActivate: [authGuard],
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/blog/blog/blog.component').then((m) => m.BlogComponent),
        title: 'Blog',
        canActivate: [authGuard],
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./pages/contact/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
        title: 'Contact',
        canActivate: [authGuard],
      },
      {
        path: 'aboutus',
        loadComponent: () =>
          import('./pages/aboutus/aboutus/aboutus.component').then(
            (m) => m.AboutusComponent
          ),
        title: 'About Us',
        canActivate: [authGuard],
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./pages/cart/cart.component').then((m) => m.CartComponent),
        title: 'Cart',
        canActivate: [authGuard],
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
        title: 'Checkout',
        canActivate: [authGuard],
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./pages/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent
          ),
        title: 'Wishlist',
        canActivate: [authGuard],
      },
      {
        path: 'product-details',
        loadComponent: () =>
          import(
            './pages/product-details/product-details/product-details.component'
          ).then((m) => m.ProductDetailsComponent),
        title: 'Product Details',
        canActivate: [authGuard],
      },
      { path: '**', component: NotFoundComponent, title: 'page not found' },
    ]
  },






];
