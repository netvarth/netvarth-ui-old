import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-jaldee-video-settings',
  templateUrl: './jaldee-video-settings.component.html',
  styleUrls: ['./jaldee-video-settings.component.css']
})
export class JaldeeVideoSettingsComponent implements OnInit {
  jaldeeVideoRecord_status: any;
  jaldeeVideoRecord_statusstr: string;
  videocredits: ArrayBuffer;
  domain: any;

  constructor(
    private provider_services: ProviderServices,
    private snackbarService: SnackbarService,
    private router: Router,
    private groupService: GroupStorageService,
  ) { }


  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.getRecordingStatus().then(
        (recordStatus)=> {
            this.jaldeeVideoRecord_status = recordStatus;
            this.jaldeeVideoRecord_statusstr = (this.jaldeeVideoRecord_status) ? 'On' : 'Off';
        }
    );
    this.provider_services.getJaldeeVideoRecording()
    .subscribe(
      (data) => {
          this.videocredits = data;
       console.log(data)
      }
    );
}

getRecordingStatus() {
    return new Promise((resolve, reject) => {
    this.provider_services.getGlobalSettings().subscribe(
        (data: any) => {                
            resolve(data.videoRecording);                
        }, (error)=>{
            reject(error);
        });
    });
}
handle_RecordingStatus(event) {
    const is_VirtualCallingMode = (event.checked) ? 'ENABLED' : 'DISABLED';
    this.provider_services.setJaldeeVideoRecording(is_VirtualCallingMode)
        .subscribe(
            () => {
                this.snackbarService.openSnackBar('Jaldee Video settings' + ' updated successfully', { ' panelclass': 'snackbarerror' });
                this.getRecordingStatus().then(
                    (recordStatus)=> {
                        this.jaldeeVideoRecord_status = recordStatus;
                        this.jaldeeVideoRecord_statusstr = (this.jaldeeVideoRecord_status) ? 'On' : 'Off';
                    }
                );
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.getRecordingStatus().then(
                    (recordStatus)=> {
                        this.jaldeeVideoRecord_status = recordStatus;
                        this.jaldeeVideoRecord_statusstr = (this.jaldeeVideoRecord_status) ? 'On' : 'Off';
                    }
                );
            }
        );
}


learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.router.navigate(['/provider/' + this.domain + '/comm->' + mod]);
}
redirecToHelp() {
    this.router.navigate(['/provider/' + this.domain + '/comm']);
}


redirecToSettings() {
    this.router.navigate(['provider', 'settings' , 'comm']);
}
}
