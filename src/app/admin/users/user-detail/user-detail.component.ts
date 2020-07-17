import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../../../model/User';
import {DataService} from '../../../services/data/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  @Output()
  dataChangedEvent = new EventEmitter();
  @Input()
  user: User;
  message = '';

  constructor(private dataService: DataService,
              private router: Router) {

  }

  ngOnInit(): void {
  }

  editUser() {
    this.router.navigate(['admin', 'users'], {queryParams: {action: 'edit', id: this.user.id}});
  }

  deleteUser() {
    const result = confirm('Are you sure you want to delete this user?');
    if (result) {
      this.message = 'Deleting...';
      this.dataService.deleteUser(this.user.id).subscribe(
        next => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'users']);
        },
        error => this.message = 'Sorry, this user cannot be deleted'
      );
    }
  }

  resetPassword() {
    const result = confirm('Are you sure you want to reset the password?');
    if (result) {
      this.message = 'Reseting Password...';
      this.dataService.resetUserPassword(this.user.id).subscribe(
        next => this.message = 'The password has been reset',
        error => this.message = 'Sorry the password cannot be reset'
      );
    }
  }

}
