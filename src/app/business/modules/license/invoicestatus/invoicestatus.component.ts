import { Component, OnInit, Input } from "@angular/core";
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { MatDialog } from '@angular/material';
import { ProviderLicenceInvoiceDetailComponent } from '../../../../ynw_provider/components/provider-licence-invoice-detail/provider-licence-invoice-detail.component';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { NavigationExtras, Router } from '@angular/router';
// import { SOURCE } from '@angular/core/src/di/injector';


@Component({

  selector: 'app-invoicestatus',
  templateUrl: './invoicestatus.component.html'
})
export class InvoiceStatusComponent {
  api_loading;
  statusDetail: any;
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
  invoice_status = [];
  temp3;
  selected = 0;
  check_status;
  invoiceStatus = [];
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
    RolledBack:'',
  //  Obsolete: '',
    invoiceStatus: 'all',
  };
  filters = {
    Paid: false,
    Notpaid: false,
    Cancel: false,
    Waived: false,
    RolledBack: false,
    //Obsolete: false,
    invoiceStatus: false,
  };
  invoice_status_cap = Messages.INVOICE_STATUS_CAP;
  constructor(
    private router: Router,
    private dialog: MatDialog,
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

  setFilterData(type, status) {
    let passingStatus;
    console.log(this.selected);
    console.log(type);
    console.log(status);
    if (status && this.selected === 0) {
      this.selected = 1;
      this.invoiceStatus.push(status);
      passingStatus = this.invoiceStatus.toString();
      this.filter[type] = passingStatus;
      this.doSearch();
    } else if (status && this.selected === 1) {
      if (this.invoiceStatus.indexOf(status) !== -1) {
        const indexofStatus = this.invoiceStatus.indexOf(status);
        console.log(indexofStatus);
        if (indexofStatus >= 0) {
         console.log( this.invoiceStatus.splice(indexofStatus, 1));
        }
        passingStatus = this.invoiceStatus.toString();
        this.filter[type] = passingStatus;
        if(this.filter[type] === ''){
        this.resetFilter();
        }
        this.doSearch();
       
      }
       else {
        this.invoiceStatus.push(status);
        passingStatus = this.invoiceStatus.toString();
        this.filter[type] = passingStatus;
        console.log(this.filter[type]);
        this.doSearch();
      }

    }
    
     this.check_status = '';
     
     
  }
  setFilterForApi() {
    const api_filter = {};
    if (this.filter.invoiceStatus !== 'all') {
      api_filter['invoiceStatus-eq'] = this.filter.invoiceStatus;
    }
    return api_filter;
  }

  getInvoiceStatus() {
    const Mfilter = this.setFilterForApi();
    this.provider_services.getInvoiceStatus(Mfilter)
      .subscribe(
        data => {
          for (let i in data) {

          }
          this.statusDetail = data;
        });
  }
  doSearch() {
    if (this.filter.invoiceStatus !== 'all') {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.getInvoiceStatus();
  }

  resetFilter() {
    this.filters = {
      Paid: false,
      Notpaid: false,
      Cancel: false,
      Waived: false,
      RolledBack: false,
      //Obsolete: false,
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
}
