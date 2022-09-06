import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-recent-news',
  templateUrl: './recent-news.component.html',
  styleUrls: ['./recent-news.component.css']
})
export class RecentNewsComponent {
  @Input() newsFeeds: any = [];
  customOptions = {
    loop: true,
    margin: 10,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    //autoplay: true,
    navSpeed: 200,
    dots: true,
    center: true,
    checkVisible: false,
    // nav:true,
    // navText: [ '<i class="fa fa-caret-right"></i>', '<i class="fa fa-caret-left"></i>"' ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 2
      },
      700: {
        items: 2
      },
      970: {
        items: 2
      }
    }
  }
  constructor(
  ) { 
  }
  openNews(link) {
    window.open(link, "_system");
  }
}