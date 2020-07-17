import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../model/User';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {DataService} from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class PrefetchUsersService implements Resolve<Observable<Array<User>>> {

  constructor(private dataService: DataService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<Array<User>>> | Promise<Observable<Array<User>>> | Observable<Array<User>> {
    return this.dataService.getUsers();
  }
}
