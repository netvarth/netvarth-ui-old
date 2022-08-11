import { Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { ProviderServices } from '../../services/provider-services.service';
import { CrmService } from './crm.service';
import { NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../../src/app/shared/services/group-storage.service';
@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css']
})
export class CRMComponent implements OnInit {
  crmTitle = '';
  isadminPrivilege: any;
  public step: any;
  public panelOpenState: boolean=false;
  public redirectionList: any = []
  public api_loading: boolean;
  public bLosFieldOpen: boolean = true;
  public bREportsFieldOpen: boolean = false;
  showActivity = true;
  bBorderBottomTYpeA: boolean = false;
  bBorderBottomTypeC: boolean = false;
  followUpList:any=[];
  lebalNameLOS:string='LOS';
  lebalnameREPORT:string='REPORTS';
  lebalMarkrtingActivity:string='Marketing Activity';
  lebalScheduleMarkActivity:string='Schedule Marketing Activity';
  lebalMarketingActivityUpdation:string='Marketing Activity Updation';
  lebalEnquiry:string='Enquiry';
  lebalFollowUps:string='Follow Ups';
  reportType:any=[
    {
      id: 1, type: 'Activity Report',
    },
    {
      id: 2, type: 'Lead Report'
    },
    {
      id: 3, type: 'Enquiry Report'
    }, 
    {
      id: 4, type: 'Activity Consolidated Report'
    }, 
    {
      id: 5, type: 'Lead Status Report'
    },
    {
      id:6, type: 'Processing Files Report'
    },
    {
      id:7, type: 'Consolidated Report'
    },
    {
      id:8, type: 'Tat Report'
    },
    {
      id:9, type: 'Recommended Status Report'
    },
    {
      id:10, type: 'Login Report'
    },
    {
      id:11, type: 'HO Leads Status Report'
    },
    {
      id:12, type: 'Sanctioned Status Report'
    },
    {
      id:13, type: 'Employee Average Tat Report'
    },
    {
      id:14, type: 'Daily Activity Report'
    }
  ]
  constructor(
    private providerServices: ProviderServices,
    private router: Router,
    private groupService: GroupStorageService,
    private locationobj: Location,
    private wordProcessor: WordProcessor,
    private crmService: CrmService
  ) {
  }

  initCRM() {
    if (this.wordProcessor.getSPTerminologyTerm('CRM')) {
      this.crmTitle = this.wordProcessor.getSPTerminologyTerm('CRM');
    } else {
      this.crmTitle = 'CRM';
    }
  }
  ngOnInit(): void {
    this.api_loading = true;
    this.userInfo();
    this.followUpsList();
    if ((this.providerServices && this.providerServices.reportToCrm) === 'FromReport') {
      this.fnChangeBorder('C');
      this.providerServices.reportToCrm = '';
    }
    else {
      this.fnChangeBorder('A')
    }
    const _this = this;
    _this.providerServices.getBussinessProfile().subscribe(
      (bProfile: any) => {
        _this.crmService.getSPTerminologies(bProfile.uniqueId).then(
          (terminology: any) => {
            _this.wordProcessor.setSPTerminologies(terminology);
            _this.initCRM();
          }
        )
      }
    )
  }
  dashBoardStatus(user){
    const _this=this;
    return new Promise((resolve,reject)=>{
      _this.crmService.getLeadStatusDashboard().subscribe((res)=>{
        if(res){
          resolve(res);
          _this.redirectionList.push(res);
          // if(user && user.userType === 1 && user.isadminPrivilege){
          //   this.accordingUserRedirection(user);
          // }
        }
      },((error)=>{
        reject(error);
      }))
    })
  }
  followUpsList(){
    const _this=this;
    return new Promise((resolve,reject)=>{
      _this.crmService.enquiryStatusdashBoard().subscribe((res)=>{
        resolve(res)
        console.log(res);
        this.followUpList=res;
      }),
      ((error)=>{
        reject(error);
      })
    })
  }
  fromReportToCrm() {
    if (this.providerServices && this.providerServices.reportToCrm) {
      this.fnChangeBorder('C')
    }
    this.providerServices.reportToCrm = ''
  }
  accordingUserRedirection(user){
    if((user && (user.userType === 1)) && user.isadminPrivilege){
    }
    else if(user && user.userType === 2){
    }
    else if(user.userType === 1){
      this.redirectionList[0].forEach((item)=>{
        if(item && item.aliasName){
          if(item.aliasName==='CRIF' ||item.aliasName==='Login Verification' || item.aliasName==='Credit Recommendation' 
          || item.aliasName==='Loan Sanction' || item.aliasName==='Loan Disbursement' || item.aliasName==='Loan Created' ){
            this.redirectionList[0].splice(this.redirectionList[0].indexOf(item), 1);
          }
        }
      })
    }
    else{
      this.redirectionList[0].forEach((item)=>{
        if(item && item.aliasName==='CRIF'){
          this.redirectionList[0].splice(this.redirectionList[0].indexOf(item), 1);
        }
      })

    }
  }
  userInfo() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (user && user.userType === 2) {
      this.showActivity = false;
      this.dashBoardStatus(user)
      // this.redirectionList = [
      //   {
      //     id: 7,
      //     activityName: 'Leads'
      //   },
      //   {
      //     id: 4,
      //     activityName: 'CRIF'
      //   },
      //   {
      //     id: 5,
      //     activityName: 'Sales Verification'
      //   },
      //   {
      //     id: 6,
      //     activityName: 'Login'
      //   },
      //   {
      //     id: 3,
      //     activityName: 'Login Verification'
      //   },
      //   {
      //     id: 8,
      //     activityName: 'Credit Recommendation'
      //   },
      //   {
      //     id: 9,
      //     activityName: 'Loan Sanction'
      //   },
      //   {
      //     id: 10,
      //     activityName: 'Loan Disbursement'
      //   },
      //   {
      //     id: 11,
      //     activityName: 'Rejected'
      //   }
      // ]
    }
    else if (user && user.userType === 1 && user.adminPrivilege) {
      this.showActivity = false;
      this.dashBoardStatus(user)
      // this.redirectionList = [
      //   {
      //     id: 7,
      //     activityName: 'Leads'
      //   },
      //   {
      //     id: 4,
      //     activityName: 'CRIF'
      //   },
      //   {
      //     id: 5,
      //     activityName: 'Sales Verification'
      //   },
      //   {
      //     id: 6,
      //     activityName: 'Login'
      //   },
      //   {
      //     id: 3,
      //     activityName: 'Login Verification'
      //   },

      //   {
      //     id: 8,
      //     activityName: 'Credit Recommendation'
      //   },
      //   {
      //     id: 9,
      //     activityName: 'Loan Sanction'
      //   },
      //   {
      //     id: 10,
      //     activityName: 'Loan Disbursement'
      //   },
      //   {
      //     id: 11,
      //     activityName: 'Rejected'
      //   }
      // ]
    }
    else if (user && user.userType === 1) {
      this.showActivity = true;
      this.dashBoardStatus(user)
      // this.redirectionList = [
      //   {
      //     id: 7,
      //     activityName: 'Leads'
      //   },
      //   {
      //     id: 5,
      //     activityName: 'Sales Verification'
      //   },
      //   {
      //     id: 6,
      //     activityName: 'Login'
      //   },
      //   {
      //     id: 11,
      //     activityName: 'Rejected'
      //   }
      // ]
    }
    else {
      this.showActivity = true;
      this.dashBoardStatus(user)
      // this.redirectionList = [
      //   {
      //     id: 7,
      //     activityName: 'Leads'
      //   },

      //   {
      //     id: 5,
      //     activityName: 'Sales Verification'
      //   },
      //   {
      //     id: 6,
      //     activityName: 'Login'
      //   },
      //   {
      //     id: 3,
      //     activityName: 'Login Verification'
      //   },

      //   {
      //     id: 8,
      //     activityName: 'Credit Recommendation'
      //   },
      //   {
      //     id: 9,
      //     activityName: 'Loan Sanction'
      //   },
      //   {
      //     id: 10,
      //     activityName: 'Loan Disbursement'
      //   },
      //   {
      //     id: 11,
      //     activityName: 'Rejected'
      //   }
      // ]
    }
  }
  goback() {
    this.locationobj.back();
  }
  templateViewActivity(data) {
    console.log(data);
    if(data && data.name && data.name==='Follow Up 1'){
      const navigationExtras: NavigationExtras = {
            queryParams: {
              type: data.name,
              id:data.id,
              name:data.name
            }
          }
          this.router.navigate(['provider', 'followupone'], navigationExtras)
    }
    else if(data && data.name && data.name==='Follow Up 2'){
      const navigationExtras: NavigationExtras = {
            queryParams: {
              type: data.name,
              id:data.id,
              name:data.name
            }
          }
          this.router.navigate(['provider', 'followupone'], navigationExtras)
    }
    else if(data && data.name && data.name==='Rejected'){
      return false;
      const navigationExtras: NavigationExtras = {
            queryParams: {
              type:data.name,
              id:data.id,
              name:data.name
            }
          }
          this.router.navigate(['provider', 'followupone'], navigationExtras)
    }
    else if(data && data.name && data.name==='Completed'){
      return false;
      const navigationExtras: NavigationExtras = {
            queryParams: {
              type: data.name,
              id:data.id,
              name:data.name
            }
          }
          this.router.navigate(['provider', 'followupone'], navigationExtras)
    }
    

  }
  redirectionTaskTemplate() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'activityCreateTemplate'
      }
    }
    if(navigationExtras){
      this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras);
    }
    
  }
  redirectionTaskActivityList() {
    this.router.navigate(['provider', 'task']);
  }
  redirectionToEnquiry() {
    this.router.navigate(['provider', 'CreateEnquiry']);
  }
  redirectionSeperateTemplate(templateName: any,templateData) {
    if (templateName && templateName === 'Login Verification') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'LOGIN',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
          dataStatus:templateData.name,
          templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'CRIF') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'CRIF',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Sales Field Verification') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'SALESVERIFICATION',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Login') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'DOCUMENTUPLOD',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Leads') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'NEWLEAD',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Credit Recommendation') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'CreditRecommendation',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Loan Sanction') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'LoanSanction',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Loan Disbursement') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'LoanDisbursement',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
    else if (templateName && templateName === 'Rejected') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'Rejected',
          dataUrl:templateData.dataUrl,
          dataId:templateData.id,
           dataStatus:templateData.name,
           templateName:templateName,
        }
      }
      if(navigationExtras){
        this.router.navigate(['provider', 'lead'], navigationExtras);
      }
    }
  }
  buttonClicked(type) {
    switch (type) {
      case 'LOS':
        this.router.navigate(['provider', 'crm', 'leads']);
        break;
      case 'CREATETASK':
        const navigationExtras: NavigationExtras = {
          queryParams: {
            type: 'leadCreateTemplate'
          }
        }
        if(navigationExtras){
          this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras);
        }
    }
  }
  templateUpdation(textValue) { }
  fnChangeBorder(boxId) {
    if (boxId === 'A') {
      this.api_loading = true;
      this.api_loading = false;
      this.bBorderBottomTYpeA = true;
      this.bLosFieldOpen = true;
      this.bREportsFieldOpen = false;
      this.bBorderBottomTypeC = false;
    }
    else if (boxId === 'C') {
      this.api_loading = true;
      this.api_loading = false;
      this.bBorderBottomTypeC = true;
      this.bREportsFieldOpen = true;
      this.bLosFieldOpen = false;
      this.bBorderBottomTYpeA = false;
    }
  }
  reportActionType(data){
    if(data){
      switch (data.type) {
        case 'Activity Report':
          const navigationExtras: NavigationExtras = {
            queryParams: {
              report_type: 'crm'
            }
          }
          if(navigationExtras){
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
          }
          break;
        case 'Lead Report':
          const navigationExtrasToLead: NavigationExtras = {
            queryParams: {
              report_type: 'lead'
            }
          }
          if(navigationExtrasToLead){
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToLead);
          }
          break;
        case 'Enquiry Report':
          const navigationExtrasToEnquiry: NavigationExtras = {
            queryParams: {
              report_type: 'enquiry'
            }
          }
          if(navigationExtrasToEnquiry){
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToEnquiry);
          }
         
          break;
        case 'Activity Consolidated Report':
          const navigationExtrasToMonthly: NavigationExtras = {
            queryParams: {
              report_type: 'monthlyActivity'
            }
          }
          if(navigationExtrasToMonthly){
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToMonthly);
          }
          break;
        case 'Lead Status Report':
          const navigationExtrasToLeadStatus: NavigationExtras = {
            queryParams: {
              report_type: 'leadStatus'
            }
          }
          if(navigationExtrasToLeadStatus){
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToLeadStatus);
          }
          break;
          case 'Processing Files Report':
            const navigationExtrasToProcessingFiles: NavigationExtras = {
              queryParams: {
                report_type: 'processingFiles'
              }
            }
            if(navigationExtrasToProcessingFiles){
            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToProcessingFiles);
            }
            break;
            case 'Consolidated Report':
              const navigationExtrasToConsolidated: NavigationExtras = {
                queryParams: {
                  report_type: 'consolidated'
                }
              }
              if(navigationExtrasToConsolidated){
                this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToConsolidated);
              }
              break;
              case 'Tat Report':
                const navigationExtrasToTat: NavigationExtras = {
                  queryParams: {
                    report_type: 'tat'
                  }
                }
                if(navigationExtrasToTat){
                  this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToTat);
                }
                break;
                case 'Recommended Status Report':
                  const navigationExtrasToRecommendedStatus: NavigationExtras = {
                    queryParams: {
                      report_type: 'recommendedStatus'
                    }
                  }
                  if(navigationExtrasToRecommendedStatus){
                    this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToRecommendedStatus);
                  }
                  break;
                  case 'Login Report':
                    const navigationExtrasToLogin: NavigationExtras = {
                      queryParams: {
                        report_type: 'login'
                      }
                    }
                    if(navigationExtrasToLogin){
                      this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToLogin);
                    }
                    break;
                    case 'HO Leads Status Report':
                      const navigationExtrasToHOLeads: NavigationExtras = {
                        queryParams: {
                          report_type: 'HOLead'
                        }
                      }
                      if(navigationExtrasToHOLeads){
                        this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToHOLeads);
                      }
                      break;
                      case 'Sanctioned Status Report':
                        const navigationExtrasToSanctioned: NavigationExtras = {
                          queryParams: {
                            report_type: 'sanctionedStatus'
                          }
                        }
                        if(navigationExtrasToSanctioned){
                          this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToSanctioned);
                        }
                        break;
                        case 'Employee Average Tat Report':
                          const navigationExtrasToEmployeeAverage: NavigationExtras = {
                            queryParams: {
                              report_type: 'employeeAverageTat'
                            }
                          }
                          if(navigationExtrasToEmployeeAverage){
                            this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToEmployeeAverage);
                          }
                          break;
                          case 'Daily Activity Report':
                            const navigationExtrasToDailyActivity: NavigationExtras = {
                              queryParams: {
                                report_type: 'dailyActivity'
                              }
                            }
                            if(navigationExtrasToDailyActivity){
                              this.router.navigate(['provider', 'reports', 'new-report'], navigationExtrasToDailyActivity);
                            }
                            break;
      }
    }
  }
  getImage(data){
    if(data){
      let imgSrc:any;
      switch (data.type) {
        case 'Activity Report':
          imgSrc = './assets/images/crmImages/craeteActivity.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Lead Report':
          imgSrc = './assets/images/crmImages/leadReporterMob.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Enquiry Report':
          imgSrc = './assets/images/crmImages/inquiry.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Activity Consolidated Report':
          imgSrc = './assets/images/crmImages/consolidation.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
        case 'Lead Status Report':
          imgSrc = './assets/images/crmImages/leadStatus.png';
          if (imgSrc) {
            return imgSrc;
          }
          break;
          case 'Processing Files Report':
            imgSrc = './assets/images/crmImages/fileProcessing.png';
            if (imgSrc) {
              return imgSrc;
            }
            break;
            case 'Consolidated Report':
              imgSrc = './assets/images/crmImages/consolidated.jfif';
              if (imgSrc) {
                return imgSrc;
              }
              break;
              case 'Tat Report':
                imgSrc = './assets/images/crmImages/otherTemplate.png';
                if (imgSrc) {
                  return imgSrc;
                }
                break;
                case 'Recommended Status Report':
                  imgSrc = './assets/images/crmImages/otherTemplate.png';
                  if (imgSrc) {
                    return imgSrc;
                  }
                  break;
                  case 'Login Report':
                    imgSrc = './assets/images/crmImages/loginReport.png';
                    if (imgSrc) {
                      return imgSrc;
                    }
                    break;
                    case 'HO Leads Status Report':
                      imgSrc = './assets/images/crmImages/leadStatus.png';
                      if (imgSrc) {
                        return imgSrc;
                      }
                      break;
                      case 'Sanctioned Status Report':
                        imgSrc = './assets/images/crmImages/otherTemplate.png';
                        if (imgSrc) {
                          return imgSrc;
                        }
                        break;
                        case 'Employee Average Tat Report':
                          imgSrc = './assets/images/crmImages/otherTemplate.png';
                          if (imgSrc) {
                            return imgSrc;
                          }
                          break;
                          case 'Daily Activity Report':
                            imgSrc = './assets/images/crmImages/otherTemplate.png';
                            if (imgSrc) {
                              return imgSrc;
                            }
                            break;
      }
    }
  }
}