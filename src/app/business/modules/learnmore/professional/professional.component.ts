//import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Component, Input, OnChanges,OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { ActivatedRoute } from '@angular/router';
import { Location, CommonModule } from '@angular/common'; 

@Component({
    selector: 'app-professional-learnmore',
    templateUrl : './professional.component.html'
})

export class ProfessionalCareComponent implements OnChanges {
     //code
     @Input() target: string;
     breadcrumbs = [
       {
         title: 'Help'
       }
     ];
     activePrice = '';
     active_user;
     parent;
     child;
     profilesearch = true;
     checkinmanager = true;
     license = true;
     billing = true;
     miscellaneous = true;
     showprofile = false;
     showcheckinmanager = false;
     showlicense = false;
     showbill = false;
     showmiscellaneous = false;
     domain;
     show = 'false';
     constructor(
       private activated_route: ActivatedRoute,
       private shared_functions: SharedFunctions,
       private _location: Location,
       private _scrollToService: ScrollToService,
     ) { }
     ngOnChanges() {
       // this.parentContent = this.parent;
       // this.childContent = this.child;
     }
     setActivePricing(item) {
       this.activePrice = item;
     }
     //here code change
     ngOnInit() {
       this.active_user = this.shared_functions.getitemfromLocalStorage('ynw-user');
       this.domain = this.active_user.sector;
       console.log(this.domain);
       if (this.target) {
         // this.triggerScrollTo(this.target);
       }
       this.activated_route.paramMap
         .subscribe(params => {
           if (params.get('parent')) {
             const group = params.get('parent').split('->');
             this.parent = group[0];
             console.log(this.parent);
             if (group.length > 1) {
               this.child = group[1];
             } else {
               this.child = this.parent;
             }
           } else {
             this.child = 'public-search';
             this.parent = 'profile-search';
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
       // console.log('child...........'+childContent);
       // console.log('parent......'+parentContent);
       this.child = childContent;
       this.parent = parentContent;
       this.menu(parentContent);
     }
     menu(parentContent) {
       if (parentContent === 'profile-search') {
         this.showprofile = true;
         this.showcheckinmanager = false;
         this.showlicense = false;
         this.showbill = false;
         this.showmiscellaneous = false;
       }
       if (parentContent === 'checkinmanager') {
         this.showprofile = false;
         this.showcheckinmanager = true;
         this.showlicense = false;
         this.showbill = false;
         this.showmiscellaneous = false;
       }
       if (parentContent === 'license') {
         this.showlicense = true;
         this.showprofile = false;
         this.showcheckinmanager = false;
         this.showbill = false;
         this.showmiscellaneous = false;
       }
       if (parentContent === 'billing') {
         this.showbill = true;
         this.showlicense = false;
         this.showprofile = false;
         this.showcheckinmanager = false;
         this.showmiscellaneous = false;
       }
       if (parentContent === 'miscellaneous') {
         this.showbill = false;
         this.showlicense = false;
         this.showprofile = false;
         this.showcheckinmanager = false;
         this.showmiscellaneous = true;
       }
     }
     //here..
   }
   