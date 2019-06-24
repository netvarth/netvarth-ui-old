import { Component } from '@angular/core';
import { SharedFunctions } from '../shared/functions/shared-functions';

@Component({
  selector: 'app-consumer',
  templateUrl: './consumer.component.html'
})
export class ConsumerComponent {
  // title = 'consumer';
  constructor(public shared_functions: SharedFunctions) {
    this.shared_functions.sendMessage({ttype: 'main_loading', action: false});
  }
}
