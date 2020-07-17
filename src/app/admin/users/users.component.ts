import {Component, OnInit} from '@angular/core';
import {User} from '../../model/User';
import {DataService} from '../../services/data/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormResetService} from '../../services/form-reset/form-reset.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Array<User>;
  selectedUser: User;
  action: string;
  message = 'Loading data ... please wait';
  loadingData = true;
  reloadAttempts = 0;

  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private router: Router,
              private formResetService: FormResetService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataService.getUsers().subscribe(
      (usersData) => {
        this.users = usersData;
        this.loadingData = false;
        this.processUrlParams();
      }, error => {
        this.message = 'Sorry - something went wrong';
        this.reloadAttempts++;
        if (this.reloadAttempts <= 10) {
          this.loadData();
        } else {
          this.message = 'Sorry  - please contact support';
        }
      }
    );
  }

  processUrlParams() {
    this.route.queryParams.subscribe(
      (params) => {
        const id = params['id'];
        this.action = params['action'];
        if (id) {
          this.selectedUser = this.users.find(user => {
            return user.id === +id;
          });
        }
      }
    );
  }

  selectUser(id: number) {
    this.router.navigate(['admin', 'users'], {queryParams: {action: 'view', id: id}});
  }

  addUser() {
    this.selectedUser = new User();
    this.router.navigate(['admin', 'users'], {queryParams: {action: 'add'}});

    this.formResetService.resetUserFormEvent.emit(this.selectedUser);
  }

}
