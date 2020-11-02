import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { QuestionService } from '../dynamicforms/dynamic-form-question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-provider-bprofile-search-dynamic',
  templateUrl: './provider-bprofile-search-dynamic.component.html'
})

export class ProviderBprofileSearchDynamicComponent implements OnInit {


  bProfile = null;
  domain_questions: any = [];
  subdomain_questions: any = [];
  que_type = 'domain_questions';
  grid_row_index = null;
  title = null;
  subdomain = null;
  api_error = null;
  active_user;

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private service: QuestionService,
    private routerobj: Router,
    public shared_functions: SharedFunctions,
    public dialogRef: MatDialogRef<ProviderBprofileSearchDynamicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.que_type = this.data.type || 'domain_questions';
    this.bProfile = this.data['bProfile'];
    this.grid_row_index = this.data['grid_row_index'];
    if (this.que_type === 'domain_questions') {
      this.domain_questions = this.data['questions'] || [];
      this.title = this.domain_questions[0]['label'];

    } else if (this.que_type === 'subdomain_questions') {
      this.subdomain_questions = this.data['questions'] || [];
      this.title = this.subdomain_questions[0]['label'] || '';
      this.subdomain = this.bProfile['serviceSubSector']['subDomain'];
    }
    if (this.domain_questions.length === 0 &&
      this.subdomain_questions === 0) {
      this.dialogRef.close('error');
    }
  }

  getDomainVirtualFields() {

    this.getVirtualFields(this.bProfile['serviceSector']['domain'])
      .then(
        data => {
          this.domain_questions = data;
        }
      );

  }

  getSubDomainVirtualFields() {

    this.getVirtualFields(this.bProfile['serviceSector']['domain'],
      this.bProfile['serviceSubSector']['subDomain']).then(
        data => {
          this.subdomain_questions = data;
        }
      );

  }

  getVirtualFields(domain, subdomin = null) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.provider_services.getVirtualFields(domain, subdomin)
        .subscribe(
          data => {
            data = _this.setFieldValue(data, subdomin);
            resolve(_this.service.getQuestions(data));
          },
          () => {
            reject();
          }
        );

    });


  }

  setFieldValue(data, subdomin) {

    let fields = [];

    if (subdomin) {
      fields = (this.bProfile['subDomainVirtualFields'] &&
        this.bProfile['subDomainVirtualFields'][0]) ?
        this.bProfile['subDomainVirtualFields'][0][subdomin] : [];
    } else {
      fields = (this.bProfile['domainVirtualFields']) ?
        this.bProfile['domainVirtualFields'] : [];
    }

    if (fields) {
      for (const i in data) {
        if (data[i]) {
          const row = data[i];
          if (fields[row.name]) {
            data[i]['value'] = fields[row.name];
          }
        }
      }
      return data;
    } else {
      return data;
    }
  }

  onDomainFormSubmit(submit_data) {

    this.resetApiError();

    submit_data = this.checkEnumList(this.domain_questions, submit_data);
    submit_data = this.checkGridQuestion(this.domain_questions, submit_data);
    const post_data = this.setPostData(submit_data);
    this.provider_services.updateDomainSubDomainFields(post_data, this.bProfile['serviceSector']['domain'])
      .subscribe(
        () => {
          this.dialogRef.close('reloadlist');
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }

  onSubDomainFormSubmit(submit_data) {

    this.resetApiError();

    submit_data = this.checkEnumList(this.subdomain_questions, submit_data);
    submit_data = this.checkGridQuestion(this.subdomain_questions, submit_data);
    const post_data = this.setPostData(submit_data);
    const hold_data = post_data; // additional checking to avoid blank arrays related issues reported in bug
    Object.keys(hold_data).forEach(key => {
      if (typeof hold_data[key] === 'object') {
        if (hold_data[key].length > 0) {
          post_data[key] = hold_data[key];
        } else {
          delete post_data[key];
        }
      } else {
        post_data[key] = hold_data[key];
      }
    });
    this.provider_services.updateDomainSubDomainFields(post_data, null,
      this.bProfile['serviceSubSector']['subDomain'])
      .subscribe(
        () => {
          this.dialogRef.close('reloadlist');
        },
        error => {
          this.shared_functions.apiErrorAutoHide(this, error);
        }
      );
  }

  checkEnumList(questions, submit_data) {
    for (const row of questions) {
      if (row.controlType === 'enumlist') {
        submit_data[row.key] = this.changeEnumValues(submit_data[row.key]);
      }
    }
    return submit_data;
  }

  changeEnumValues(grid_value_list) {
    const value = [];
    if (grid_value_list[0]) {
      const loop_val = grid_value_list[0];
      for (const key in loop_val) {
        if (loop_val[key] === true) {
          value.push(key);
        }
      }
      return value;
    } else {
      return [];
    }
  }

  checkGridQuestion(questions, submit_data) {
    for (const row of questions) {
      if (row.controlType === 'datagrid') {
        submit_data[row.key] = this.changeGridValues(submit_data[row.key], row.key);
      }
    }
    return submit_data;
  }

  changeGridValues(grid_value_list, key) {

    // JSON.parse(JSON.stringify used to remove reference from parent page
    let pre_value = {};
    if (this.que_type === 'domain_questions' &&
      typeof this.bProfile['domainVirtualFields'] === 'object') {
      pre_value = JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields']));
    } else if (this.que_type === 'subdomain_questions' && typeof this.bProfile['subDomainVirtualFields'] === 'object') {

      pre_value = JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    }

    if (pre_value[key]) {
      if (pre_value[key][this.grid_row_index]) {
        pre_value[key][this.grid_row_index] = grid_value_list[0];
      } else {
        // pre_value[key].push(grid_value_list[0]);
        pre_value[key].push(grid_value_list[(grid_value_list.length - 1)]);
      }
      return pre_value[key];

    } else {
      return grid_value_list;

    }
  }

  setPostData(submit_data) {
    const keys = Object.keys(submit_data);
    let pre_value = {};

    if (this.que_type === 'domain_questions' && typeof this.bProfile['domainVirtualFields'] === 'object') {

      pre_value = JSON.parse(JSON.stringify(this.bProfile['domainVirtualFields']));
    } else if (this.que_type === 'subdomain_questions' && typeof this.bProfile['subDomainVirtualFields'] === 'object') {

      pre_value = JSON.parse(JSON.stringify(this.bProfile['subDomainVirtualFields'][0][this.subdomain]));
    }

    for (const key of keys) {

      if (pre_value[key]) {
        if (typeof submit_data[key] === 'string' && submit_data[key] !== '' ||
          (typeof submit_data[key] === 'object' && submit_data[key].length !== 0)) {
          pre_value[key] = submit_data[key];
        } else {
          delete pre_value[key];
          // used to remove the field if the value is null.
          // Grid data will delete from view page
        }

      } else {
        pre_value[key] = submit_data[key];
      }
    }

    return pre_value;
  }

  getBusinessProfile() {

    this.provider_services.getBussinessProfile()
      .subscribe(
        data => {
          this.provider_datastorage.set('bProfile', data);
          this.bProfile = data;
        },
        () => {

        }
      );

  }

  resetApiError() {
    this.api_error = null;
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/learnmore/profile-search->additional-info']);
    // const pdata = { 'ttype': 'learn_more', 'target': this.getMode(mod) };
    // this.sharedfunctionobj.sendMessage(pdata);
  }

}
