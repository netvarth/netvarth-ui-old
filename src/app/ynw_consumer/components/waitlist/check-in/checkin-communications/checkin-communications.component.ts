import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkin-communications',
  templateUrl: './checkin-communications.component.html',
  styleUrls: ['./checkin-communications.component.css']
})
export class CheckinCommunicationsComponent implements OnInit {

  @Input() selectedService;
  @Input() parentCustomer;
  @Input() selectedMember;
  @Output() setCommunications = new EventEmitter<any>(); 
  @Input() commObj;
  emailerror = null;
  whatsapperror = '';
  phoneError = '';

  constructor() { }

  ngOnInit(): void {
    console.log("In ngInit")
    console.log(this.commObj);
  }

  /**
   * Set Fields to communication object and pass it to Root 
   */
  setCommFields() {
    console.log(this.commObj);
    this.setCommunications.emit(this.commObj);
  }

  isNumericSign(evt) {
    const inputKeyCode = evt.keyCode ? evt.keyCode : evt.which;
    if ((inputKeyCode >= 48 && inputKeyCode <= 57) || inputKeyCode === 8 || inputKeyCode === 46 || inputKeyCode === 43) {
      return true;
    } else {
      evt.preventDefault();
      return false;
    }
  }
}
