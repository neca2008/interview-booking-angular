import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Room} from '../../model/Room';
import {Observable} from 'rxjs';
import {DataService} from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchRoomsService implements Resolve<Observable<Array<Room>>> {

  constructor(private dataService: DataService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<Array<Room>>> | Promise<Observable<Array<Room>>> | Observable<Array<Room>> {
    return this.dataService.getRooms();
  }
}
