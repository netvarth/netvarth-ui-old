import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { Messages} from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-checkin-location-list',
  templateUrl: './checkin-location-list.component.html'
})

export class CheckinLocationListComponent implements OnInit {

  api_error = null;
  api_success = null;
  location_list: any = [] ;
  selected_location = null;

  constructor(
    public dialogRef: MatDialogRef<CheckinLocationListComponent>,
    public shared_functions: SharedFunctions,
    private router: Router, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data.location_list) {
        this.location_list = data.location_list || [];
      } else {
        this.dialogRef.close();
      }
    }

  ngOnInit() {
  }

  locationSelect() {
    console.log(this.selected_location);
  }

}
