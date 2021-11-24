import { Injectable } from "@angular/core";
import { ServiceMeta } from "../shared/services/service-meta";

@Injectable({
    providedIn: 'root'
})
export class CustomTemplatesService {

    constructor(private serviceMeta: ServiceMeta) {

    }
    getPresignedUrls() {
        const url = 'provider/preSign';
        return this.serviceMeta.httpPut(url);
    }
    extractFilesToUIS3() {
        const url = 'provider/preSign/copy/s3';
        return this.serviceMeta.httpGet(url);
    }
    uploadFilesToS3(url, file) {
        return this.serviceMeta.httpPut(url, file);
    }
    getTemplateJson(url) {
        const _this = this;
        return new Promise((resolve) => {
          _this.serviceMeta.httpGet(url).subscribe(
            (template: any) => {
              resolve(template);
            }, () => {
              resolve(false);
            });
        });
      }
    getTemplateUploadUrl() {
        const _this = this;
        return new Promise((resolve) => {
            _this.getPresignedUrls().subscribe(
                (urls) => {
                    console.log(urls);
                    resolve(urls['templateUrl']);
                }, () => {
                    resolve(false);
                }
            );
        });

    }
    publish(templateJson) {
        console.log("in publish");
        console.log(templateJson);
        this.getTemplateUploadUrl().then(
            (url) => {
                if (url) {
                    let templateFile = new File([JSON.stringify(templateJson)], 'template', { type: 'application/json', lastModified: Date.now() });
                    this.uploadFilesToS3(url, templateFile).subscribe(
                        () => {
                            this.extractFilesToUIS3().subscribe(
                                (status) => {
                                    console.log(status);
                                }
                            )
                        }
                    )
                }
            }
        );
    }
}