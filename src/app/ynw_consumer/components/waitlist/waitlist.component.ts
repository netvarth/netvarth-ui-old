import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { projectConstants } from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-consumer-waitlist',
  templateUrl: './waitlist.component.html'
})
export class WaitlistComponent implements OnInit {

  waitlist_detail;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;

  public searchfields: SearchFields = new SearchFields();

  constructor( private consumer_services: ConsumerServices,
    private consumer_datastorage: ConsumerDataStorageService,
  private router: Router,
  private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data
    .subscribe((data) => {
      this.waitlist_detail = data.waitlist_detail;
    });

  }
}
