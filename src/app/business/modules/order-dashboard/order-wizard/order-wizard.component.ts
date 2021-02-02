import { Component, OnInit } from '@angular/core';
 import '../../../../../assets/js/pages/custom/wizard/wizard-1.js';
 import '../../../../../assets/js/scripts.bundle.js';


@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css']
})
export class OrderWizardComponent implements OnInit {
  constructor() { }

  ngOnInit() {}

}
