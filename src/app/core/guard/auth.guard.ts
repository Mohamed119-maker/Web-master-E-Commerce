import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlateformService } from '../services/plateForm/plateform.service';

export const authGuard: CanActivateFn = (route, state) => {
  let rourter = inject(Router);

  let plateForm = inject(PlateformService);
  if (plateForm.checkPlateform()) {
    if (localStorage.getItem('userToken') != null) {
      return true;
    }
  }
  rourter.navigate(['/sign-in']);
  return false;
};
