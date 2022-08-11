import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-profile',
  templateUrl: './advanced-profile.component.html',
  styleUrls: ['./advanced-profile.component.css']
})
export class AdvancedProfileComponent implements OnInit {

  @Input() businessProfile;
  @Input() templateJson;
  @Input() selectedLocation;
  emailId: any;
  phoneNo: any;
  location: any;
  bLogo:any;
  businessDesc: any;
  specialities: any;
  constructor() { }

  ngOnInit(): void {
    console.log("bprofile",this.templateJson)
    if (this.businessProfile.logo) {
      this.bLogo = this.businessProfile.logo.url;
    }
    if (this.businessProfile.emails) {
      this.emailId = this.businessProfile.emails[0];
    }
    if (this.businessProfile.phoneNumbers) {
      this.phoneNo = this.businessProfile.phoneNumbers[0];
    }
    if (this.businessProfile.baseLocation.place) {
      this.location = this.businessProfile.baseLocation.place;      
    } 
    if (this.businessProfile.businessDesc) {
      this.businessDesc = this.businessProfile.businessDesc;
    }   
    if (this.businessProfile.specialization) {
        this.specialities = this.businessProfile.specialization;
    }
  }

}
