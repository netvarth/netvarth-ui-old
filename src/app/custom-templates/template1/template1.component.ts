import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ProviderServices } from '../../business/services/provider-services.service';
import * as ClassicEditor from '../../../assets/ckeditor/build/ckeditor';
import { projectConstantsLocal } from '../../shared/constants/project-constants';
import { CustomTemplatesService } from '../custom-templates.service';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class Template1Component implements OnInit {
  templateForm: any;
  public Editor = ClassicEditor;
  // editorConfig;
  editorConfig = {
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
        'undo',
        'redo'
      ]
    },
    colorButton_colors: '008000,454545,FFF',
    colorButton_enableMore: 'False',
    language: 'en',
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
  customOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    },
    nav: true
  };
  templateJson: any;
  public loader = false;
  public publishvarible = false;
  // private imagearray = ['../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg'];
  public imagearray1 = ['../../assets/images/download.jpg', '../../assets/images/download.jpg', '../../assets/images/download.jpg'];
  states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware'];
  public data: any = []
  resultJson: any;
  loading = true;
  showSection3=true;
  showSection4=true;
  constructor(private fb: FormBuilder,
    private providerServices: ProviderServices,
    private templateService: CustomTemplatesService) {
  }
  setTemplateValues(template) {
    console.log('setTemplateValues');
    console.log(template);
    // this.showSection3 = template.showSection3?true:false;
    // this.showSection4 = template.showSection4?true:false;
    this.templateForm.patchValue({
      // headerImage: template.headerImage,
      headerTitle: template.headerTitle,
      headerDescription: template.headerDescription,
      section1Title: template.section1Title,
      section1Description: template.section1Description,
      section1Images: template.section1Images,
      section2Title: template.section2Title,
      section2Description: template.section2Description,
      // section2Image: template.section2Image,
      section3Title: template.section3Title, 
      section3Description: template.section3Description,
      section4Title: template.section4Title,
      section4Description: template.section4Description,
      section5Title: template.section5Title,
      section5Description: template.section5Description,
      // newsFeeds: this.setNewsFeeds(template.newsFeeds)
    });
  }
  ngOnInit(): void {
    this.templateForm = this.fb.group({
      // headerImage: new FormControl('../../../assets/templateimages/Haw.jpg'),
      headerTitle: new FormControl('Welcome to Hawk hospital'),
      headerDescription: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section1Title: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
      section1Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section1Images: this.fb.array(['../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.jpg', '../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.jpg', '../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.jpg', '../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.jpg']),
      section2Title: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
      section2Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      // section2Image: new FormControl('../../../assets/templateimages/bg.jpg'),
      section3Title: false,
      section3Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section4Title: new FormControl('Our Doctors'),
      section4Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      section5Title: new FormControl('Recent News'),
      section5Description: new FormControl('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam eu sem tempor, varius quam at, luctus dui. Mauris magna metus, dapibus nec turpis vel, semper malesuada ante. Idac bibendum scelerisque non non purus. Suspendisse varius nibh non aliquet.'),
      // newsFeeds: this.fb.array([])
    })
    this.loader = true;
    this.providerServices.getBussinessProfile()
      .subscribe(res => {
        const bProfile = res;
        const url = projectConstantsLocal.UIS3PATH + bProfile["uniqueId"] + "/template.json?" + new Date();
        console.log(url);
        this.templateService.getTemplateJson(url).then(
          (template) => {
            if (template) {
              if (template['template'] === 'template1') {
                this.templateJson = template;
                this.setTemplateValues(template);
              } else {
                this.templateJson = {
                  template: 'template1',
                  headerImage : '../../assets/images/download.jpg',
                  section2Image: '../../assets/images/download.jpg'
                };
              }
              this.loading = false;
            } else {
              this.addNewsFeed();
            }
          }, () => {
            this.templateJson = {};
            this.loading = false;
          }
        )
      });
    console.log('json working', this.data)
    // })
  }

  setNewsFeeds(newsFeeds) {
    newsFeeds.slice().reverse().forEach(y => {
      this.templateForm.get('newsFeeds').push(
        this.fb.group({
          image: y.image,
          title: y.title,
          description: y.description
        })
      );
    });
  }
  addNewsFeed() {
    this.templateForm.get('newsFeeds').push(this.createNewsFeed());
  }
  createNewsFeed(): FormGroup {
    return this.fb.group({
      image: '../../assets/images/download.jpg',
      title: 'News Feed',
      description: 'Feed Description'
    })
  }
  edit() {
    this.publishvarible = false;
  }

  setTemplateJson(template) {
    this.templateJson['headerTitle'] = template.headerTitle;
    this.templateJson['headerDescription'] = template.headerDescription;
    this.templateJson['section1Title'] = template.section1Title;
    this.templateJson['section1Images'] = template.section1Images;
    this.templateJson['section1Description'] = template.section1Description;
    this.templateJson['section2Title'] = template.section2Title;
    this.templateJson['section2Description'] = template.section2Description;
    this.templateJson['section3Title'] = template.section3Title;
    this.templateJson['section3Description'] = template.section3Description;
    this.templateJson['section4Title'] = template.section4Title;
    this.templateJson['section4Description'] = template.section4Description;
    this.templateJson['section5Title'] = template.section5Title;
    this.templateJson['section5Description'] = template.section5Description;
    this.templateJson['showSection3'] = this.showSection3;
    this.templateJson['showSection4'] = this.showSection4;
  }


  publishTemplate() {
    console.log('publishTemplate');
    console.log(this.templateForm.value);
    this.setTemplateJson(this.templateForm.value);
    this.publishvarible = true;
    console.log("here");
    console.log(this.templateJson);
    //here we should a rest url for save the templatejson
    this.templateService.publish(this.templateJson);
  }
  selectFile(event, i, j) {
    console.log('i==================', i, "j=========", j);
    if (event.target.files.length > 0) {
      const file = event.target.files[0]
      var reader = new FileReader();
      reader.onload = (event: any) => {
        if (i === "headimage") {
          // this.templateForm.value.headerImage = event.target.result;
          this.templateJson['headerImage'] = event.target.result;
        } else if (i === "section2Image") {
          // this.templateForm.value.section2Image = event.target.result;
          this.templateJson['section2Image'] = event.target.result;
        } else if (i === "newsfeed") {
          this.templateForm.value.newsfeeds[j].image = event.target.result;
        } else {
          this.templateForm.value.section1Images[i] = event.target.result;
        }
      }
      reader.readAsDataURL(file);
    }
  }
}
