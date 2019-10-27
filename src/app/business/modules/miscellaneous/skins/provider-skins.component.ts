import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-skins',
  templateUrl: './provider-skins.component.html'
})
export class ProviderSkinsComponent implements OnInit {
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  breadcrumbs = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      url: '/provider/settings/miscellaneous',
      title: 'Miscellaneous'
    },
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
