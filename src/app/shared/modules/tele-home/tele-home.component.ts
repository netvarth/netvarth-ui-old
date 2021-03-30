import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../app.component';
import { DateFormatPipe } from '../../pipes/date-format/date-format.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../services/group-storage.service';
import { Title } from '@angular/platform-browser';
import { TeleBookingService } from '../../services/tele-bookings-service';
@Component({
  selector: 'app-tele-home',
  templateUrl: './tele-home.component.html',
  styleUrls: ['./tele-home.component.css']
})
export class TeleHomeComponent implements OnInit {
  path = projectConstants.PATH;
  elementType = 'url';
  qr_value: string;
  load_complete = 0;
  api_loading = true;
  newDateFormat = projectConstants.DATE_MM_DD_YY_FORMAT;
  videoList: any = [];
  phoneNumber;
  videoCall: any;
  phone: any;
  uuid: any;
  groupVideoList;
  meetingList: any = [];
  video: any;
  confirmId: any;
  videoId: any;
  showMeetngDetails: boolean;
  apptTime: any;
  appmtDate: any;
  serviceName: any;
  businessName: any;
  description: any;
  countrycode: string;
  isLoggedIn: boolean;
  gBookings: any;
  selectedBooking: any;
  
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private teleService: TeleBookingService,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public router: Router,
    private groupService: GroupStorageService,
    public date_format: DateFormatPipe,
    private titleService: Title
  ) {
    this.titleService.setTitle('Jaldee - Meetings');
    this.activated_route.params.subscribe(
      qparams => {
        if (qparams.phonenumber !== 'new') {
          this.phoneNumber = qparams.phonenumber;
          this.phone = this.phoneNumber.slice(2)
        }
      });
  }
  ngOnInit() {
    this.isLoggedIn = false;
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
      this.isLoggedIn = true;
      this.getVideo();
    }
    else {
      this.doLogin('consumer');
    }
    this.showMeetngDetails = true;
  }
  doLogin(origin?, passParam?) {
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.isLoggedIn = true;
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        this.getVideo();
      } else if (result === 'showsignup') {
      }
    });
  }

  /**
   * 
   */
  getAvailableMeetings() {

  }

  
  generateQR() {
    this.qr_value = this.path + 'status/' + this.selectedBooking.encId;
  }

  /**
   * 
   */
  getVideo() {
    this.countrycode = '91';
    this.teleService.getAvailableBookings(this.countrycode, this.phone)
      .then((bookings: any) => {

        


        console.log(bookings);
        if (bookings.length > 0) {                    
          this.gBookings = this.shared_functions.groupBy(bookings, 'bookingDate');
          Object.keys(this.gBookings).forEach(key => {
            this.selectedBooking = this.gBookings[key][0];
            this.generateQR();
            return false;
          });          
        }
        


        // this.videoList = data;
        // this.videoList.forEach(video_details => {
        //   this.videoCall = video_details;
        //   this.uuid = this.videoCall.uid;
        //   const id = this.videoCall.virtualService.VideoCall;
        //   this.confirmId = id.slice(id.length - 12);
        //   this.groupVideoList = this.shared_functions.groupBy(this.videoList, 'appmtDate');
        //   // this.meetingList = [];
        //   Object.keys(this.groupVideoList).forEach(key => {
        //     const videosList = this.groupVideoList[key];
        //     const appmtDate = this.groupVideoList[key][0]['appmtDate'];
        //       const meetingsList = {
        //         videosList: videosList,
        //         apptDate: appmtDate,
        //       };
        //       this.meetingList.push(meetingsList);
        //   });
        // });
        // this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
  }

  /**
   * 
   */
  startVideo() {
    this.router.navigate(['meeting' , this.phoneNumber , this.videoCall.uid ]);
  }

  /**
   * 
   * @param data 
   */
  showMeetingDetails(booking){
    this.selectedBooking = booking;
    this.generateQR();
    // this.showMeetngDetails = false;
    // this.apptTime = booking.apptTime;
    // this.appmtDate = booking.appmtDate;
    // this.serviceName = booking.service;
    // this.businessName = booking.provider;
    // this.description = booking.description;
  }

  

  joinJaldeeVideo(booking) {
    console.log(this.countrycode+""+this.phone);

    this.router.navigate(['meeting' , this.countrycode+""+this.phone , booking.id]);
  }
}

