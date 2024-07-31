import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
interface FileResponse {
  fileName: string;
  fileData: string;
}
@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(private api: ApiService,private http: HttpClient) {}
  //Upload Files

  uploadFile(file: File, etat: string, exercice: string, etablissement: string) {
     const url = `/api/upload`;
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('etat', etat);
    formData.append('exercice', exercice);
    formData.append('etablissement', etablissement);
    return this.api.post(url, formData);
    }
  //Generer CFT file

  generateFileFromExcels(ids: string[]) {
    const url = `/api/generateFiles`;
    return this.api.post(url, {bkamIds :ids});
  }


  generateFile(id: string): Observable<FileResponse> {
    const url = `http://localhost:8080/api/generateFile?id=${id}`;
    return this.http.get<FileResponse>(url);
  }
  //Gestion Axes

  deleteAxe(axeId: string): Observable<any> {
    const url = `/api/axe/${axeId}`;
    return this.api.delete(url);
  }
  updateAxe(axeId: string, updatedaxe: any): Observable<any> {
    const url = `/api/axe/${axeId}`;
    return this.api.put(url, updatedaxe);
  }
  addAxe(bkamId: string,axe: any): Observable<any> {
    const url = `/api/axe/${bkamId}`;
    return this.api.post(url, axe);
  }
  //gestion bkam

  getBkam(id: string): Observable<any> {
    const url = `/api/bkams?id=${id}`;
    return this.api.get(url);
  }
  getBkams(): Observable<any> {
    const url = `/api/bkams`;
    return this.api.get(url);
  }
}
