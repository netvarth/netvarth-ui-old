import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SubSink } from 'subsink';
import { SharedFunctions } from '../../../../../../src/app/shared/functions/shared-functions';
// import { SharedFunctions } from '../../../../../../src/app/shared/functions/shared-functions';

@Component({
  selector: 'app-taskmanager',
  templateUrl: './taskmanager.component.html',
  styleUrls: ['./taskmanager.component.css']
})
export class TaskmanagerComponent implements OnInit, OnDestroy {

  customer_label = '';
  taskstatus;
  pos_statusstr = 'Off';
  frm_public_self_cap = '';
  domain;
  nodiscountError = false;
  noitemError = false;
  itemError = '';
  discountError = '';
  discount_list;
  discount_count = 0;
  item_list;
  item_count = 0;
  pos;
  catalog_list: any = [];
  private subscriptions = new SubSink();
  task_status: string;
  constructor(

    private routerobj: Router,
    private shared_functions: SharedFunctions,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }
  ngOnInit() {
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.getTaskStatus();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
 
  handleTaskStatus(event) {
    if(event.checked){
      this.task_status =  'Enable';
    }
    else{
      this.task_status =  'Disable';
    }
    const status = (event.checked) ? 'enabled' : 'disabled';
      this.subscriptions.sink = this.provider_services.setProviderTaskStatus(this.task_status).subscribe(data => {
        this.snackbarService.openSnackBar('Task settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
        this.getTaskStatus();
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        this.getTaskStatus();
      });
    
  }
  getTaskStatus() {
    this.subscriptions.sink = this.provider_services.getProviderTaskSettings().subscribe((data: any) => {
      this.taskstatus = data.enableTask;
      this.pos_statusstr = (this.taskstatus) ? 'On' : 'Off';
      this.shared_functions.sendMessage({ 'ttype': 'taskstatus', taskstatus: this.taskstatus });
    });
  }
  
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
  }
}
