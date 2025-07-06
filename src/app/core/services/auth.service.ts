import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { environment } from '../../shared/environments';
import { PlateformService } from './plateForm/plateform.service';
import { IUser } from '../../shared/interfaces/iuser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }
  plateformService = inject(PlateformService)

  userData: WritableSignal<IUser> = signal({} as IUser);
  userName: WritableSignal<string> = signal('');

  router = inject(Router);

  sendRegisterForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signup`,
      data
    );
  }

  sendLoginForm(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/signin`,
      data
    );
  }

  saveUserData(): void {
    this.userData = jwtDecode(
      JSON.stringify(localStorage.getItem('userToken'))
    );
    this.userName.set(this.userData.name.charAt(0).toUpperCase())
    console.log(this.userName());
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You Will Logout',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('wishlist');
        this.userName.set('');
        this.router.navigate(['/sign-in']);
      }
    });
  }

  verifyEmail(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/forgotPasswords`,
      data
    );
  }

  verifyCode(data: object): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/api/v1/auth/verifyResetCode`,
      data
    );
  }

  resetPassword(data: object): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/api/v1/auth/resetPassword`,
      data
    );
  }
  getTokenUser(): string {
    return localStorage.getItem("userToken") || '';
  }
}
