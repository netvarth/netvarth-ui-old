import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-booking-stats',
  templateUrl: './booking-stats.component.html',
  styleUrls: ['./booking-stats.component.css']
})
export class BookingStatsComponent implements OnInit {
  customer_label = '';
  @Input() newApptsCount;
  @Input() newWitlistCount;
  @Input() waitlistMgrSettings;
  @Input() ordersCount;
  @Input() donationsCount;
  @Input() customer_count;
  @Input() admin;
  providerId;
  carouselOne = {
    dots: false,
    nav: true,
    navContainer: '.checkins-nav',
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>'
    ],
    autoplay: false,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    loop: false,
    autoWidth: true
  };
  settings;
  userData;
  constructor(private wordProcessor: WordProcessor,
    private router: Router,
    private groupService: GroupStorageService,
    private activated_route: ActivatedRoute) {
    this.activated_route.params.subscribe(params => {
      if (params.userid) {
        this.providerId = params.userid;
      }
    });
  }

  ngOnInit(): void {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.settings = this.groupService.getitemFromGroupStorage('settings');
    this.userData = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log('admin', this.admin)
  }
  gotoView(type) {
    if (type === 'appt') {
      this.router.navigate(['provider', 'bookings', 'appointments'], { queryParams: { providerId: this.providerId } });
    } else if (type === 'checkin') {
      this.router.navigate(['provider', 'bookings', 'checkins'], { queryParams: { providerId: this.providerId } });
    } else if (type === 'order') {
      this.router.navigate(['provider', 'orders']);
    } else if (type === 'donation') {
      this.router.navigate(['provider', 'donations']);
    } else if (type === 'customer') {
      this.router.navigate(['provider', 'customers']);
    }
  }
}
