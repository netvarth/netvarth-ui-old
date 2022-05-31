import { Component, OnInit, } from '@angular/core';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { ProviderServices } from '../../services/provider-services.service';
import { CrmService } from './crm.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css']
})
export class CRMComponent implements OnInit {

  crmTitle = '';



  public step: any = 0;
  public panelOpenState: false;
  public redirectionList: any = [
    // {
    //   id:1,
    //   activityName:'Enquiry'
    // },
    // {
    //   id:2,
    //   activityName:'Follow UPS'
    // },
    {
      id: 3,
      activityName: 'All Leads'
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
      id: 7,
      activityName: 'Leads'
    },
    // {
    //   id: 8,
    //   activityName: 'Credit field verification and recommendation'
    // },
    // {
    //   id: 9,
    //   activityName: 'Loan Sanction'
    // },
    // {
    //   id: 10,
    //   activityName: 'Loan Disbursement'
    // }
  ]
  public api_loading: boolean = true;
  public bLosFieldOpen:boolean=true;
  public bREportsFieldOpen:boolean=false;


  constructor(
    // private groupService: GroupStorageService,
    private providerServices: ProviderServices,
    // private snackbarService: SnackbarService,
    // private lStorageService: LocalStorageService,
    private router: Router,
    private locationobj: Location,
    // public dialog: MatDialog,
    // private _location: Location,
     private wordProcessor:WordProcessor,
     private crmService: CrmService
    // private fileService:FileService
  ) {
    // this.fnChangeBorder('A')
   }

   initCRM() {
    this.fnChangeBorder('A')
    if(this.wordProcessor.getSPTerminologyTerm('CRM')) {
      this.crmTitle = this.wordProcessor.getSPTerminologyTerm('CRM');
    } else {
      this.crmTitle = 'CRM';
    }
    this.api_loading = false;
   }
  ngOnInit(): void {
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
    if(templateName==='All Leads'){
      const navigationExtras: NavigationExtras =  {
        queryParams: {
          type: 'LEAD'
        }
      }
      this.router.navigate(['provider','lead'],navigationExtras);
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
      document.getElementById(boxId).style.borderBottom = "2px solid #1D3E77";
      document.getElementById('B').style.borderBottom = "0px solid #1D3E77";
      document.getElementById('C').style.borderBottom = "0px solid #1D3E77";
      this.bREportsFieldOpen=false;
      this.bLosFieldOpen=true;
    }
    else if (boxId === 'B') {
      document.getElementById(boxId).style.borderBottom = "2px solid #1D3E77";
      document.getElementById('A').style.borderBottom = "0px solid #1D3E77";
      document.getElementById('C').style.borderBottom = "0px solid #1D3E77";
    }
    else if (boxId === 'C') {
      document.getElementById('B').style.borderBottom = "0px solid #1D3E77";
      document.getElementById('A').style.borderBottom = "0px solid #1D3E77";
      document.getElementById(boxId).style.borderBottom = "2px solid #1D3E77";
      this.bREportsFieldOpen=true;
      this.bLosFieldOpen=false;

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