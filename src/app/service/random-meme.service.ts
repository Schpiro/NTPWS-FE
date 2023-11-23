import { Injectable, isDevMode } from '@angular/core';
import { BackendBaseService } from './backend-base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Meme } from '../model/meme.model';

@Injectable({
  providedIn: 'root'
})
export class RandomMemeService extends BackendBaseService {

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'X-Request-With'})
  };

  constructor(private http: HttpClient) {
    super();
  }

  getMeme(): Observable<Meme> {
    return this.http.get<Meme>(this.memeUrl)
      .pipe(
        tap(_ => console.log('fetched meme')),
        catchError(this.handleError<Meme>('getMeme'))
      );
  }

  
}
