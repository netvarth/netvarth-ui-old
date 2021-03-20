import { Component } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
  selector: 'app-logout',
  template: ' '
})

export class LogoutComponent {
  constructor(private shared_functions: SharedFunctions) {
    this.shared_functions.logout();
    // this.router.navigate(['/home']);
  }
}

