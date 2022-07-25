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
  followUpList:any=[]
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
    this.followUpsList()
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
  userInfo() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(user)
    this.isadminPrivilege = user.adminPrivilege;
    if (user.userType === 2) {
      this.showActivity = false;
      this.redirectionList = [
        {
          id: 7,
          activityName: 'Leads'
        },
        {
          id: 4,
          activityName: 'CRIF'
        },
        {
          id: 5,
          activityName: 'Sales Verification'
        },
        {
          id: 6,
          activityName: 'Login'
        },
        {
          id: 3,
          activityName: 'Login Verification'
        },

        {
          id: 8,
          activityName: 'Credit Recommendation'
        },
        {
          id: 9,
          activityName: 'Loan Sanction'
        },
        {
          id: 10,
          activityName: 'Loan Disbursement'
        },
        // {
        //   id: 11,
        //   activityName: 'Redirect'
        // },
        {
          id: 11,
          activityName: 'Rejected'
        }
      ]
    }
    else if (user.userType === 1 && this.isadminPrivilege) {
      this.showActivity = false;
      this.redirectionList = [
        {
          id: 7,
          activityName: 'Leads'
        },
        {
          id: 4,
          activityName: 'CRIF'
        },
        {
          id: 5,
          activityName: 'Sales Verification'
        },
        {
          id: 6,
          activityName: 'Login'
        },
        {
          id: 3,
          activityName: 'Login Verification'
        },

        {
          id: 8,
          activityName: 'Credit Recommendation'
        },
        {
          id: 9,
          activityName: 'Loan Sanction'
        },
        {
          id: 10,
          activityName: 'Loan Disbursement'
        },
        // {
        //   id: 11,
        //   activityName: 'Redirect'
        // },
        {
          id: 11,
          activityName: 'Rejected'
        }
      ]
    }
    else if (user.userType === 1) {
      this.showActivity = true;
      this.redirectionList = [
        {
          id: 7,
          activityName: 'Leads'
        },
        // {
        //   id: 4,
        //   activityName: 'CRIF'
        // },
        {
          id: 5,
          activityName: 'Sales Verification'
        },
        {
          id: 6,
          activityName: 'Login'
        },
        // {
        //   id: 11,
        //   activityName: 'Redirect'
        // },
        {
          id: 11,
          activityName: 'Rejected'
        }
      ]
    }
    else {
      this.showActivity = true;
      this.redirectionList = [
        {
          id: 7,
          activityName: 'Leads'
        },

        {
          id: 5,
          activityName: 'Sales Verification'
        },
        {
          id: 6,
          activityName: 'Login'
        },
        {
          id: 3,
          activityName: 'Login Verification'
        },

        {
          id: 8,
          activityName: 'Credit Recommendation'
        },
        {
          id: 9,
          activityName: 'Loan Sanction'
        },
        {
          id: 10,
          activityName: 'Loan Disbursement'
        },
        // {
        //   id: 11,
        //   activityName: 'Redirect'
        // },
        {
          id: 11,
          activityName: 'Rejected'
        }
      ]
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
    this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras);
  }
  redirectionTaskActivityList() {
    this.router.navigate(['provider', 'task']);
  }
  redirectionToEnquiry() {
    this.router.navigate(['provider', 'CreateEnquiry']);
  }
  redirectionSeperateTemplate(templateName: any) {
    // console.log('templateName', templateName)
    if (templateName === 'Login Verification') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'LOGIN'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    else if (templateName === 'CRIF') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'CRIF'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    else if (templateName === 'Sales Verification') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'SALESVERIFICATION'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);

    }
    else if (templateName === 'Login') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'DOCUMENTUPLOD'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    else if (templateName === 'Leads') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'NEWLEAD'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    else if (templateName === 'Credit Recommendation') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'CreditRecommendation'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    else if (templateName === 'Loan Sanction') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'LoanSanction'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    else if (templateName === 'Loan Disbursement') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'LoanDisbursement'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
    }
    // else if (templateName === 'Redirect') {
    //   const navigationExtras: NavigationExtras = {
    //     queryParams: {
    //       type: 'Redirect'
    //     }
    //   }
    //   this.router.navigate(['provider', 'lead'], navigationExtras);
    // }
    else if (templateName === 'Rejected') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          type: 'Rejected'
        }
      }
      this.router.navigate(['provider', 'lead'], navigationExtras);
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
        this.router.navigate(['provider', 'task', 'tasktemplate'], navigationExtras);
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
  createActivity() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        report_type: 'crm'
      }
    }
    this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
  }
  craeteLeadReport() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        report_type: 'lead'
      }
    }
    this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
  }

  createEnquiryReport() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        report_type: 'enquiry'
      }
    }
    this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
  }

  createMonthlyActivityReport() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        report_type: 'monthlyActivity'
      }
    }
    this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
  }
  createLeadStatusReport(){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        report_type: 'leadStatus'
      }
    }
    this.router.navigate(['provider', 'reports', 'new-report'], navigationExtras);
  }
}