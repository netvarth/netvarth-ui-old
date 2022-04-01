import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  carouselTwo;
  customer_label:any;
  constructor(private _scrollToService: ScrollToService,
    private titleService: Title,
    private metaService: Meta, 
    private wordProcessor: WordProcessor,) { }

  ngOnInit() {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.titleService.setTitle('Jaldee Business - About');
    this.metaService.addTags([
      { name: 'description', content: 'www.jaldee.com is a web portal connecting service providers with customers. Jaldee is an all India platform listing thousands of doctors/professionals/technicians and all service areas including healthcare, homecare, personal care and legal/financial care. The motto of Jaldee is \"seamless connectivity of service providers/business enterprises with potential customers.\" Elimination of queues, wiping out unproductive & boring waiting times, is the motivation & aim of Jaldee.' }
    ]);
    setTimeout(() => {
      this.handleScroll('prov_home_n');
    }, 100);
  }
  handleScroll(target) {
    this.triggerScrollTo(target);
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
}
