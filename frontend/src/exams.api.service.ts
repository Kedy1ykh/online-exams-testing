import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from './app/env';
import { Exam } from './exam.model';
import * as Auth0 from 'auth0-web';

@Injectable({
    providedIn: 'root',
})
export class ExamApiService {
    constructor(private http: HttpClient){}

    private _handleError<T>(operation = 'operation') {
        return (error: HttpErrorResponse | any): Observable<T> => {
            console.error(error.message || "Error: Unable to complete request")
            return of(error);
        }
    }

    getExams(): Observable<any> {
        return this.http.get(`${API_URL}/exams`).pipe(catchError(this._handleError<Exam[]>('getExams')));
    }

    saveExam(exam: Exam): Observable<any> {
        const httpOption = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${Auth0.getAccessToken()}`
            })
        };
        return this.http.post(`${API_URL}/exams`, exam, httpOption);
    } 
}
