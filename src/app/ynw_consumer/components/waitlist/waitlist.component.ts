import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';


@Component({
  selector: 'app-consumer-waitlist',
  templateUrl: './waitlist.component.html'
})
export class WaitlistComponent implements OnInit {

  waitlist_detail;
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
