import { ViewChild, OnInit, OnDestroy, ElementRef, Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwilioService } from '../../services/twilio-service';
import { projectConstantsLocal } from '../../constants/project-constants';
// import { ServiceMeta } from '../../services/service-meta';
// import { projectConstantsLocal } from '../../constants/project-constants';
@Component({
    selector: 'app-live-chat-client',
    templateUrl: './twilio-live-client.component.html'
})
export class LiveChatClientComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('localVideo', { static: false }) localVideo: ElementRef;
    @ViewChild('remoteVideo', { static: false }) remoteVideo: ElementRef;
    room_name;
    access_tokan;
    app_id;
    constructor(
        private router: Router,
        // private route: ActivatedRoute,
        // private httpService: ServiceMeta,
        public twilioService: TwilioService,
        // private baCustomPreLoader: BaCustomPreLoader
    ) {
        if (navigator.getUserMedia) {
            console.log(navigator);
            navigator.getUserMedia({ audio: false, video: true  }, function (stream) {
                }, function (error) {
                    console.log(error.name + ': ' + error.message);
                });
            // navigator.getUserMedia({ audio: false, video: true  }, function (stream) {
            // }, function (error) {
            //     console.log(error.name + ': ' + error.message);
            // });
        } else if (navigator.vendor.match(/[Aa]+pple/g) && navigator.vendor.match(/[Aa]+pple/g).length > 0) {
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                .then(function () { })
                .catch(function (error) {
                    console.log(error.name + ': ' + error.message);
                });
        }
        // this.baCustomPreLoader.show();
        // this.route.params.subscribe(params => {
        //     this.app_id = params['id'];
        //     const body = {
        //         bookingId: this.app_id
        //     };
        //     this.httpService.getData('/twilio/getToken', body).subscribe(res => {
        //         if (res.statusCode === 200) {
        //             this.room_name = res.data.roomName;
        //             this.access_tokan = res.data.accessToken;
        //             this.connect();
        //         }
        //     }, (error) => {
        //         alert(error.message);
        //     });
        // });
        window.addEventListener('unload', () => {
            this.disconnect();
        });
    }
    ngAfterViewInit() {
        console.log(this.localVideo);
        console.log(this.remoteVideo);
        this.twilioService.localVideo = this.localVideo;
        this.twilioService.remoteVideo = this.remoteVideo;
        this.connect();
    }
    ngOnInit() {

    }
    disconnect() {
        if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
            this.twilioService.roomObj.disconnect();
            this.twilioService.roomObj = null;
        } else {
            this.router.navigate(['thanks']);
        }
    }
    connect() {
        // const AccesToken = twilio.AccessToken;
        // const VideoGrant = AccesToken.VideoGrant;

        // Substitute your Twilio AccountSid and ApiKey details
        // const ACCOUNT_SID = 'SK485e26d81902b307dfae844cb9c83ec7';
        // const API_KEY_SID = 'mani';
        // const API_KEY_SECRET = 'J9QrKkWUTBgGMMUmnqwDqQFHZ5ifHqTQ';

        // // Create an Access Token
        // const access_Token = new AccesToken(
        //   ACCOUNT_SID,
        //   API_KEY_SID,
        //   API_KEY_SECRET
        // );
        // // // Set the Identity of this token
        // access_Token.identity = 'mani';

        // // // Grant access to Video
        // const grant = new VideoGrant();
        // grant.room = 'cool room';
        // access_Token.addGrant(grant);

        // // // Serialize the token as a JWT
        // const jwt = access_Token.toJwt();
        // console.log(jwt);


        // const accessToken = projectConstants.TWILIO_ACCESSTOKEN;
        this.twilioService.connectToRoom(projectConstantsLocal.TWILIO_ACCESSTOKEN, {
            name: 'mm',
            // name: 'Mani',
            audio: true,
            video: { height: 720, frameRate: 24, width: 1280 },
            bandwidthProfile: {
                video: {
                    mode: 'collaboration',
                    renderDimensions: {
                        high: { height: 1080, width: 1980 },
                        standard: { height: 720, width: 1280 },
                        low: { height: 176, width: 144 }
                    }
                }
            },
        });
    }
    mute() { this.twilioService.mute(); }
    unmute() { this.twilioService.unmute(); }
    ngOnDestroy() { this.disconnect(); }
}
