import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-success-display',
  templateUrl: './form-success-display.component.html',
  styleUrls: ['./form-success-display.component.css']
})
export class FormSuccessDisplayComponent {

  @Input() successMsg: string;
  @Input() displayMsg: boolean;

}

