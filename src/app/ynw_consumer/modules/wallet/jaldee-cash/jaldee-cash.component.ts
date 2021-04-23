import { Component, OnInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SubSink } from '../../../../../../node_modules/subsink';


@Component({
  selector: 'app-jaldee-cash',
  templateUrl: './jaldee-cash.component.html',
  styleUrls: ['./jaldee-cash.component.css']
})
export class JaldeeCashComponent implements OnInit {
  private subs = new SubSink();
  screenWidth: number;
  small_device_display: boolean;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  constructor(private location: Location,
    public shared_functions: SharedFunctions) { }

  ngOnInit(): void {
  //  this.cashInfo();
  }
  cashInfo() {
    throw new Error("Method not implemented.");
  }
  goBack () {
    this.location.back();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
