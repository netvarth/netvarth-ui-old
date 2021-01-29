import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumerJoinComponent } from '../../../../../src/app/ynw_consumer/components/consumer-join/join.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../services/group-storage.service';
@Component({
  selector: 'app-jaldee-video',
  templateUrl: './jaldee-video.component.html'
})
export class JaldeeVideoComponent implements OnInit {
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
  constructor(
    public sharedFunctionobj: SharedFunctions,
    private shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    public router: Router,
    private groupService: GroupStorageService,
    public date_format: DateFormatPipe
  ) {
    this.activated_route.params.subscribe(
      qparams => {
        if (qparams.phonenumber !== 'new') {
          this.phoneNumber = qparams.phonenumber;
          this.phone = this.phoneNumber.slice(2)
        }
      });
  }
  ngOnInit() {
    const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (activeUser) {
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
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        this.getVideo();
      } else if (result === 'showsignup') {
      }
    });
  }
  getVideo() {
      this.countrycode = '91';
    this.shared_services.getVideoList(this.countrycode, this.phone)
      .subscribe(data => {
        this.videoList = data;
        this.videoList.forEach(video_details => {
          this.videoCall = video_details;
          this.uuid = this.videoCall.uid;
          const id = this.videoCall.virtualService.VideoCall;
          this.confirmId = id.slice(id.length - 12);
          this.groupVideoList = this.shared_functions.groupBy(this.videoList, 'appmtDate');
          this.meetingList = [];
          Object.keys(this.groupVideoList).forEach(key => {
            const videosList = this.groupVideoList[key];
            const appmtDate = this.groupVideoList[key][0]['appmtDate'];
              const meetingsList = {
                videosList: videosList,
                apptDate: appmtDate,
              };
              this.meetingList.push(meetingsList);
          });
        });
        this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
  }
  startVideo() {
    this.router.navigate(['meeting' , this.phoneNumber , this.videoCall.uid ]);
  }
  showMeetingDetails(data){
    this.showMeetngDetails = false;
    this.apptTime = data.apptTakenTime;
    this.appmtDate = data.appmtDate;
    this.serviceName = data.service.name;
    this.businessName = data.providerAccount.businessName;
    this.description = data.service.description;
  }
}

