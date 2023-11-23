import { Observable, of } from "rxjs";

export class BackendBaseService {

  private ipAddress: string = 'localhost';
  private backendPort: string = '8081';
  private baseURL: string = `https://${this.ipAddress}:${this.backendPort}`;
  eventsUrl = `${this.baseURL}/event`;
  messagesUrl = `${this.baseURL}/message`;
  websocketURL = `wss://${this.ipAddress}:${this.backendPort}/socket/test`;
  userUrl = `${this.baseURL}/users`;
  rootUrl = `${this.baseURL}/authentication`;
  memeUrl = `${this.baseURL}/meme`
  
  constructor(){}

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation);
      console.error(error);
      return of(result as T);
    }
  }
}
