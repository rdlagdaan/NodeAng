import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  currentUrl;
  LastName;
  FirstName;
  EmailAddress;
  foundProfile = false;
  messageClass;
  message;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL parameters on page load
    // Service to get the public profile data
    this.userService.getUser(this.currentUrl.EmailAddress).subscribe(data => {
      // Check if user was found in database
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {
        this.LastName = data.user.LastName; // Save the LastName for use in HTML
        this.FirstName = data.user.FirstName; // Save the FirstName for use in HTML
        this.EmailAddress = data.user.EmailAddress; // Save the EmailAddress for use in HTML
        this.foundProfile = true; // Enable profile table
      }
    });
  }

}