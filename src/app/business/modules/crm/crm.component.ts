import { Component, OnInit, } from '@angular/core';
// import { GroupStorageService } from '../../../shared/services/group-storage.service';
// import { SnackbarService } from '../../../shared/services/snackbar.service';
// import { Messages } from '../../../shared/constants/project-messages';
// import { Router } from '@angular/router';
// NavigationExtras
// import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { Location } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { ProviderServices } from '../../../business/services/provider-services.service';
// import { WordProcessor } from '../../../shared/services/word-processor.service';
// import { FileService } from '../../../shared/services/file-service';


@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.css']
})
export class crmComponent implements OnInit{
  public step:any = 0;
  public panelOpenState:false;
  public redirectionList:any=[
    {
      id:1,
      activityName:'Enquiry'
    },
    {
      id:2,
      activityName:'Follow UPS'
    },
    {
      id:3,
      activityName:'Leads'
    },
    {
      id:4,
      activityName:'CRIF'
    },
    {
      id:5,
      activityName:'Sales Field Verification Processing Files'
    },
    {
      id:6,
      activityName:'Document Upload'
    },
    {
      id:7,
      activityName:'Document Verification'
    },
    {
      id:8,
      activityName:'Credit field verification and recommendation'
    },
    {
      id:9,
      activityName:'Loan Sanction'
    },
    {
      id:10,
      activityName:'Loan Disbursement'
    }
  ]
  public api_loading:boolean = true;

    constructor(
        // private groupService: GroupStorageService,
        // private provider_servicesobj: ProviderServices,
        // private snackbarService: SnackbarService,
        // private lStorageService: LocalStorageService,
        // private router: Router,
        private locationobj: Location,
        // public dialog: MatDialog,
        // private _location: Location,
        //  private wordProcessor:WordProcessor,
        // private fileService:FileService
        ){}
        ngOnInit(): void {
          this.fnChangeBorder('A')
          this.api_loading=false;
            
        }
        setStep(index: number) {
          console.log('index',index)
          this.step = index;
        }
        goback() {
          this.locationobj.back();
        }
        scheduleMarketingActivity(){
          // this.router.navigate()
          // this.router.navigate(['provider','crm', 'tasktemplate'])

        }
        scheduleMarketingActivityUpdation(){}
        fnChangeBorder(boxId){
          console.log('boxId',boxId)
          if(boxId==='A'){
            document.getElementById(boxId).style.borderBottom = "2px solid #1D3E77";
            document.getElementById('B').style.borderBottom = "0px solid #1D3E77";
            document.getElementById('C').style.borderBottom = "0px solid #1D3E77";
          }
          else if(boxId==='B'){
            document.getElementById(boxId).style.borderBottom = "2px solid #1D3E77";
            document.getElementById('A').style.borderBottom = "0px solid #1D3E77";
            document.getElementById('C').style.borderBottom = "0px solid #1D3E77";
          }
          else if(boxId==='C'){
            document.getElementById('B').style.borderBottom = "0px solid #1D3E77";
            document.getElementById('A').style.borderBottom = "0px solid #1D3E77";
            document.getElementById(boxId).style.borderBottom = "2px solid #1D3E77";
          }
          
          
        }
}