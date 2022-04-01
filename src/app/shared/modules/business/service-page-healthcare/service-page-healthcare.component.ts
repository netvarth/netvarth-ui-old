import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-service-page-healthcare',
  templateUrl: './service-page-healthcare.component.html',
  styleUrls: ['./service-page-healthcare.component.css']
})
export class ServicePageHealthcareComponent implements OnInit, OnDestroy {
  customer_label:any;
  constructor(
    private _scrollToService: ScrollToService,
    private routerobj: Router,
    private wordProcessor: WordProcessor,

  ) { }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    const a = document.getElementById("fb-root");
    if (a) {
      a.classList.add('visible_chat');
    }

  }
  ngOnDestroy() {
    const a = document.getElementById("fb-root");
    if (a) {
      a.classList.remove('visible_chat');
    }
  }
  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination,
      duration: 150,
      easing: 'easeOutElastic',
      offset: 0
    };
    this._scrollToService.scrollTo(config);
  }
  providerLinkClicked() {
    this.routerobj.navigate(['/business']);
  }
}
