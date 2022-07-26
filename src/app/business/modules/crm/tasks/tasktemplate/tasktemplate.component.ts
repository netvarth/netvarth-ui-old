import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormMessageDisplayService } from '../../../../../shared/modules/form-message-display/form-message-display.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CrmService } from '../../crm.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';
@Component({
  selector: 'app-tasktemplate',
  templateUrl: './tasktemplate.component.html',
  styleUrls: ['./tasktemplate.component.css']
})
export class TasktemplateComponent implements OnInit {
  public taskMasterList: any = [];
  public taskMasterListData: any;
  public newTask: any;
  public type: any;
  api_loading_Sel_Template: boolean;
  src: any;
  activityHeader:string='Schedule Marketing Activity';
  activityType:string='Select type of activity';
  baRequirement:string='BA Recruitment';
  baFollowUp:string='BA FollowUp';
  constructor(
    private locationobj: Location,
    private router: Router,
    private activated_route: ActivatedRoute,
    private crmService: CrmService,
    public fed_service: FormMessageDisplayService,
    private groupService: GroupStorageService
  ) {}
  ngOnInit(): void {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(user)
    this.activated_route.queryParams.subscribe(qparams => {
      console.log('qparams', qparams)
      if (qparams && qparams.type) {
        this.type = qparams.type;
      }
      if (qparams && qparams.src) {
        this.src = qparams.src;
      }
    });
    if (this.type === 'activityCreateTemplate') {
      this.getTaskmaster();
    }
    else {
      this.router.navigate(['provider', 'settings']);
    }
  }
  goback() {
    this.locationobj.back();
  }
  getTaskmaster() {
    const _this = this;
    return new Promise((resolve, reject) => {
      _this.api_loading_Sel_Template = true;
      _this.crmService.getTaskMasterList().subscribe((response: any) => {
        console.log('response',response);
        if(response){
          _this.api_loading_Sel_Template = false;
          _this.taskMasterList.push(response);
          // _this.getImage(response)
        }
      })
    })
  }
  saveTaskMaster(taskMasterValue) {
    if (taskMasterValue !== undefined) {
      this.crmService.taskActivityName = 'Create';
      this.crmService.taskMasterToCreateServiceData = taskMasterValue;
      if (this.src == 'updateactivity') {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            src: 'updateactivity'
          }
        }
        this.router.navigate(['provider', 'task', 'create-task'], navigationExtras)
      }
      else {
        this.router.navigate(['provider', 'task', 'create-task'])
      }

    }
    else {
      this.router.navigate(['provider', 'task'])
    }
  }
  createTask(createText: any) {
    console.log('createText', createText)
    this.crmService.taskActivityName = createText;
    this.newTask = createText;
    if (createText !== undefined) {
      this.router.navigate(['provider', 'task', 'create-task'])
    }
    else {
      this.router.navigate(['provider', 'task'])
    }

  }
  getImage(data: any) {
    if (data) {
      let imgSrc: any;
      switch (data.templateName) {
        case 'Direct Notice Distribution':
          imgSrc = './assets/images/crmImages/tempateImg/homeVisit.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Notice Distribution Through Newspaper':
          imgSrc = './assets/images/crmImages/tempateImg/noticeThroughDist.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Kiosk/Umbrella Activity and Data Collection':
          imgSrc = './assets/images/crmImages/tempateImg/kisok.png';
          if (imgSrc) {
            return imgSrc;
          }
          break
        case 'Poster Activity':
          imgSrc = './assets/images/crmImages/tempateImg/posterActivity.png';
          if (imgSrc) {
            return imgSrc
          }
          break;
        case 'Telecalling':
          imgSrc = './assets/images/crmImages/tempateImg/telecaing.png';
          if (imgSrc) {
            return imgSrc
          }
          break;
        case 'Digital Marketing':
          imgSrc = './assets/images/crmImages/tempateImg/digitaMarketing.png';
          if (imgSrc) {
            return imgSrc
          }
          break;
        case 'Home Visit':
          imgSrc = './assets/images/crmImages/tempateImg/directNoticeDistribution.png';
          if (imgSrc) {
            return imgSrc
          }
          break;
        case 'BA Follow Up':
          imgSrc = './assets/images/crmImages/tempateImg/Folloup1.png';
          if (imgSrc) {
            return imgSrc
          }
          break;
        case 'BA Recruitment':
          imgSrc = './assets/images/crmImages/tempateImg/Folloup2.png';
          if (imgSrc) {
            return imgSrc
          }
          break;
          // default 
      }
      // if(data.templateName==='Direct Notice Distribution'){
      //   const imgSrc='./assets/images/crmImages/tempateImg/homeVisit.png'
      //   return imgSrc
      // }
      // if(data.templateName==='Notice Distribution Through Newspaper'){
      //   const imgSrc='./assets/images/crmImages/tempateImg/homeVisit.png'
      //   return imgSrc
      // }
    }
  }
}