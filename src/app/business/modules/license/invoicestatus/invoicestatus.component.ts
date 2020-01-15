import { Component, OnInit, Input } from "@angular/core";
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { MatDialog } from '@angular/material';
import { ProviderLicenceInvoiceDetailComponent } from '../../../../ynw_provider/components/provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { projectConstants } from '../../../../shared/constants/project-constants';


@Component({

  selector: 'app-invoicestatus',
  templateUrl: './invoicestatus.component.html'
})
export class invoicestatuscomponent {
  [x: string]: any;

  breadcrumb_moreoptions: any = [];

  breadcrumbs = [
    {
      title: 'License & Invoice',
      url: '/provider/license'
    },
    {
      title: 'Invoice / Statement'
    }
  ];
  //invoice: any = null;
  //invoice_status = [];
  selected = 0;
  check_status ;
  invoiceStatus =[];
  invoice_status_filter = projectConstants.INVOICE_STATUS_FILTER;
  statusDialogRef;
  open_filter = false;
  filterapplied = false;
  filter_sidebar = false;
  filter = {
    Paid: '',
    Notpaid: '',
    Cancel: '',
    Waived: '',
    Obsolete: '',
    invoiceStatus: 'all',
   // selected:''
    //page_count: projectConstants.PERPAGING_LIMIT,
    //page: 1
  };
  filters = {
    Paid: false,
    Notpaid: false,
    Cancel: false,
    Waived: false,
    Obsolete: false,
    invoiceStatus: false,
     };
  invoice_status_cap = Messages.INVOICE_STATUS_CAP;
  //all_cap = Messages.ALL_CAP;

  //any_cap = Messages.SYS_ALERTS_ANY_CAP;
  // pagination: any = {
  //   startpageval: 1,
  //   totalCnt: 0,
  //   perPage: this.filter.page_count
  // };

   constructor(
    private dialog: MatDialog,
    public provider_services: ProviderServices)
  {  
    this.getInvoiceStatus();
  }
  jaldeeStatement(invoice)
  {
     this.statusDialogRef = this.dialog.open(ProviderLicenceInvoiceDetailComponent, 
    {
      width: '50%',
      data: 
      {
        invoice: invoice,
        source: 'license-home'
      },
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true
    }
    );
    this.statusDialogRef.afterClosed().subscribe(() => { });
   
  }


  setFilterData(type, status)
    {
      let passingStatus;
    //this.filter[type] = status;
      if(status && this.selected === 0)
       {
          this.selected =1;
          this.invoiceStatus.push(status);
          passingStatus= this.invoiceStatus.toString();
          this.filter[type] = passingStatus;
          this.doSearch();
       }
       else if(status && this.selected === 1)
       {
          if(this.invoiceStatus.indexOf(status)!==-1)
          {
            let indexofStatus = this.invoiceStatus.indexOf(status);
              if (indexofStatus >= 0)
               {
                  this.invoiceStatus.splice(indexofStatus, 1 );
               }
            passingStatus= this.invoiceStatus.toString();
            console.log(passingStatus);
            this.filter[type] = passingStatus;
            this.doSearch();
          }
         else
         {
           this.invoiceStatus.push(status);
           passingStatus= this.invoiceStatus.toString();
           this.filter[type] = passingStatus;
           this.doSearch();
        } 
     
      }
      this.check_status='';
    }  


  setFilterForApi() 
  {
    const api_filter = {};
    if (this.filter.invoiceStatus !== 'all')
   {
      api_filter['invoiceStatus-eq'] = this.filter.invoiceStatus;
   }
   return api_filter;
  }
  

  getInvoiceStatus() 
  {
    const Mfilter = this.setFilterForApi();
    this.provider_services.getInvoiceStatus(Mfilter)
      .subscribe(
        data => {
          this.statusDetail = data;
           } );
  }
 
  // setPaginationFilter(api_filter)
  // {
  //   api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
  //   api_filter['count'] = this.filter.page_count;
  //   return api_filter;
  // }
 
 
 
  doSearch() 
  {
    if (this.filter.invoiceStatus !== 'all')
     
     {
      this.filterapplied = true;
     }
     else 
    {
      this.filterapplied = false;
    }
    this.getInvoiceStatus();
  }

  resetFilter()
  {
    this.filters = {
    Paid: false,
    Notpaid: false,
    Cancel: false,
    Waived: false,
    Obsolete: false,
    invoiceStatus: false,};
    
  
    this.filter = {
    Paid: '',
    Notpaid: '',
    Cancel: '',
    Waived: '',
    Obsolete: '',
    invoiceStatus: 'all', };
   
   
    // page_count: projectConstants.PERPAGING_LIMIT,
    // page: 1 };
 
  }





  clearFilter() 
  {
    // for (var i = 0; i < this.invoiceStatus.length; i++) {
    // //   this.invoiceStatus[i].isSelected = this.check_status ;

    // // }
    
    this.check_status = false;
    this.invoiceStatus =[];
    this.resetFilter();
    this.filterapplied =false;
    this.getInvoiceStatus();
    
  }
  
  
  showFilterSidebar() 
  {
    this.filter_sidebar = true;
  }

  hideFilterSidebar() 
  {
    this.filter_sidebar = false;
  }


  

}
