import { Component, Input, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
    selector: 'app-finance-learnmore',
    templateUrl: './finance.component.html'
})
export class FinanceComponent implements OnInit {
  @Input() target: string;
  breadcrumbs = [
    {
      title: 'Help'
    }
  ];
  // here..
  activePrice = '';
  // here code
  active_user;
  parent;
  child;
  profilesearch = true;
  checkinmanager = true;
  license = true;
  billing = true;
  miscellaneous = true;
  displayboard = true;
  homeservice = true;
  showpublic = false;
  showverified = false;
  showprofilesearch = false;
  showbasicinfrmtion = false;
  showadword = false;
  showspecialization = false;
  showlanguagesknown = false;
  showprivacysettings = false;
  showadditionalinfo = false;
  showsocialmedia = false;
  showgallery = false;
  showbilling = false;
  showpayment = false;
  showtax = false;
  showitem = false;
  showcoupon = false;
  showdiscount = false;
  showmiscellaneous = false;
  shownonworking = false;
  shownotifications = false;
  showcheckinmanager = false;
  showlocations = false;
  showservices = false;
  showtime = false;
  showdepartment = false;
  showlicense = false;
  showupgrade = false;
  showaddon = false;
  showadwords = false;
  showcustom = false;
  showonlineid = false;
  showdashboard = false;
  showdashbord = false;
  showcustomer = false;
  showdownpanel = false;
  showdisplayboard = false;
  showlabel = false;
  showboard = false;
  showlayout = false;
  showhomeservice = false;
  showserviceH = false;
  showhoursH = false;
  showjdn = false;
  showsaleschannel = false;
  showthemes = false;
  showgeneral = false;
  showlivetrackstatus = false;
  showcustomview = false;
  showpaymentsettings = false;
  showpayments = false;
  showappointments = false;
  showappointment = false;
  showschedules = false;
  showdonations = false;
  showdonation = false;
  showcauses = false;
  showjaldeeintegrations = false;
  showonlinepresence = false;
  showjaldeeintegration = false;
  showcustomers = false;
  showcustomersid = false;
  showvirtualcallingmodes = false;
  showvirtualcallingmode = false;
  showvideocallmode = false;
  domain;
  show = 'false';
  showdbappointments = false;
  showcheckin = false;
  showinbox = false;
  showhistory = false;
  showdbdonations = false;
  showcheckins = false;
  showdelay = false;
  showlocation = false;
  showlocationAmenities = false;
  constructor(
    private activated_route: ActivatedRoute,
    private shared_functions: SharedFunctions,
    private _location: Location,
    private _scrollToService: ScrollToService,
  ) { }

  setActivePricing(item) {
    this.activePrice = item;
  }

  ngOnInit() {
   this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = this.active_user.sector;
    if (this.target) {
      // this.triggerScrollTo(this.target);
    }
    this.activated_route.paramMap
      .subscribe(params => {
        if (params.get('parent')) {
          const group = params.get('parent').split('->');
          this.parent = group[0];
          if (group.length > 1) {
            this.child = group[1];
          } else {
            this.child = this.parent;
          }
        } else {
          this.child = 'public-search';
          this.parent = 'jaldeeonline';
        }
        this.handleScroll(this.child, this.parent);
      });
  }
  goBack() {
    this._location.back();
  }
  scroll() {
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
  handleScroll(childContent, parentContent) {
    this.child = childContent;
    this.parent = parentContent;
    this.menu(parentContent, childContent);
  }
  menu(parentContent, childContent?) {
    if (parentContent === 'jaldeeonline') {
      this.showprofilesearch = true;
      if (childContent === 'public-search') {
        this.showpublic = true;
      }
      if (childContent === 'verified-levels') {
        this.showverified = true;
      }
      if (childContent === 'adwords') {
        this.showadword = true;
      }
      if (childContent === 'basic-information') {
        this.showbasicinfrmtion = true;
      }
      if (childContent === 'location') {
        this.showlocation = true;
      }
      if (childContent === 'locationAmenities') {
        this.showlocationAmenities = true;
      }
      if (childContent === 'specializations') {
        this.showspecialization = true;
      }
      if (childContent === 'custom-id') {
        this.showcustom = true;
      }
      if (childContent === 'online-id') {
        this.showonlineid = true;
      }
      if (childContent === 'languages-known') {
        this.showlanguagesknown = true;
      }
      if (childContent === 'privacy-settings') {
        this.showprivacysettings = true;
      }
      if (childContent === 'additional-info') {
        this.showadditionalinfo = true;
      }
      if (childContent === 'your-social-media') {
        this.showsocialmedia = true;
      }
      if (childContent === 'photo-gallery') {
        this.showgallery = true;
      }
    }

    if(parentContent === 'general'){
      this.showgeneral = true;
      if(childContent === 'locations'){
        this.showlocations = true;
      }
      if (childContent === 'departments') {
        this.showdepartment = true;
      }
      if (childContent === 'livetracking') {
        this.showlivetrackstatus = true;
      }
      if (childContent === 'customview') {
        this.showcustomview = true;
      }
      if (childContent === 'nonworking') {
        this.shownonworking = true;
      }
      if (childContent === 'labels') {
        this.showlabel = true;
      }
      if (childContent === 'themes') {
        this.showthemes = true;
      }
    }

    if (parentContent === 'q-manager') {
      this.showcheckinmanager = true;
      if (childContent === 'settings-services') {
        this.showservices = true;
      }
      if (childContent === 'settings-time_windows') {
        this.showtime = true;
      }
     if (childContent === 'settings-q-boards') {
        this.showdisplayboard = true;
      }
    } 

    if (parentContent === 'appointmentmanager') {
      this.showappointments = true;
      if (childContent === 'accept-appointments') {
        this.showappointment = true;
      }
      if (childContent === 'services') {
        this.showservices = true;
      }
      if (childContent === 'schedules') {
        this.showschedules= true;
      }
      if (childContent === 'q-boards') {
        this.showdisplayboard= true;
      }
    }
    
    if (parentContent === 'payments') {
      this.showpayments = true;
      if (childContent === 'jaldee-pay') {
        this.showpayment = true;
      }
      if (childContent === 'payment-settings') {
        this.showpaymentsettings = true;
      }
      if (childContent === 'tax-settings') {
        this.showtax = true;
      }
    }
    if (parentContent === 'billing') {
      this.showbilling = true;
     
      if (childContent === 'items') {
        this.showitem = true;
      }
      if (childContent === 'coupon') {
        this.showcoupon = true;
      }
      if (childContent === 'discount') {
        this.showdiscount = true;
      }
    }

    if (parentContent === 'donationmanager') {
      this.showdonations = true;
      if (childContent === 'accept-donations') {
        this.showdonation = true;
      }
      if (childContent === 'causes') {
        this.showcauses = true;
      }
    }

    if (parentContent === 'miscellaneous') {
      this.showmiscellaneous = true;
     if (childContent === 'notifications') {
        this.shownotifications = true;
      }
       if (childContent === 'jdn') {
        this.showjdn = true;
      }
      if (childContent === 'saleschannel') {
        this.showsaleschannel = true;
      }
    }  

    if (parentContent === 'jaldee-integration') {
      this.showjaldeeintegrations = true;
      if (childContent === 'onlinepresence') {
        this.showonlinepresence = true;
      }
      if (childContent === 'jaldee-app-integration') {
        this.showjaldeeintegration  = true;
      }
    }

    if (parentContent === 'customers') {
      this.showcustomers = true;
      if (childContent === 'custid-settings') {
        this.showcustomersid = true;
      }
    }
    
    if (parentContent === 'comm') {
      this.showvirtualcallingmodes = true;
      if (childContent === 'virtualcallingmode') {
        this.showvirtualcallingmode = true;
      }
      if (childContent === 'videocall-settings') {
        this.showvideocallmode  = true;
      }
    }
    
    if (parentContent === 'license') {
      this.showlicense = true;
      if (childContent === 'upgradelicense') {
        this.showupgrade = true;
      }
      if (childContent === 'history') {
        this.showhistory = true;
      }
      if (childContent === 'addon') {
        this.showaddon = true;
      }
      if (childContent === 'adwords') {
        this.showadwords = true;
      }
    }
    if (parentContent === 'dashboard-home') {
      this.showdashboard = true;
      if (childContent === 'dashboard-home') {
        this.showdashbord = true;
      }
     }
    
     if (parentContent === 'appointments' && childContent === 'appointments') {
      this.showdbappointments = true;
   }
   if (parentContent === 'donations' && childContent === 'donations') {
    this.showdbdonations = true;
 }
    
 if (parentContent === 'check-ins'){
  this.showcheckins = true;
  if (childContent === 'check-in') {
    this.showcheckin = true;
  }
  if (childContent === 'adjustdelay') {
    this.showdelay = true;
  }

}  
    if (parentContent === 'customer' && childContent === 'customer') {
        this.showcustomer = true;
    }

    if (parentContent === 'inbox' && childContent === 'inbox') {
      this.showinbox = true;
   }
   
    if (parentContent === 'downpanel' && childContent === 'downpanel') {
      this.showdownpanel = true;
  }
 
 if (parentContent === 'homeservice')
{
  this.showhomeservice = true;
  if(childContent === 'serviceH')
  {this.showserviceH = true;}
  if(childContent === 'hourH')
  {this.showhoursH = true;}
}

  }
}

