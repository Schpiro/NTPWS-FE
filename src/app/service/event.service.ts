import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import { Event } from '../model/event.model';
import {Comment} from "../model/comment.model";
import {BackendBaseService} from "./backend-base.service";

@Injectable({
  providedIn: 'root'
})
export class EventService extends BackendBaseService{

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
    super();
  }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl)
      .pipe(
        tap(_ => console.log('fetched Events')),
        catchError(this.handleError<Event[]>('getEvents', []))
      );
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(this.eventsUrl,event,this.httpOptions)
      .pipe(
        tap((newEvent: Event) => console.log(`Sucesfully created event: ${newEvent}`)),
        catchError(this.handleError<Event>('createEvent'))
      )
  }

  deleteEvent(id: number): void {
    console.log("attempt to delete")
    this.http.delete<void>(this.eventsUrl+'/'+id)
      .subscribe(
      () => console.log('Delete successful'),
      error => console.error('Error deleting item:', error)
    );
  }

  getEventComments(code:number): Observable<Comment[]>{
    const url = `${this.eventsUrl}/comments/${code}`;
    return this.http.get<Comment[]>(url)
      .pipe(
        tap(_ => console.log('fetched Comments')),
        catchError(this.handleError<Comment[]>('getEventComments', []))
      );
  }

  createComment(comment: Comment, code: number): Observable<Comment> {
    const url = `${this.eventsUrl}/comments/${code}`;
    return this.http.post<Comment>(url,comment,this.httpOptions)
      .pipe(
        tap((newComment: Comment) => console.log(`Sucesfully created comment: ${newComment}`)),
        catchError(this.handleError<Comment>('createComment'))
      )
  }
}
