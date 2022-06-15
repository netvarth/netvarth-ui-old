import { Component } from '@angular/core';
import { ProviderServices } from '../../../services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';

@Component({

  selector: 'app-invoicestatus',
  templateUrl: './invoicestatus.component.html'
})
export class InvoiceStatusComponent {
  tooltipcls = '';
  api_loading;
  statusDetail: any=[];
  invoice_status = [];
  temp3;
  selected = 0;
  check_status;
  invoiceStatus = [];
  invoice_status_filter = projectConstantsLocal.INVOICE_STATUS_FILTER;
  statusDialogRef;
  open_filter = false;
  filterapplied = false;
  filter_sidebar = false;
  filter = {
    Paid: '',
    Notpaid: '',
    Cancel: '',
    Waived: '',
    RolledBack: '',
    //  Obsolete: '',
    invoiceStatus: 'all',
  };
  filters = {
    Paid: false,
    Notpaid: false,
    Cancel: false,
    Waived: false,
    RolledBack: false,
    // Obsolete: false,
    invoiceStatus: false,
  };
  invoice_status_cap = Messages.INVOICE_STATUS_CAP;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  constructor(
    private router: Router,
    public provider_services: ProviderServices) {
    this.getInvoiceStatus();
  }

  jaldeeStatement(invoice) {
    this.temp3 = invoice.licensePaymentStatus;
    const invoiceJson = JSON.stringify(invoice);
    if (this.temp3 === 'Paid') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          invoice: invoiceJson,
          source: 'payment-history',
          data1: 'invo-statement NotPaid'
          // data1 variable used To declare breadcrumbs in License & Invoice ..>Invoice / Statement(@shiva)
        },
      };
      this.router.navigate(['provider', 'license', 'Statements'], navigationExtras);
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          invoice: invoiceJson,
          source: 'license-home',
          data2: 'invo-statement Paid'
          // data2 variable used To declare breadcrumbs in License & Invoice ..>Invoice / Statement(@shiva)

        },
      };
      this.router.navigate(['provider', 'license', 'Statements'], navigationExtras);
    }



  }
  setFilterDataCheckbox(type, value) {
    //this.filter[type] = value;
    if (type === "statusMode") {
      const indx = this.invoiceStatus.indexOf(value);
      console.log("statusMode value :", value);
      this.invoiceStatus = [];
      if (indx === -1) {
        this.invoiceStatus.push(value);
      }
    }
    this.doSearch();
    // this.keyPressed()
  }
  // setFilterData(type, status) {
  //   let passingStatus;
  //   if (status && this.selected === 0) {
  //     this.selected = 1;
  //     this.invoiceStatus.push(status);
  //     passingStatus = this.invoiceStatus.toString();
  //     this.filter[type] = passingStatus;
  //     this.doSearch();
  //   } else if (status && this.selected === 1) {
  //     if (this.invoiceStatus.indexOf(status) !== -1) {
  //       const indexofStatus = this.invoiceStatus.indexOf(status);
  //       this.invoiceStatus.splice(indexofStatus, 1)
  //       passingStatus = this.invoiceStatus.toString();
  //       this.filter[type] = passingStatus;
  //       if (this.filter[type] === '') {
  //         this.resetFilter();
  //       }
  //       this.doSearch();
  //     } else {
  //       this.invoiceStatus.push(status);
  //       passingStatus = this.invoiceStatus.toString();
  //       this.filter[type] = passingStatus;
  //       this.doSearch();
  //     }

  //   }

  //   this.check_status = '';


  // }
  setFilterForApi() {
    const api_filter = {};
    // if (this.filter.invoiceStatus !== 'all') {
    //   api_filter['invoiceStatus-eq'] = this.filter.invoiceStatus;
    // }
    if (this.invoiceStatus.length > 0) {
      api_filter["invoiceStatus-eq"] = this.invoiceStatus.toString();
    //  api_filter["folderName-eq"] = this.foldertype;
    }
    return api_filter;
  }

  getInvoiceStatus() {
    const Mfilter = this.setFilterForApi();
    this.provider_services.getInvoiceStatus(Mfilter)
      .subscribe(
        data => {
          this.statusDetail = data;
        });
  }
  doSearch() {
    
  
    if (this.filter.invoiceStatus !== 'all' || this.invoiceStatus.length > 0) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
   // this.getInvoiceStatus();
  }
 
  resetFilter() {
    this.filters = {
      Paid: false,
      Notpaid: false,
      Cancel: false,
      Waived: false,
      RolledBack: false,
      invoiceStatus: false,
    };

    this.filter = {
      Paid: '',
      Notpaid: '',
      Cancel: '',
      Waived: '',
      RolledBack: '',
      // Obsolete: '',
      invoiceStatus: 'all',
    };
    this.invoiceStatus = []
  }
  clearFilter() {
    this.check_status = false;
    this.invoiceStatus = [];
    this.resetFilter();
    this.filterapplied = false;
    this.getInvoiceStatus();
  }


  showFilterSidebar() {
    this.filter_sidebar = true;
  }

  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  redirecToLicenseInvoice() {
    this.router.navigate(['provider', 'license']);
}
}
