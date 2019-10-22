import { Component, OnInit } from '@angular/core';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-provider-skins',
  templateUrl: './provider-skins.component.html'
})
export class ProviderSkinsComponent implements OnInit {
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  breadcrumbs = [
    {
      title: 'Skins'
    }
  ];
  constructor(private shared_functions: SharedFunctions) {
  }
  ngOnInit() {

  }
  skinSelected(skin) {
    this.shared_functions.sendMessage({ ttype: 'skin', selectedSkin: skin });
  }
}
