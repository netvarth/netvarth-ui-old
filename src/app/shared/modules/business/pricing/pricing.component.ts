import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {

  constructor(private _scrollToService: ScrollToService,
    private titleService: Title,
    private metaService: Meta,
    ) { }

  ngOnInit() {
    this.titleService.setTitle('Jaldee Business - Pricing');
    this.metaService.addTags([
      { name: 'description', content: 'All first time users get a FREE 30-day Jaldee Premium plan (worth Rs.1499)' }
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
