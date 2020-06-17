import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';

@Injectable()
export class ServiceMeta {
    constructor(private http: HttpClient) {}

    httpGet(url_path, header?, params?) {

        const options: any = {}; // Create a request option

        if (header) {
          const httpHeads = new HttpHeaders(header);
          options.headers = httpHeads;
        }

        if (params) {
          let httpParams = new HttpParams();
          Object.keys(params).forEach(function (key) {
              httpParams = httpParams.append(key, params[key]);

          });

          options.params = httpParams;
          options.showLoader = true;

        }
        return this.http.get(url_path, options);
    }
    httpGetText(url_path, header?, params?) {

      const options: any = {}; // Create a request option

      // if (header) {
      //   const httpHeads = new HttpHeaders(header);

        const  httpHeads = new HttpHeaders({
            'Accept': 'text/html, application/xhtml+xml, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
          });
          options.headers = httpHeads;
          options.responseType = 'Text';
      if (params) {
        let httpParams = new HttpParams();
        Object.keys(params).forEach(function (key) {
            httpParams = httpParams.append(key, params[key]);

        });

        options.params = httpParams;
        options.showLoader = true;

      }
      return this.http.get(url_path, options);
  }
    httpPost(url_path, body?, header?, params?) {
        // const bodyString = JSON.stringify(body); // Stringify payload
        const options: any = {}; // Create a request option

        if (header) {
          const httpHeads = new HttpHeaders(header);
           options.headers = httpHeads;
        }


        if (params) {
            let httpParams = new HttpParams();
            Object.keys(params).forEach(function (key) {
                httpParams = httpParams.append(key, params[key]);

            });

          options.params = httpParams;
        }
        return this.http.post(url_path, body, options); // ...using post request

    }

    httpPatch(url_path, body?, header?, params?) {

              const bodyString = JSON.stringify(body); // Stringify payload
              const options: any = {}; // Create a request option

              if (header) {
                const httpHeads = new HttpHeaders(header);
                options.headers = httpHeads;
              }


              if (params) {
                  let httpParams = new HttpParams();
                  Object.keys(params).forEach(function (key) {
                      httpParams = httpParams.append(key, params[key]);

                  });

                options.params = httpParams;
              }
              return this.http.patch(url_path, body, options); // ...using patch request

    }

    httpPut(url_path, body?, header?, params?) {

        const bodyString = JSON.stringify(body); // Stringify payload
        const options: any = {}; // Create a request option

        if (header) {
          const httpHeads = new HttpHeaders(header);
          options.headers = httpHeads;
        }


        if (params) {
            let httpParams = new HttpParams();
            Object.keys(params).forEach(function (key) {
                httpParams = httpParams.append(key, params[key]);

            });

          options.params = httpParams;
        }
        return this.http.put(url_path, body, options); // ...using put request

    }

    httpDelete(url_path, header?, params?) {
        const options: any = {}; // Create a request option

        if (header) {
          const httpHeads = new HttpHeaders(header);
          options.headers = httpHeads;
        }


        if (params) {
            let httpParams = new HttpParams();
            Object.keys(params).forEach(function (key) {
                httpParams = httpParams.append(key, params[key]);

            });

          options.params = httpParams;
        }
        return this.http.delete(url_path, options);

    }


}
