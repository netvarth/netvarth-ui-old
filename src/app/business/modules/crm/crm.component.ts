import { Component, OnInit, } from '@angular/core';
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


  public step: any = 0;
  public panelOpenState: false;
  
  public redirectionList: any = []
  public api_loading: boolean = true;
  public bLosFieldOpen:boolean=true;
  public bREportsFieldOpen:boolean=false;
  showActivity = true;
  bBorderBottomTYpeA:boolean=false;
  bBorderBottomTypeC:boolean=false;

  constructor(
    private providerServices: ProviderServices,
    private router: Router,
    private groupService: GroupStorageService,
    private locationobj: Location,
     private wordProcessor:WordProcessor,
     private crmService: CrmService
  ) {
   }

   initCRM() {
    if(this.wordProcessor.getSPTerminologyTerm('CRM')) {
      this.crmTitle = this.wordProcessor.getSPTerminologyTerm('CRM');
    } else {
      this.crmTitle = 'CRM';
    }
    this.api_loading = false;
   }
  ngOnInit(): void {
    this.bBorderBottomTYpeA=true;
    this.userInfo()
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
    console.log('this.providerServices.reportToCrm',this.providerServices.reportToCrm)
    if((this.providerServices && this.providerServices.reportToCrm )=== 'FromReport'){
      this.fromReportToCrm()
    }
    
  }
  fromReportToCrm(){
    if(this.providerServices && this.providerServices.reportToCrm){
      this.fnChangeBorder('C')
      this.bREportsFieldOpen=true;
      this.bLosFieldOpen=false;
    }
    this.providerServices.reportToCrm=''
  }
  userInfo(){
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    console.log(user)
    this.isadminPrivilege = user.adminPrivilege
    if(user.userType === 2){
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
        {
          id:11,
          activityName: 'Redirect'
        },
        {
          id:11,
          activityName: 'Rejected'
        }
      ]
    }
    else if(user.userType === 1 && this.isadminPrivilege){
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
        {
          id:11,
          activityName: 'Redirect'
        },
        {
          id:11,
          activityName: 'Rejected'
        }
      ]
    }
    else if(user.userType===1){
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
        {
          id:11,
          activityName: 'Redirect'
        },
        {
          id:11,
          activityName: 'Rejected'
        }
      ]
    }
    else{
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
        {
          id:11,
          activityName: 'Redirect'
        },
        {
          id:11,
          activityName: 'Rejected'
        }
      ]
    }
  }
  setStep(index: number) {
    console.log('index', index)
    this.step = index;
  }
  goback() {
    this.locationobj.back();
  }
  templateViewActivity(textValue) {
    console.log('textValue', textValue)
    // this.router.navigate()
    // this.router.navigate(['provider','crm', 'tasktemplate'])
    if(textValue==='Follow UP 1'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'followUpOne'
        }
      }
      this.router.navigate(['provider','followupone'],navigationExtras)
    }
    else{
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'followUpTwo'
        }
      }
      this.router.navigate(['provider','followupone'],navigationExtras)
      
    }

  }
  redirectionTaskTemplate(){
    const navigationExtras: NavigationExtras =  {
      queryParams: {
        type: 'activityCreateTemplate'
      }
    }
    this.router.navigate(['provider','task', 'tasktemplate'], navigationExtras);
  }
  redirectionTaskActivityList(){
    this.router.navigate(['provider','task']);
  }
  redirectionToEnquiry(){
    this.router.navigate(['provider','CreateEnquiry']);
  }
  redirectionSeperateTemplate(templateName:any){
    console.log('templateName',templateName)
    if(templateName==='Login Verification'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'LOGIN'
        }
      }
      this.router.navigate(['provider','lead'], navigationExtras);
    }
    else if(templateName==='CRIF'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'CRIF'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Sales Verification'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'SALESVERIFICATION'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);

    }
    else if(templateName==='Login'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'DOCUMENTUPLOD'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Leads'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'NEWLEAD'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Credit Recommendation'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'CreditRecommendation'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Loan Sanction'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'LoanSanction'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Loan Disbursement'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'LoanDisbursement'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Redirect'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'Redirect'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
    }
    else if(templateName==='Rejected'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'Rejected'
        }
      }
      this.router.navigate(['provider','lead'], navigationExtras);
    }
  }
  buttonClicked (type) {
    switch(type) {
      case 'LOS' :
          this.router.navigate(['provider', 'crm', 'leads']);
          break;
      case 'CREATETASK': 
          const navigationExtras: NavigationExtras =  {
            queryParams: {
              type: 'leadCreateTemplate'
            }
          }
          this.router.navigate(['provider','task', 'tasktemplate'], navigationExtras);
    }
  }
  templateUpdation(textValue) {
    console.log('textValue', textValue)
  }
  fnChangeBorder(boxId) {
    console.log('boxId', boxId)
    if (boxId === 'A') {
      this.bREportsFieldOpen=false;
      this.bLosFieldOpen=true;
      this.bBorderBottomTYpeA=true;
      this.bBorderBottomTypeC=false;
    }
    else if (boxId === 'C') {
      this.bREportsFieldOpen=true;
      this.bLosFieldOpen=false;
      this.bBorderBottomTypeC=true;
      this.bBorderBottomTYpeA=false;

    }
  }
  createActivity(){
    const navigationExtras: NavigationExtras =  {
      queryParams: {
        report_type: 'crm'
      }
    }
    this.router.navigate(['provider','reports','new-report'],navigationExtras);
  }
  craeteLeadReport(){
    const navigationExtras: NavigationExtras =  {
      queryParams: {
        report_type: 'lead'
      }
    }
    this.router.navigate(['provider','reports','new-report'],navigationExtras);
  }
  
}