import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { AddProviderBprofileSearchAdwordsComponent } from '../add-provider-bprofile-search-adwords/add-provider-bprofile-search-adwords.component';
import {Messages} from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-bprofile-search-adwords',
  templateUrl: './provider-bprofile-search-adwords.component.html',
  styleUrls: ['./provider-bprofile-search-adwords.component.css']
})
export class ProviderBprofileSearchAdwordsComponent implements OnInit {
    adword_list: any = [] ;
    query_executed = false;
    emptyMsg = Messages.ADWORD_LISTEMPTY;
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
        this.getAdwords();
    }
    getAdwords() {
        this.provider_servicesobj.getAdwords()
        .subscribe(data => {
            this.adword_list = data;
            this.query_executed = true;
        });
    }
    addAdwords() {
        const dialogRef = this.dialog.open(AddProviderBprofileSearchAdwordsComponent, {
          width: '50%',
          data: {
            type : 'add'
          },
          panelClass: ['commonpopupmainclass']
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
            this.getAdwords();
          }
        });
    }
    doRemoveAdwords(adword) {
        const id = adword.id;
        if (!id) {
          return false;
        }
        const dialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          data: {
            'message' : Messages.ADWORD_DELETE.replace('[adword]', '"' + adword.name + '"')
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.deleteAdwords(id);
          }
        });
      }
      deleteAdwords(id) {
        this.provider_servicesobj.deleteAdwords(id)
        .subscribe(
          data => {
            this.getAdwords();
          },
          error => {

          }
        );
      }
}
