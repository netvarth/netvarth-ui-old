import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { PricingContentDialog } from '../pricing-content-dialog/pricing-content-dialog.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PricingComponent implements OnInit {
  carouselOne;
  carouselTwo;

  constructor(private _scrollToService: ScrollToService,
    private titleService: Title,
    private metaService: Meta,
    public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.carouselOne = {
      nav: true,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      dots: false,
      loop: false,
      autoplay: false,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          center: false
        },
        500: {
          items: 2,
          center: false
        },
        700: {
          items: 3,
          center: false
        },
        992: {
          items: 4,
          center: false,
        },
        1300: {
          items: 5,
          center: false,
        }
      }
    };
    this.carouselTwo = {
      nav: true,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      dots: false,
      loop: false,
      autoplay: false,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          center: false
        },
        500: {
          items: 2,
          center: false
        },
        700: {
          items: 3,
          center: false
        },
        992: {
          items: 4,
          center: false,
        },
        1300: {
          items: 5,
          center: false,
        }
      }
    };
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
    openDialog(partName, type) {
      const dialogRef = this.dialog.open(PricingContentDialog, {
        data: {
          part: partName,
          type: type
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
  }
}
