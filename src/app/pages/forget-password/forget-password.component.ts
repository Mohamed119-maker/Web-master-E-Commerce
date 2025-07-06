import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  private authService = inject(AuthService);
  router = inject(Router);
  step: number = 1;
  loading: boolean = false;
  msgEmailSucess: string = '';
  msgEmailError: string = '';
  msgCodeSucssess: string = '';
  msgCodeError: string = '';
  msgRepassSucess: string = '';
  msgRepassError: string = '';

  verifyEmailForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\w{6}$/),
    ]),
  });

  newPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]\w{5,}$/),
    ]),
  });

  setEmailVerify(): void {
    if (this.verifyEmailForm.valid) {
      this.loading = true;
      let emailValue = this.verifyEmailForm.get('email')?.value;
      this.newPasswordForm.get('email')?.patchValue(emailValue);

      this.authService.verifyEmail(this.verifyEmailForm.value).subscribe({
        next: (res) => {
          if (res.statusMsg === 'success') {
            this.msgEmailSucess = res.message;
            this.loading = false;
            this.msgEmailError = '';
            setTimeout(() => {
              this.step = 2;
            }, 700);
          }
        },
        error: (err) => {
          this.msgEmailError = err.error.message;
          this.loading = false;
        },
      });
    }
  }

  setCodeVerify(): void {
    if (this.verifyCodeForm.valid) {
      this.loading = true;
      this.authService.verifyCode(this.verifyCodeForm.value).subscribe({
        next: (res) => {
          if (res.status === 'Success') {
            this.msgCodeSucssess = res.status;
            this.loading = false;
            this.msgCodeError = '';

            setTimeout(() => {
              this.step = 3;
            }, 700);
          }
        },
        error: (err) => {
          this.msgCodeError = err.error.message;
          this.loading = false;
          console.log(this.msgCodeError);
        },
      });
    }
  }

  setRepassword(): void {
    if (this.newPasswordForm.valid) {
      this.loading = true;
      this.authService.resetPassword(this.newPasswordForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('userToken', res.token);
          this.authService.saveUserData();
          this.msgRepassSucess = 'Success';
          this.msgRepassError = '';

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 700);
          this.loading = false;
        },
        error: (err) => {
          this.msgRepassError = err.error.message;
          this.loading = false;
          console.log(err);
        },
      });
    }
  }
}
