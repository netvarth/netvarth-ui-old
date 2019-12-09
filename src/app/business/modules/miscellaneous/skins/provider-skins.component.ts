import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-skins',
  templateUrl: './provider-skins.component.html'
})
export class ProviderSkinsComponent implements OnInit {
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  breadcrumb_moreoptions: any = [];
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
  domain: any;
  constructor(private shared_functions: SharedFunctions,
    private routerobj: Router, ) {
  }
  ngOnInit() {
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
  }
  skinSelected(skin) {
    this.shared_functions.sendMessage({ ttype: 'skin', selectedSkin: skin });
  }
  performActions() {
    this.routerobj.navigate(['/provider/' + this.domain + '/miscellaneous->themes']);
  }
}
