import { Routes } from '@angular/router';
import { RedirectComponent } from './pages/redirect/redirect/redirect.component';
import { authGuard } from './core/guard/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthLayoutComponent } from './layouts/components/auth-layout/auth-layout.component';
import { SignInComponent } from './pages/auth/pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth/pages/sign-up/sign-up.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    title: 'Home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'Home',
  },

  // {
  //   path: '',
  //   pathMatch: 'full',
  //   resolve: [RedirectComponent],
  // },

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
    path: 'shop',
    loadComponent: () =>
      import('./pages/shop/shop/shop.component').then((m) => m.ShopComponent),
    title: 'Shop',
  },
  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog/blog.component').then((m) => m.BlogComponent),
    title: 'Blog',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact/contact.component').then(
        (m) => m.ContactComponent
      ),
    title: 'Contact',
  },
  {
    path: 'aboutus',
    loadComponent: () =>
      import('./pages/aboutus/aboutus/aboutus.component').then(
        (m) => m.AboutusComponent
      ),
    title: 'About Us',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent),
    title: 'Cart',
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
  },
  { path: '**', component: NotFoundComponent, title: 'page not found' },
];
