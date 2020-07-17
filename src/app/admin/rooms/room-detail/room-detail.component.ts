import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from '../../../model/Room';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data/data.service';

@Component({
  selector: 'app-room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {
  @Output()
  dataChangedEvent = new EventEmitter();
  @Input()
  room: Room;
  message = '';

  constructor(private dataService: DataService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  editRoom() {
    this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'edit', id: this.room.id}});
  }

  deleteRoom() {
    const result = confirm('Are you sure you want to delete this room?');
    if (result) {
      this.message = 'Deleting...';
      this.dataService.deleteRoom(this.room.id).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms']);
        }, error => {
          this.message = 'Sorry - this room cannot be deleted at this time';
        }
      );
    }
  }

}
