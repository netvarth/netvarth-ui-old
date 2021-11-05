import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-custom-templates',
    templateUrl: './custom-templates.component.html',
    styleUrls: ['./custom-templates.component.css']
})
export class CustomTemplatesComponent implements OnInit{
    templates = [
        {
            'name': 'template1',
            'preview': '../../assets/images/download.jpg'
        },
        {
            'name': 'template2',
            'preview': '../../assets/images/download.jpg'
        },
        {
            'name': 'template3',
            'preview': '../../assets/images/download.jpg'
        }
    ]

    constructor(
        private router: Router
    ) {

    }
    ngOnInit(): void {
        
    }
    editTemplate(template){
        this.router.navigate(['provider', 'settings', 'general', 'templates', template.name])
    }
}
