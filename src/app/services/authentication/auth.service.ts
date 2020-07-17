import {EventEmitter, Injectable} from '@angular/core';
import {DataService} from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAutheticated = false;
  authenticationResultEvent = new EventEmitter<boolean>();

  constructor(private dataService: DataService) {
  }

  authenticate(name: string, password: string): boolean {
    this.dataService.validateUser(name, password).subscribe(
      next => {
        this.isAutheticated = true;
        this.authenticationResultEvent.emit(true);
      }, error => {
        this.isAutheticated = false;
        this.authenticationResultEvent.emit(false);

      }
    );
    return this.isAutheticated;
  }
}
