import { Component, OnInit } from '@angular/core';
import { ReportDataService } from '../reports-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.css']
})
export class CustomerSelectionComponent implements OnInit {

  patient_array: any[];
  customerCount: any;
  customer_selected: any;
  count = -1;
  customer_data: any;
  qParams: any;
  form_data: any;
  searchForm: FormGroup;
  placeHolder_msg: string;
  customer_label: any;
  reportType: any;
  customerList: any[];
  selection = new SelectionModel(true, []);
  customerSelected = 'all';
  allcustomer = true;





  'list': [
    { 'name': 'some name 1', ID: 'D1', 'checked': true },
    { 'name': 'some name 2', ID: 'D2', 'checked': false }
  ];


  displayedColumns = ['select', 'id', 'fname', 'lname', 'phone', 'status'];
  public patient_dataSource = new MatTableDataSource<any>([]);
  constructor(private router: Router,
    private activated_route: ActivatedRoute,
    private report_data_service: ReportDataService,
    private fb: FormBuilder,
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor) {
    this.allcustomer = true;
    this.activated_route.queryParams.subscribe(qparams => {
      this.patient_array = [];
      if (qparams) {
        this.reportType = qparams.report_type;

        if (qparams.data !== 0 && qparams.data !== undefined) {
          this.findPatients(qparams.data);
          this.allcustomer = false;
          this.customerSelected = 'specific';


        } else {
          this.allcustomer = true;
          this.customerSelected = 'all';


          this.customerSelected = 'all';


        }
      } else {
        this.allcustomer = true;
      }

    });

  }


  ngOnInit() {

    this.createForm();
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    const placeholder = 'Enter customer id seperated by comm;Ex 1,2,3';
    this.placeHolder_msg = placeholder.replace('customer', this.customer_label);
  }
  handleChange(event) {
    this.count = -1;
    if (this.customerSelected === 'all') {
      const customerData = {
        'jaldee_customers': 'All',
        'customers': 0
      };
      this.report_data_service.updateCustomers(customerData);
    }

  }
  getPatientPhoneNo(patient) {
    let phone = '';
    if (patient.phoneNo === null || patient.phoneNo === 'undefined' || patient.phoneNo === '') {
      phone = '';
    } else {
      phone = patient.countryCode + patient.phoneNo;
    }
    return phone;
  }
  passCustomersToReports() {
    if (this.customerSelected === 'specific') {
      this.customer_selected = 'All';
      if (this.patient_dataSource.data.length > 0) {
        this.customer_selected = this.selection.selected;

      }

      let jaldee_customer_id = '';
      let customer_id = '';
      this.customer_selected.forEach(function (customer) {
        console.log(customer);
        customer_id = customer_id + customer.id + ',';
        jaldee_customer_id = jaldee_customer_id + customer.jaldeeId + ',';
      });
      console.log(jaldee_customer_id);

      const jaldee_customers = jaldee_customer_id.replace(/,\s*$/, '');
      const customers = customer_id.replace(/,\s*$/, '');
      const customerData = {
        'jaldee_customers': jaldee_customers,
        'customers': customers
      };
      if (this.customer_selected.length === 0) {
        this.snackbarService.openSnackBar('Please select atleast one', { 'panelClass': 'snackbarerror' });
      } else {
        this.report_data_service.updateCustomers(customerData);
        this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
      }
    } else {
      const customerData = {
        'jaldee_customers': 'All',
        'customers': 0
      };
      this.report_data_service.updateCustomers(customerData);
      this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
    }
  }

  createForm() {
    this.searchForm = this.fb.group({
      search_input: ['', Validators.compose([Validators.required])]
    });
  }
  getPatientDetails(post_data) {


  }
  findPatients(qparamsData) {

    const customerData: any[] = qparamsData.split(',');
    for (let i = 0; i < customerData.length; i++) {
      const data = {
        'id-eq': customerData[i]
      };


      this.provider_services.getCustomer(data)
        .subscribe(
          (res: any) => {
            this.patient_array.push(res[0]);

            this.patient_dataSource.data = this.patient_array;
            this.count = this.patient_dataSource.data.length;
            this.patient_dataSource.data.forEach(row => this.selection.select(row));

          });


    }





  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.patient_dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.patient_dataSource.data.forEach(row => this.selection.select(row));
  }
  redirecToReports() {
    this.router.navigate(['provider', 'reports', 'new-report'], { queryParams: { report_type: this.reportType } });
  }
  searchCustomer(form_data) {
    this.customer_selected = [];

    let mode = 'id';
    this.form_data = null;

    let post_data = {};
    const emailPattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
    const isEmail = emailPattern.test(form_data.search_input);
    if (isEmail) {
      mode = 'email';
    } else {
      const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const isNumber = phonepattern.test(form_data.search_input);
      const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const isCount10 = phonecntpattern.test(form_data.search_input);
      if (isNumber && isCount10) {
        mode = 'phone';
      } else {
        mode = 'id';
      }
    }

    switch (mode) {
      case 'phone':
        post_data = {
          'phoneNo-eq': form_data.search_input
        };
        break;
      case 'email':
        post_data = {
          'email-eq': form_data.search_input
        };
        break;
      case 'id':
        post_data = {
          'jaldeeId-eq': form_data.search_input
        };
        break;
    }

    this.provider_services.getCustomer(post_data)
      .subscribe(
        (data: any) => {
          this.patient_dataSource.data = data;
          this.count = data.length;
          // this.masterToggle();
          // if (this.count > 0) {

          // }

          // if (data.length === 0) {

          // } else {

          //   if (data.length > 1) {
          //     const customer = data.filter(member => !member.parent);
          //     this.customer_data = customer[0];
          //   } else {
          // this.customer_data = data[0];
          // }
          // this.jaldeeId = this.customer_data.jaldeeId;
          // this.getFamilyMembers();
          // this.initCheckIn();
          // }
        },
        error => {
          this.wordProcessor.apiErrorAutoHide(this, error);
        }
      );
  }

}
