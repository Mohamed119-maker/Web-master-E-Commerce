import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  authService = inject(AuthService);

  msgEmailExist: string = '';

  loading: boolean = false;

  router = inject(Router);

  msgSuccess: string = '';

  shwoPass: boolean = true;

  changeType() {
    this.shwoPass = !this.shwoPass;
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Z]\w{5,}$/),
    ]),
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.sendLoginForm(this.loginForm.value).subscribe({
        next: (res) => {
          localStorage.setItem('userToken', res.token);
          this.authService.saveUserData();
          console.log(localStorage.getItem('userToken'));

          this.msgSuccess = res.message;
          this.msgEmailExist = '';

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 500);

          this.loading = false;
        },
        error: (err) => {
          this.msgEmailExist = err.error.message;
          this.loading = false;
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    return password === rePassword ? null : { mismatch: true };
  }
}
