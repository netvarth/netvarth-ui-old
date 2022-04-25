import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.css']
})
export class CommunicationsComponent implements OnInit {

  @Input() selectedService;
  @Output() setCommunications = new EventEmitter<any>(); 
  @Input() commObj;
  @Input() mode;
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
