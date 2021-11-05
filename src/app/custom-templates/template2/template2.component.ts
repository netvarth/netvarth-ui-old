import { Component, OnInit, ViewChild } from '@angular/core';
import {OwlCarousel} from 'ngx-owl-carousel';
import { FormBuilder,FormControl } from '@angular/forms';
import * as ClassicEditor from '../../../assets/ckeditor/build/ckeditor';
import { CustomTemplatesService } from '../custom-templates.service';
// import { HttpClient } from "@angular/common/http";
// import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.css']
})
export class Template2Component implements OnInit {
  public imagearray1=['../../assets/images/download.jpg','../../assets/images/download.jpg','../../assets/images/download.jpg'];

  public array=["../../../assets/templateimages/meeting_Artboard (1).png","../../../assets/templateimages/jaldeevideo.34da709d24c020f7f0f4 (1).jpg","../../../assets/templateimages/b5757a2eed2300820433e4083ae635c2.jpg","../../../assets/templateimages/meeting_Artboard (1).png","../../../assets/templateimages/jaldeevideo.34da709d24c020f7f0f4 (1).jpg","../../../assets/templateimages/meeting_Artboard (1).png"];
  public departments=['healthcare','clinic','dental','medical','ortho','babydocktor'];
  public SearchByDepartments="Search By Departments"
  public carouselOne;
  public publishvaraible=false;
  public Editor = ClassicEditor;
  templateJson: any;
  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'fontSize',
        'fontColor',
        'subscript',
        'superscript',
        '|',
        'alignment',
        'bulletedList',
        'numberedList',
        'indent',
        'outdent',
        'specialCharacters',
        '|',
        'link',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo'
      ]
    },
    colorButton_colors: '008000,454545,FFF',
    colorButton_enableMore: 'False',
    language: 'en',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
      ]
    },

  };
  templateForm: any;
  constructor(
    private fb: FormBuilder,
    private templateService: CustomTemplatesService) { 
    this.carouselOne = {
      dots: true,
      loop: true,
      autoplay: true,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1
        },
        992: {
          items: 3,
          center: true,
        }
      }
    };
  }
  @ViewChild('owlElement') owlElement: OwlCarousel

 
  preview() {
    this.publishvaraible=true;
  }
  fun() {
    this.owlElement.next([200])
    //duration 200ms
  }
  ngOnInit(): void {
    this.templateForm = this.fb.group({
      headerImage: new FormControl('../../../assets/templateimages/medical_good_team_hospital_staff_doctors_nurse_illustration_1284.jpg'),
      headhospitalName:new FormControl('Hawk Hospital'),
      headDoctorName:new FormControl('Dr.Krishnadas'),
      headlocation:new FormControl('Kodakara center'),
      headaboutusmessage:new FormControl('We care of you'),
      headerDescription: new FormControl('Diabatic ClinicAccident and trauma care unitAdvanced Center for orthopedics and spin surgery'),
      // iconssection:this.fb.array(['../../../assets/templateimages/Group_195-removebg-preview.png','../../../assets/templateimages/Untitled-1 (3).png','../../../assets/templateimages/Untitled-1.png','../../../assets/templateimages/Untitled-1 (2).png']),
      section1Title: new FormControl('Our Services'),
      section1Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section1Images: this.fb.array(['../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.png', '../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.png', '../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.png', '../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.png']),
      section2Title: new FormControl('Heading 3'),
      section2Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section2Image1: new FormControl('../../assets/images/download.jpg'),
      section3Title: new FormControl('Heading 4'),
      section3Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section4Title: new FormControl('Heading 5'),
      section4Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),

      // newsFeed: this.fb.array(['../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg'])
    })
  }
  setTemplateJson (template){
    this.templateJson['template'] = 'template2';
    this.templateJson['headerTitle'] = template.headerTitle;
    this.templateJson['headerDescription'] = template.headerDescription;
    this.templateJson['section1Title'] = template.section1Title;
    this.templateJson['section1Description'] = template.section1Description;
    this.templateJson['section2Title'] = template.section2Title;
    this.templateJson['section2Description'] = template.section2Description;
    this.templateJson['section3Title'] = template.section3Title;
    this.templateJson['section3Description'] = template.section3Description;
    this.templateJson['section4Title'] = template.section4Title;
    this.templateJson['section4Description'] = template.section4Description;
    this.templateJson['section5Title'] = template.section5Title;
    this.templateJson['section5Description'] = template.section5Description;
  }
  publishTemplate() {
    console.log('publishTemplate');
    console.log(this.templateForm.value);
    this.templateJson = {template: 'template2'};
    // this.setTemplateJson();
    // this.publishvarible = true;
    console.log("here");
    //here we should a rest url for save the templatejson
    this.templateService.publish(this.templateJson);
  }
  SearchByDepartment(departmentname) {
    this.SearchByDepartments=departmentname;
  }
 
}
