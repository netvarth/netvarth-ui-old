import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl} from '@angular/forms';
import * as ClassicEditor from '../../../assets/ckeditor/build/ckeditor';
@Component({
    selector: 'app-template3',
    templateUrl: './template3.component.html',
    styleUrls: ['./template3.component.css']
  })
  export class Template3Component implements OnInit{
  public imagearray1=['../../assets/images/download.jpg','../../assets/images/download.jpg','../../assets/images/download.jpg'];

    public array=["../../../assets/templateimages/meeting_Artboard (1).png","../../../assets/templateimages/jaldeevideo.34da709d24c020f7f0f4 (1).jpg","../../../assets/templateimages/b5757a2eed2300820433e4083ae635c2.jpg","../../../assets/templateimages/meeting_Artboard (1).png","../../../assets/templateimages/jaldeevideo.34da709d24c020f7f0f4 (1).jpg","../../../assets/templateimages/meeting_Artboard (1).png"];
  public departments=['healthcare','clinic','dental','medical','ortho','babydocktor'];
 
    public publishvaraible=false;
    public Editor = ClassicEditor;
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
    ngOnInit(): void {
      this.templateForm = this.fb.group({
        headtitle:new FormControl('Welcome to hawks hospital'),
        headdescription1:new FormControl('Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod corporis harum alias repellendus nisi sequi amet. '),
        headdescription2:new FormControl('  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente hic numquam soluta quia ullam temporibus molestias nisi nobis architecto! Nulla quae aut cupiditate corporis reprehenderit distinctio neque suscipit asperiores odio.'),
        headimage1:new FormControl('../../../assets/templateimages/ashkan-forouzani-DPEPYPBZpB8-unsplash (1).jpg'),
        headimage2:new FormControl('../../../assets/templateimages/brian-mercado-rm7rZYdl3rY-unsplash.png'),
        headimage3:new FormControl('../../../assets/templateimages/bruno-rodrigues-279xIHymPYY-unsplash.jpg'),
        section1description:new FormControl('  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente hic numquam soluta quia ullam temporibus molestias nisi nobis architecto! Nulla quae aut cupiditate corporis reprehenderit distinctio neque suscipit asperiores odio.'),
        section2description:new FormControl('  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente hic numquam soluta quia ullam temporibus molestias nisi nobis architecto! Nulla quae aut cupiditate corporis reprehenderit distinctio neque suscipit asperiores odio.'),
        newsFeeds:this.fb.array([])

        })
    }
    
    constructor(private fb: FormBuilder){}
    publishTemplate() {
      this.publishvaraible=true;
    }
    edit() {
      this.publishvaraible=false;
    }
    selectFile(event, i) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0]
        var reader = new FileReader();
        reader.onload = (event: any) => {
          if(i==1){
          this.templateForm.value.headimage1 =  event.target.result;
          } else if(i==2) {
          this.templateForm.value.headimage2 =  event.target.result;
          } else{
          this.templateForm.value.headimage3 =  event.target.result;
            
          }
        }
        reader.readAsDataURL(file); 
      }
    }
  }