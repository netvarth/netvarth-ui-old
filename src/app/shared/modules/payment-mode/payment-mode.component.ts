import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.css']
})
export class PaymentModeComponent implements OnInit {

  @Input() paymentProfile;
  // @Output() modeSelected = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  getImageSrc(mode) {
    return 'assets/images/payment-modes/' + mode + '.png';
  }

  // paymentModeSelected(event) {
  //   this.modeSelected.emit(event);
  // }
  
  getPayTMmodesByGroup(indiamodes) {
   // console.log(indiamodes)
    const groupedGateway = indiamodes.reduce(function (r, a) {
        r[a.gateway] = r[a.gateway] || [];
        r[a.gateway].push(a);
        return r;
    }, {});
    return groupedGateway;
}
}
