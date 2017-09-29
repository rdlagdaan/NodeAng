import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import {BLUE, RED} from "../../constants";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  message;
  messageClass;
  processing = false;
  emailAddressValid;
  emailAddressMessage;

 
  text = "Type your Search"; //INTERPOLATION

  @Input('placeholder')
  textInput = "Type your Search";

  @Input()
  color: string;

  clear(input) {
    console.log("Clear...clicked");
    input.value = '';
  }



  @Output("color")
  colorOutput = new EventEmitter();

  choose(color) {
    console.log(color);
    this.colorOutput.emit(color);
  }

  reset() {
    this.colorOutput.emit('black');
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.createForm(); // Create Angular 2 Form when component loads
  }

  // Function to create registration form
  createForm() {
    this.form = this.formBuilder.group({
      // Email Input
      EmailAddress: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30), // Maximum length is 30 characters
        this.validateEmailAddress // Custom validation
      ])],
      // LastName Input
      LastName: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(50), // Maximum length is 15 characters
        this.validateLastName // Custom validation
      ])],

      // FirtsName Input
      FirstName: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(50), // Maximum length is 15 characters
        this.validateFirstName // Custom validation
      ])],


      // Password Input
      Password: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        this.validatePassword // Custom validation
      ])],
      
      //Gender radio button
      Gender: ['', Validators.required],

      // Confirm Password Input
      Confirm: ['', Validators.required] // Field is required
    }, { validator: this.matchingPasswords('Password', 'Confirm') }); // Add custom validator to form for matching passwords
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['EmailAddress'].disable();
    this.form.controls['LastName'].disable();
    this.form.controls['FirstName'].disable();
    this.form.controls['BirthDate'].disable();
    this.form.controls['Gender'].disable();
    this.form.controls['Password'].disable();
    this.form.controls['Confirm'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['EmailAddress'].enable();
    this.form.controls['LastName'].enable();
    this.form.controls['FirstName'].enable();
    this.form.controls['BirthDate'].enable();
    this.form.controls['Gender'].enable();
    this.form.controls['Password'].enable();
    this.form.controls['Confirm'].enable();
  }

  // Function to validate EmailAddress is proper format
  validateEmailAddress(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test EmailAddress against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid EmailAddress
    } else {
      return { 'validateEmailAddress': true } // Return as invalid EmailAddress
    }
  }

  // Function to validate LastName is proper format
  validateLastName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test LastName against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid LastName
    } else {
      return { 'validateLastName': true } // Return as invalid LastName
    }
  }


  // Function to validate FirstName is proper format
  validateFirstName(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test FirstName against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid FirstName
    } else {
      return { 'validateFirstName': true } // Return as invalid FirstName
    }
  }


  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(Password, Confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[Password].value === group.controls[Confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  // Function to submit form
  onRegisterSubmit() {
    this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
    this.disableForm(); // Disable the form
    // Create user object form user's inputs
    const user = {
      EmailAddress: this.form.get('EmailAddress').value, // EmailAddress input field
      LastName: this.form.get('LastName').value, // LastName input field
      FirstName: this.form.get('FirstName').value, // FirstName input field
      BirthDate: this.form.get('BirthDate').value, // BirthDate input field
      Gender: this.form.get('Gender').value, // Gender input field
      Password: this.form.get('Password').value // Password input field
    }

    // Function from user service to register user
    this.userService.createUser(user).subscribe(data => {
      // Response from registration attempt
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set an error class
        this.message = data.message; // Set an error message
        this.processing = false; // Re-enable submit button
        this.enableForm(); // Re-enable form
      } else {
        this.messageClass = 'alert alert-success'; // Set a success class
        this.message = data.message; // Set a success message
        // After 2 second timeout, navigate to the login page
        setTimeout(() => {
          this.router.navigate(['/']); // Redirect to login view
        }, 2000);
      }
    });

  }

  // Function to check if EmailAddress is taken
  checkEmailAddress() {
    // Function from authentication file to check if EmailAddress is taken
    this.userService.checkEmailAddress(this.form.get('EmailAddress').value).subscribe(data => {
      // Check if success true or false was returned from API
      if (!data.success) {
        this.emailAddressValid = false; // Return email as invalid
        this.emailAddressMessage = data.message; // Return error message
      } else {
        this.emailAddressValid = true; // Return email as valid
        this.emailAddressMessage = data.message; // Return success message
      }
    });
  }


  ngOnInit() {
  }

}