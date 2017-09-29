import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  LastName = '';
  FirstName = '';
  EmailAddress = '';

  constructor(
    private userService: UserService
  ) { }


  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.userService.getUsers().subscribe(profile => {
      this.LastName = profile.user.LastName; // Set LastName
      this.FirstName = profile.user.FirstName; // Set FirstName
      this.EmailAddress = profile.user.EmailAddress; // Set EmailAddress
    });
  }

}