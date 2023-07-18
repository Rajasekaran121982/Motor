import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class FileUploadService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post('http://localhost:3000/api/upload', formData, { responseType: 'text' }).pipe(
         // Extract the URL string from the response
        catchError((error: HttpErrorResponse) => {
          console.error('Upload error:', error);
          return throwError('Upload error occurred.');
        })
      );
  }
}
