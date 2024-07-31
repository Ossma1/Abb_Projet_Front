import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BkamService {
  constructor(private http: HttpClient,private api: ApiService) {}

  getAxesByBkamEntityId(bkamId: number): Observable<any> {
    const url = `/api/bkam/${bkamId}/axes`;
    return this.api.get(url);
  }
  getAnomalies(bkamId: number): Observable<any> {
    const url = `/api/bkam/${bkamId}/anomalies`;
    return this.api.get(url);
  }
  getCodeMappings(state: string): Observable<any> {
    const filePath = `assets/data/codeMapping${state}.json`;
    return this.http.get(filePath);
  }
   addAxe(bkamEntityId: number,axe : any,type?:String): Observable<any> {
    const url = `/api/bkam/${bkamEntityId}/axes?type=${type}`;
    return this.api.post(url, axe);
  }
  deleteAxe(bkamEntityId: number,axetId: string,type?:String): Observable<any> {
    const url = `/api/bkam/${bkamEntityId}/axes/${axetId}?type=${type}`;
    return this.api.delete(url);
  }
  saveData(bkamEntityId: number,type?: string): Observable<any> {
    const url = `/api/bkam/${bkamEntityId}/axes/save?type=${type}`;
    return this.api.get(url);
  }
}
