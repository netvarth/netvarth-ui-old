import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-online-users',
  templateUrl: './online-users.component.html',
  styleUrls: ['./online-users.component.css']
})
export class OnlineUsersComponent implements OnInit {
  
  @Input() selectedLocation;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() users;
  @Input() businessProfile;

  constructor(private router: Router) {
    console.log(this.businessProfile);
   }

  ngOnInit(): void {
    
  }

  cardClicked(actionObj) {
    console.log(actionObj['userId']);
    this.providerDetClicked(actionObj['userId']);
  }
  
  providerDetClicked(userId) {
    let queryParams = {};
    if(this.templateJson['theme']) {
      queryParams['theme'] = this.templateJson['theme'];
    }
    const navigationExtras: NavigationExtras = {
      queryParams: queryParams
    };
    this.router.navigate([this.businessProfile.accEncUid, userId], navigationExtras);
  }
}
