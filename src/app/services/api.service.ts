import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = "http://localhost:8080";
  }
  private setHeaders(headers?: any): HttpHeaders {
    let headersConfig = headers || {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    return new HttpHeaders(headersConfig);
  }
  private formatErrors(error: any) {
    return throwError(error);
  }
  post(uri: string, payload: Object = {}): Observable<any> {
    return this.http
        .post(`${this.ROOT_URL}${uri}`, payload, {
          headers: {
              'enctype': 'multipart/form-data'
          }})
        .pipe(catchError(this.formatErrors));
  }
  get(uri: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http
      .get(`${this.ROOT_URL}${uri}`, {
        headers: this.setHeaders(),
        params: params,
      })
      .pipe(catchError(this.formatErrors));
  }
  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}${uri}`);
  }
  put(path: string, body: Object = {}): Observable<any> {
    return this.http
      .put(`${this.ROOT_URL}${path}`, JSON.stringify(body), {
        headers: this.setHeaders(),
      })
      .pipe(catchError(this.formatErrors));
  }
}
