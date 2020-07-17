import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Layout, LayoutCapacity, Room} from 'src/app/model/Room';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../services/data/data.service';
import {Router} from '@angular/router';
import {FormResetService} from '../../../services/form-reset/form-reset.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.css']
})
export class RoomEditComponent implements OnInit, OnDestroy {
  @Output()
  dataChangedEvent = new EventEmitter();
  @Input()
  room: Room;
  layouts = Object.keys(Layout);
  layoutEnum = Layout;
  roomForm: FormGroup;
  resetEventSubscription: Subscription;
  message = '';


  constructor(private dataService: DataService,
              private router: Router,
              private formBuilder: FormBuilder,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.initializeForm();

    this.resetEventSubscription = this.formResetService.resetRoomFormEvent.subscribe(
      room => {
        this.room = room;
        this.initializeForm();
      }
    );
  }

  ngOnDestroy(): void {
    this.resetEventSubscription.unsubscribe();
  }

  initializeForm() {
    this.roomForm = this.formBuilder.group(
      {
        roomName: [this.room.name, Validators.required],
        roomLocation: [this.room.location, [Validators.required, Validators.minLength(2)]]
      }
    );

    for (const layout of this.layouts) {
      const layoutCapacity = this.room.capacities.find(lc => lc.layout === Layout[layout]);
      const initialCapacity = layoutCapacity == null ? 0 : layoutCapacity.capacity;
      this.roomForm.addControl(`layout${layout}`, this.formBuilder.control(initialCapacity));
    }
  }

  onSubmit() {
    this.message = 'Saving...';
    this.room.name = this.roomForm.controls['roomName'].value;
    this.room.location = this.roomForm.controls['roomLocation'].value;
    this.room.capacities = new Array<LayoutCapacity>();
    for (const layout of this.layouts) {
      const layoutCapacity = new LayoutCapacity();
      layoutCapacity.layout = Layout[layout];
      layoutCapacity.capacity = this.roomForm.controls[`layout${layout}`].value;
      this.room.capacities.push(layoutCapacity);
    }

    if (this.room.id == null) {
      this.dataService.addRoom((this.room)).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'view', id: next.id}});
        },
        error => this.message = 'Something went wrong, you may wish to try again'
      );
    } else {
      this.dataService.updateRoom(this.room).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'rooms'], {queryParams: {action: 'view', id: next.id}});
        },
        error => this.message = 'Something went wrong, you may wish to try again'
      );
    }
  }

}
