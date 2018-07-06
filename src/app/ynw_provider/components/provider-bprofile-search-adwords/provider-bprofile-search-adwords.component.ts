import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
export class ProviderBprofileSearchAdwordsComponent implements OnInit, OnChanges {

    @Input() reloadadwordapi;

    adword_list: any = [] ;
    adwordsmaxcount: any = 0;
    remaining_adword = 0;

    query_executed = false;
    emptyMsg = this.sharedfunctionObj.getProjectMesssages('ADWORD_LISTEMPTY');
    constructor( private provider_servicesobj: ProviderServices,
        private router: Router, private dialog: MatDialog,
        private sharedfunctionObj: SharedFunctions) {}

    ngOnInit() {
        this.getTotalAllowedAdwordsCnt();
    }

    ngOnChanges() {
      this.getTotalAllowedAdwordsCnt();
    }

    getTotalAllowedAdwordsCnt() {
      this.provider_servicesobj.getTotalAllowedAdwordsCnt()
        .subscribe ((data: any) => {

          this.adwordsmaxcount = data;
          this.getAdwords();
        });
    }

    getAdwords() {
        this.provider_servicesobj.getAdwords()
        .subscribe(data => {
            this.adword_list = data;
            this.remaining_adword = this.adwordsmaxcount - this.adword_list.length;
            this.query_executed = true;
        });
    }
    addAdwords() {
      if (this.remaining_adword > 0) {
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
      } else {
        this.sharedfunctionObj.openSnackBar(Messages.ADWORD_EXCEED_LIMIT,  {'panelClass': 'snackbarerror'});
      }

    }
    doRemoveAdwords(adword) {
        const id = adword.id;
        if (!id) {
          return false;
        }
        const dialogRef = this.dialog.open(ConfirmBoxComponent, {
          width: '50%',
          panelClass : ['commonpopupmainclass', 'confirmationmainclass'],
          data: {
            'message' : this.sharedfunctionObj.getProjectMesssages('ADWORD_DELETE').replace('[adword]', '"' + adword.name + '"')
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
            this.sharedfunctionObj.openSnackBar(Messages.ADWORD_DELETE_SUCCESS);
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, {'panelClass': 'snackbarerror'});
          }
        );
      }
}
