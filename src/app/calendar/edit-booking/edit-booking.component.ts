import {Component, OnInit} from '@angular/core';
import {Booking} from '../../model/Booking';
import {DataService} from '../../services/data/data.service';
import {Layout, Room} from '../../model/Room';
import {User} from '../../model/User';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-edit-booking',
  templateUrl: './edit-booking.component.html',
  styleUrls: ['./edit-booking.component.css']
})
export class EditBookingComponent implements OnInit {

  booking: Booking;
  rooms: Array<Room>;
  users: Array<User>;
  layouts = Object.keys(Layout);
  layoutEnum = Layout;
  dataLoaded = false;
  message = 'Please wait ...';

  constructor(private dataService: DataService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.rooms = this.route.snapshot.data['rooms'];
    this.users = this.route.snapshot.data['users'];
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.dataService.getBookingById(+id)
        .pipe(
          map(booking => {
            booking.room = this.rooms.find(room => room.id === booking.room.id);
            booking.user = this.users.find(user => user.id === booking.user.id);
            return booking;
          })
        )
        .subscribe(
          next => {
            this.booking = next;
            this.dataLoaded = true;
            this.message = '';
          }
        );
    } else {
      this.booking = new Booking();
      this.dataLoaded = true;
      this.message = '';

    }
  }

  onSubmit() {
    if (this.booking.id != null) {
      this.dataService.updateBooking(this.booking).subscribe(
        next => this.router.navigate(['']));
    } else {
      this.dataService.addBooking(this.booking).subscribe(
        next => this.router.navigate(['']));
    }
  }

}
