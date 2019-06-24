import { Component } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: ' '
})

export class LogoutComponent {
  constructor(private shared_functions: SharedFunctions, private router: Router) {
    shared_functions.logout();
    router.navigate(['/home']);
  }
}

