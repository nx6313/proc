import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EventsService } from './events-service';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpService {
  myInfoLocal: any;
  local: Storage;
  constructor(
    private http: Http,
    private events: EventsService) {
  }

  public makePost(url: string, body: any) {
    console.log(url);
    console.log(body);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, body, options).timeout(10 * 1000).toPromise()
      .then(res => res.json())
      .catch(err => {
        this.handleError(err, url, body);
      });
  }

  private handleError(error: Response, url: string = '', body: any = null) {
    console.log('访问异常 ~ ', error);
    if (url != '') {
      console.log('访问url：' + url);
    }
    if (body != null) {
      console.log('访问参数：' + JSON.stringify(body));
    }
    this.events.getEvent().publish('local:request_error', { error: '' });
    return Observable.throw(error || 'Server Error');
  }
}
