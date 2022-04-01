import { Component, OnInit } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute } from '@angular/router';
import { WordProcessor } from '../../../shared/services/word-processor.service';

@Component({
  selector: 'app-privacy-static',
  templateUrl: './privacy-static.component.html'
})
export class PrivacyStaticComponent implements OnInit {

  kwdet: any = [];
  api_error = null;
  domain;
  showheaderandfooter = false;
  customer_label:any;
  constructor(
    private activaterouterobj: ActivatedRoute,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
  ) {
  }

  ngOnInit() {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.activaterouterobj.paramMap
      .subscribe(params => {
        const passid = params.get('id');
        if (passid) {
          if (passid === 'mobile') {
            this.showheaderandfooter = false;
          } else {
            this.showheaderandfooter = true;
          }
        } else {
          this.showheaderandfooter = true;
        }
      });
  }
}
