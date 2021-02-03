import { Component, OnInit } from '@angular/core';
// import '../../../../../assets/js/commonscript.js';
// import '../../../../../assets/plugins/global/plugins.bundle.js';
// import '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.js';
// import '../../../../../assets/js/scripts.bundle.js';
// import '../../../../../assets/js/pages/custom/wizard/wizard-1.js';

@Component({
  selector: 'app-order-wizard',
  templateUrl: './order-wizard.component.html',
  styleUrls: ['./order-wizard.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css']
})
export class OrderWizardComponent implements OnInit {
  step = 1;
  constructor() { }

  ngOnInit() {}

  gotoNext() {
    this.step = this.step + 1;
  }
  gotoPrev() {
    this.step = this.step - 1;
  }

 }
