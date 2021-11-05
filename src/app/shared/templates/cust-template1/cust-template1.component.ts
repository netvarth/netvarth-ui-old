import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-cust-template1',
  templateUrl: './cust-template1.component.html',
  styleUrls: ['./cust-template1.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustTemplate1Component implements OnInit {

  @Input() templateJson;
  form: any;
  public loader = false;
  public publishvarible = false;
  public imagearray = ['../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg'];
  public imagearray1 = ['../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg'];
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware'];
  public data: any = []
  constructor() {
  }
  customOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items:3
      }
    },
    nav: true
  };
  ngOnInit(): void {
    console.log(this.templateJson);
    this.data = this.templateJson;
    this.loader = true;
  }
}
