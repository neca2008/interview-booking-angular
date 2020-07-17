import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {User} from '../../../model/User';
import {DataService} from '../../../services/data/data.service';
import {Router} from '@angular/router';
import {FormResetService} from '../../../services/form-reset/form-reset.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {
  @Output()
  dataChangedEvent = new EventEmitter();
  @Input()
  user: User;
  formUser: User;

  message: string;
  password: string;
  password2: string;
  nameIsValid: boolean;
  passwordsMatch: boolean;
  passwordsAreValid: boolean;

  userResetSubscription: Subscription;

  constructor(private dataService: DataService,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.userResetSubscription = this.formResetService.resetUserFormEvent.subscribe(
      user => {
        this.user = user;
        this.initializeForm();
      });
  }

  initializeForm() {
    this.formUser = Object.assign({}, this.user);
    this.checkIfNameIsValid();
    this.checkIfPasswordsMatch();
  }

  ngOnDestroy(): void {
    this.userResetSubscription.unsubscribe();
  }

  onSubmit() {

    if (this.formUser.id == null) {
      this.dataService.addUser(this.formUser, this.password).subscribe(
        (user) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'users'], {queryParams: {action: 'view', id: user.id}});
        }
      );
    } else {
      this.dataService.updateUser(this.formUser).subscribe(
        (user) => {
          this.dataChangedEvent.emit();
          this.router.navigate(['admin', 'users'], {queryParams: {action: 'view', id: user.id}});
        },
        error => this.message = 'something went wrong , please try again'
      );
    }
  }

  checkIfNameIsValid() {
    if (this.formUser.name) {
      this.nameIsValid = this.formUser.name.trim().length > 0;
      this.passwordsMatch = true;
      this.passwordsAreValid = true;
    }
  }

  checkIfPasswordsMatch() {
    if (this.formUser.id != null) {
      this.passwordsAreValid = true;
      this.passwordsMatch = true;
    } else {
      if (this.password) {
        this.passwordsMatch = this.password === this.password2;
        this.passwordsAreValid = this.password.trim().length > 0;
      }
    }
  }
}
