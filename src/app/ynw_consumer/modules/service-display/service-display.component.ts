import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-display',
  templateUrl: './service-display.component.html',
  styleUrls: ['./service-display.component.css']
})
export class ServiceDisplayComponent implements OnInit {

  @Input() mode;
  @Input() virtualModes;
  @Input() service;
  @Input() showVirtualInfo;

  showmoreSpec = false;
  readMore = false;

  constructor() { }

  ngOnInit(): void {
    console.log("Service Details:", this.service);
  }

  showSpec() {
    if (this.showmoreSpec) {
      this.showmoreSpec = false;
    } else {
      this.showmoreSpec = true;
    }
  }

  showText() {
    this.readMore = !this.readMore;
  }

}
