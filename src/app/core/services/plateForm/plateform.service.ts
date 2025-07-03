import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlateformService {
  pLATFORM_ID = inject(PLATFORM_ID);

  checkPlateform(): boolean {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      return true;
    }
    return false;
  }
}
