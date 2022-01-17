import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { S3UrlProcessor } from '../../../shared/services/s3-url-processor.service';
import { CustomappService } from '../../customapp.service';


@Component({
  selector: 'app-cust-template4',
  templateUrl: './cust-template4.component.html',
  styleUrls: ['./cust-template4.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustTemplate4Component implements OnInit {

  templateJson: any;
  locationjson: any;
  showDepartments: any;
  terminologiesjson: any;
  apptSettings: any;
  businessProfile: any;
  donationServices: any;
  selectedLocation: any;


  // @Input() templateJson;
  // userId;
  // pSource;
  // loading = true;

  constructor(
    private customappService: CustomappService,
    private s3Processor: S3UrlProcessor
  ) {

  }

  ngOnInit(): void {
    this.templateJson = this.customappService.getTemplateJson();
    this.donationServices = this.s3Processor.getJson(this.customappService.getDonationServices());
    this.locationjson = this.s3Processor.getJson(this.customappService.getLocations());
    this.selectedLocation = this.locationjson[0];
    this.showDepartments = this.s3Processor.getJson(this.customappService.getAccountSettings()).filterByDept;
    console.log("Template Json:", this.showDepartments);
    this.terminologiesjson = this.s3Processor.getJson(this.customappService.getTerminologies());
    this.apptSettings = this.s3Processor.getJson(this.customappService.getApptSettings());
    this.businessProfile = this.s3Processor.getJson(this.customappService.getBusinessProfile());
  }
}
