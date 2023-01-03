import { Component, OnInit } from "@angular/core";
import { Router, NavigationExtras } from "@angular/router";
import { Location } from "@angular/common";
import { WordProcessor } from "../../../../shared/services/word-processor.service";
import { ActivatedRoute } from "@angular/router";
import { ProviderServices } from "../../../../business/services/provider-services.service";
import { projectConstantsLocal } from "../../../../shared/constants/project-constants";

@Component({
  selector: "app-folders",
  templateUrl: "./folders.component.html",
  styleUrls: ["./folders.component.css"]
})
export class FoldersComponent implements OnInit {
  sharedFolder: any;
  isHealthCare = false;
  customer_label = "";
  provider_label = "";
  foldername: any;
  searchTerm: any;
  dataLoading = false;
  driveFiles: any[] = [];
  p: number = 1;
  config: any;
  count: number = 0;
  apiloading = false;
  pagination: any = {
    startpageval: 1,
    totalCnt: this.driveFiles.length,
    perPage: 3
  };
  filter = {
    page_count: projectConstantsLocal.PERPAGING_LIMIT,
    page: 1
  };
  constructor(
    private router: Router,
    private activated_route: ActivatedRoute,
    private provider_servicesobj: ProviderServices,
    public location: Location,
    private wordProcessor: WordProcessor
  ) {
    this.activated_route.queryParams.subscribe(params => {
      this.foldername = params.foldername;
    });
    this.customer_label = this.wordProcessor.getTerminologyTerm("customer");
    this.provider_label = this.wordProcessor.getTerminologyTerm("provider");
    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.driveFiles.length
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
  }
  ngOnInit(): void {
    this.getfiles();
  }
  goBack() {
    this.location.back();
  }
  getfiles() {
    this.dataLoading = true;
    const filter = {};
    console.log("Folder Type :", this.foldername);
    if (this.foldername === "public") {
      filter["folderName-eq"] = "public";
      this.foldername = "public";
    } else {
      filter["folderName-eq"] = "shared";
      this.foldername = "shared";
    }
    console.log(filter);
    this.provider_servicesobj
      .getAllFilterAttachments(filter)
      .subscribe((data: any) => {
         //console.log("All Files.", Object.keys(data));
        // this.driveFiles = Object.keys(data);
        // console.log("Drive :",this.driveFiles)

        Object.keys(data).map((res: any) => {
          // console.log("Key edited :",res)

          // res.map((ress)=>{
          // console.log("Files in folder :",data[res].files)
          // console.log("folderName :",data[res].folderName)
          // console.log("refolderSize :",data[res].folderSize)
          this.driveFiles.unshift({
            id: res,
            folderName: data[res].folderName,
            folderSize: data[res].folderSize
          });
          //})
           // console.log("Data map:",this.driveFiles)
        });

        this.dataLoading = false;
      });
  }
  folderCliked(folderId, folderFilename) {
    // console.log("Folder and Name:",folderId, folderFilename)
    //this.sharedFolder = foldername;
    const navigationExtras: NavigationExtras = {
      queryParams: {
        folderId: folderId,
        foldername: this.foldername,
        folder: folderFilename ? folderFilename : folderId
      }
    };
    this.router.navigate(
      ["provider", "drive", "folderfiles"],
      navigationExtras
    );
  }

  getFileSize(fileSize) {
    if(fileSize){
      return Math.round(fileSize);
    }
  }
}
