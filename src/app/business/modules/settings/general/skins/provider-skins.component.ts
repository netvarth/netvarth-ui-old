import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

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
      url: '/provider/settings/general',
      title: Messages.GENERALSETTINGS
    },
    {
      title: 'Themes'
    }
  ];
  domain: any;
  constructor(private shared_functions: SharedFunctions,
    private routerobj: Router,
    private groupService: GroupStorageService ) {
  }
  ngOnInit() {
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
  }
  skinSelected(skin) {
    this.shared_functions.sendMessage({ ttype: 'skin', selectedSkin: skin });
  }
  performActions() {
    this.routerobj.navigate(['/provider/' + this.domain + '/general->themes']);
  }
  redirecToGeneral() {
    this.routerobj.navigate(['provider', 'settings' , 'general']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/general->themes']);
  }
}
