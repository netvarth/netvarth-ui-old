import { animate, keyframes, query, stagger, style, transition, trigger } from "@angular/animations";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { S3UrlProcessor } from "../../../shared/services/s3-url-processor.service";
import { CustomappService } from "../../customapp.service";

@Component({
  selector: 'app-cust-template1',
  templateUrl: './cust-template1.component.html',
  styleUrls: ['./cust-template1.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('search_data', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('10ms', [
          animate('.4s ease-out', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
          ]))]), { optional: true })
      ])
    ])
  ]
})
export class CustTemplate1Component implements OnInit{
  templateJson: any;
  locationjson: any;
  showDepartments: any;
  terminologiesjson: any;
  apptSettings: any;
  businessProfile: any;

  constructor (
    private customappService: CustomappService,
    private s3Processor: S3UrlProcessor
  ) {

  }
  ngOnInit(): void {
      this.templateJson = this.customappService.getTemplateJson();
      
      this.locationjson = this.s3Processor.getJson(this.customappService.getLocations());
      this.showDepartments = this.s3Processor.getJson(this.customappService.getAccountSettings()).filterByDept;
      console.log("Template Json:", this.showDepartments);
      this.terminologiesjson = this.s3Processor.getJson(this.customappService.getTerminologies());
      this.apptSettings = this.s3Processor.getJson(this.customappService.getApptSettings());
      this.businessProfile = this.s3Processor.getJson(this.customappService.getBusinessProfile());
      console.log("Business Profile:",this.businessProfile);
      console.log("Template Json:", this.templateJson);
  }

  // changeLocation(loc, type?) {
  //   this.selectedLocation = loc;
  //   this.generateServicesAndDoctorsForLocation(this.provider_id, this.selectedLocation.id);
  // }
}