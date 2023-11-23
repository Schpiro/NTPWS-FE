import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventService} from '../../service/event.service';
import {Event} from '../../model/event.model';
import {WebsocketService} from "../../service/websocket.service";
import {WebSocketMessage} from "../../model/web-socket-message.model";
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html'
})
export class EventComponent implements OnInit {
  @Output() selectedEvent: Event | undefined;
  @Output() webSocketMessage = new EventEmitter<WebSocketMessage>();
  @Input() filterDate?: any;
  events?: Event[];
  admin!: boolean;

  constructor(
    private eventService: EventService,
    private webSocketService: WebsocketService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.getEvents();
    this.webSocketService.webSocketMessage.subscribe(x => this.appendMessage(x))
    this.filterDate = new Date().toISOString().slice(0,19)
    if (this.authenticationService.isUserAdmin()){
      this.admin = true
    } else {
      this.admin = false
    }
  }

  getEvents(): void {
    this.eventService.getEvents()
      .subscribe(events => this.events = events.sort((a:Event,b:Event) => this.compare(a,b)))
  }

  sendMessage(event: WebSocketMessage) {
    this.webSocketService.sendMessage(event);
  }

  compare(a: Event, b: Event): number{
    if (a.date > b.date) {
      return 1;
    }

    if (a.date < b.date) {
      return -1;
    }

    return 0;
  }

  appendMessage(webSocketMessage: WebSocketMessage): void {
    console.log(webSocketMessage)
    if (webSocketMessage.type === "NEW_EVENT") this.events?.push(<Event>webSocketMessage.payload);
    if (webSocketMessage.type === "DELETE_EVENT") this.events = this.events?.filter(item => item !== <Event>webSocketMessage.payload);
  }

  formatDate(isoDateString: string): string{
    let isoDate = new Date(isoDateString);
    return isoDate.getFullYear().toString() + `-`
      + ('0' + (isoDate.getMonth()+1).toString()).slice(-2) + `-`
      + ('0' + isoDate.getDate().toString()).slice(-2) + ` `
      + ('0' + isoDate.getHours()).slice(-2) + `:`
      + ('0' + isoDate.getMinutes()).slice(-2) + `:`
      + ('0' + isoDate.getSeconds()).slice(-2);
  }

  deleteEvent(event: Event): void{
    this.eventService.deleteEvent(event.id);
    this.events = this.events?.filter(eventInArray => eventInArray !== event)
    this.webSocketMessage.emit({type:"DELETE_EVENT",payload:event,recipientIds:undefined,senderId: undefined,senderName:undefined})
  }
}
