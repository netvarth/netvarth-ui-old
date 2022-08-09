import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-advanced-profile',
  templateUrl: './advanced-profile.component.html',
  styleUrls: ['./advanced-profile.component.css']
})
export class AdvancedProfileComponent implements OnInit {

  @Input() businessProfile;
  @Input() templateJson;

  constructor() { }

  ngOnInit(): void {
  }

}
