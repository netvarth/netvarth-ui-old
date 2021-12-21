import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cust-template4',
  templateUrl: './cust-template4.component.html',
  styleUrls: ['./cust-template4.component.css']
})
export class CustTemplate4Component implements OnInit {
  
  @Input() templateJson;
  userId;
  pSource;
  
  constructor(private locationobj: Location) { }

  ngOnInit(): void {
  }

  goBack() {
    this.locationobj.back();
    this.userId = null;
    this.pSource = null;
  }
}
