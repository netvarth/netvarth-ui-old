import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-basic-profile',
  templateUrl: './basic-profile.component.html',
  styleUrls: ['./basic-profile.component.css']
})
export class BasicProfileComponent implements OnInit {
  
  @Input() businessProfile;
  @Input() templateJson;
  @Input() selectedLocation;
  @Output() actionPerformed = new EventEmitter<any>();
  emailId: any;
  phoneNo: any;
  location: any;
  

  constructor() { }

  ngOnInit(): void {
    if (this.businessProfile.emails) {
      this.emailId = this.businessProfile.emails[0];
    }
    if (this.businessProfile.phoneNumbers) {
      this.phoneNo = this.businessProfile.phoneNumbers[0];
    }
    if (this.businessProfile.baseLocation.place) {
      this.location = this.businessProfile.baseLocation.place;      
    }    
  }

  goHome() {
    this.actionPerformed.emit('about');
  }

}
