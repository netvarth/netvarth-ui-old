import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-folder-files',
  templateUrl: './folder-files.component.html',
  styleUrls: ['./folder-files.component.css']
})
export class FolderFilesComponent implements OnInit {
  customers: any[];
  foldertype: any;
  foldername:any;

  constructor(
    private _location: Location,
    private provider_servicesobj: ProviderServices,
    private activated_route: ActivatedRoute,
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.foldertype = params.foldername;
      this.foldername =  this.foldertype + ' ' + 'folder';
    });
  }

  ngOnInit() {
    this.getfiles();
  }

  getfiles() {
    const filter = {};
    console.log(this.foldertype);
    if (this.foldertype === 'private') {
      filter['folderName-eq'] = 'private';
    }
    else {
      filter['folderName-eq'] ='public';

    }

  console.log(filter);
    this.provider_servicesobj.getAllFilterAttachments(filter).subscribe(
    (data: any) => {
      console.log(data);
      // this.Allfiles = data;
      this.customers = data
    }
  );


  }

onCancel() {

  this._location.back();

}

}
