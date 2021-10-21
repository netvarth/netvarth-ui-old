import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../services/provider-services.service';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Location } from '@angular/common';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
    selector: 'app-labels',
    templateUrl: './labels.component.html',
    styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
    tooltipcls = '';
    add_button = '';    
    api_loading=true;
    label_list: any;
source;
    add_circle_outline = Messages.BPROFILE_ADD_CIRCLE_CAP;
    domain: any;
    users: any = [];
    team: any;
    constructor(private router: Router,
        private _location: Location, public activateroute: ActivatedRoute,
        private provider_services: ProviderServices,
        private snackbarService:SnackbarService,
        private groupService: GroupStorageService,
        private  wordProcessor: WordProcessor) {
            this.activateroute.queryParams.subscribe(params => {
               this.source = params.source;
               
              });
              const user = this.groupService.getitemFromGroupStorage('ynw-user');
              this.domain = user.sector;
              console.log(user.accountType);
              if (user.accountType === 'BRANCH') {
                  this.getProviders().then((data) => {
                   this.users = data;
                   console.log(this.users);
                   this.getUsersTeam().then((team)=>{
                       this.team=team;
                    this.getLabels();
                   }); 
                });                 
                }
                else {
                    this.getLabels();
                }
         }
    ngOnInit() {      
    }
    getUsersList(users){
        console.log(users);
        console.log(this.users);
       let userNamelist='';
       users.forEach(element => {
        const userObject =  this.users.filter(user => user.id === parseInt(element)); 
        console.log(userObject);
        userNamelist=userNamelist+userObject[0].firstName+' '+userObject[0].lastName+','
       }); 

        return userNamelist.replace(/,\s*$/, '');
    }
    getOwnership(ownerShipData){
        let userNamelist='';
       if(ownerShipData.users &&ownerShipData.users.length>0){
     
            ownerShipData.users.forEach(element => {
                const userObject =  this.users.filter(user => user.id === parseInt(element)); 
                console.log(userObject);
                userNamelist=userNamelist+userObject[0].firstName+' '+userObject[0].lastName+','
               }); 
        
                userNamelist= userNamelist.replace(/,\s*$/, '')
           }
           if(ownerShipData.teams &&ownerShipData.teams.length>0){

            ownerShipData.teams.forEach(element => {
                const userObject =  this.team.filter(team => team.id === parseInt(element)); 
                console.log(userObject);
                userNamelist=userNamelist+userObject[0].name+','
               }); 
               userNamelist= userNamelist.replace(/,\s*$/, '')
           }
       return userNamelist;

    }
    getLabels() {
        this.label_list = [];
        this.provider_services.getLabelList()
            .subscribe(
                (data: any) => {
                    console.log(data);
                    //this.label_list = data.filter(label => label.status === 'ACTIVE');
                    this.label_list=data;
                    this.api_loading = false;
                },
                error => {
                    this.api_loading = false;
                    this.wordProcessor.apiErrorAutoHide(this, error);
                }
            );
    }
    performActions(actions) {
        this.addLabel();
        if (actions === 'learnmore') {
            this.router.navigate(['/provider/' + this.domain + '/general->labels']);
        }
    }
    addLabel() {
        const navigationExtras: NavigationExtras = {
            queryParams: { source: this.source }
        };
        console.log(navigationExtras);
        this.router.navigate(['provider', 'settings', 'general',
        'labels','add'], navigationExtras);
    }
    editLabel(label) {
        const navigationExtras: NavigationExtras = {
            queryParams: { 
                source: this.source,
                id: label.id }
        };
        this.router.navigate(['provider', 'settings', 'general',
            'labels', 'edit'], navigationExtras);
    }
    goLabelDetail(label) {
        const navigationExtras: NavigationExtras = {
            queryParams: { id: label.id }
        };
        this.router.navigate(['provider', 'settings', 'general',
            'labels', 'view'], navigationExtras);
    }
    deleteLabel(label) {
        this.provider_services.deleteLabel(label.id).subscribe(
            () => {
                this.getLabels();
            },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        );
    }
    changeLabelStatus(label) {
        const status = (label.status === 'ENABLED') ? 'DISABLED' : 'ENABLED';
        const statusmsg = (label.status === 'ENABLED') ? ' disabled' : ' enabled';
        this.provider_services.updateLabelStatus(label.id, status).subscribe(data => {
            this.snackbarService.openSnackBar(label.displayName + statusmsg + ' successfully');
            this.getLabels();
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
    redirecToGeneral() {
        console.log(this.source);
        if (this.source === 'appt' || this.source === 'checkin' || this.source === 'customer' || this.source === 'order') {
            this._location.back();
        } else {
        this.router.navigate(['provider', 'settings' , 'general']);
        }
    }
    redirecToHelp() {
        this.router.navigate(['/provider/' + this.domain + '/general->labels']);
    }
    getProviders() {
        const _this = this;
          return new Promise(function (resolve, reject) {
            const apiFilter = {};
            // apiFilter['userType-eq'] = 'PROVIDER';
            _this.provider_services.getUsers(apiFilter).subscribe(data => {
                  resolve(data);
                },
                () => {
                  reject();
                }
              );
          });
      }
      getUsersTeam() {
        const _this = this;
        return new Promise(function (resolve, reject) {
        
          _this.provider_services.getTeamGroup().subscribe(data => {
                resolve(data);
              },
              () => {
                reject();
              }
            );
        });   
      }
      getUserName(userid) {
        console.log(userid);
        console.log(this.users);
        const userName =  this.users.filter(user => user.id === JSON.stringify(userid));
        console.log(userName);       
        // return userName.id;
    
      }
}
