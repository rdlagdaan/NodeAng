import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UserService } from '../../services/user.service';
import { AgentService } from '../../services/agent.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CanActivate, Router } from '@angular/router';

@Component({
  selector: 'app-uploadcsv',
  templateUrl: './uploadcsv.component.html',
  styleUrls: ['./uploadcsv.component.css']
})
export class UploadcsvComponent implements OnInit {
public uploader:FileUploader = new FileUploader({url:'http://localhost:8080/upload'});
  
  agentPosts;
  newSMS = [];
  smsForm;
  processing = false;
  enabledSMSs = [];

  constructor(    
    private formBuilder: FormBuilder,
    private userService: UserService,
    private agentService: AgentService,
    private router: Router
  ) 
{     
  this.createSMSForm(); // Create form for posting comments on a user's blog post
}


  // Function to cancel new post transaction
  cancelSubmission(id) {
    const index = this.newSMS.indexOf(id); // Check the index of the blog post in the array
    this.newSMS.splice(index, 1); // Remove the id from the array to cancel post submission
    this.smsForm.reset(); // Reset  the form after cancellation
    this.enableSMSForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }


  // Create form for posting comments
  createSMSForm() {
    this.smsForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })
  }

  // Enable the sms form
  enableSMSForm() {
    this.smsForm.get('sms').enable(); // Enable sms field
  }

  // Disable the sms form
  disableSMSForm() {
    this.smsForm.get('sms').disable(); // Disable sms field
  }

  // Function to post a new sms on blog post
  draftSMS(id) {
    this.smsForm.reset(); // Reset the sms form each time users starts a new comment
    this.newSMS = []; // Clear array so only one post can be sms on at a time
    this.newSMS.push(id); // Add the post that is being sms on to the array
  }


  // Function to post a new comment
  postSMS(id) {
    this.disableSMSForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const sms = this.smsForm.get('sms').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.agentService.postSMS(id, sms).subscribe(data => {
      this.getAllAgents(); // Refresh all blogs to reflect the new comment
      const index = this.newSMS.indexOf(id); // Get the index of the blog id to remove from array
      this.newSMS.splice(index, 1); // Remove id from the array
      this.enableSMSForm(); // Re-enable the form
      this.smsForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledSMSs.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  // Expand the list of sms
  expand(id) {
    this.enabledSMSs.push(id); // Add the current blog post id to array
  }

  // Collapse the list of sms
  collapse(id) {
    const index = this.enabledSMSs.indexOf(id); // Get position of id in array
    this.enabledSMSs.splice(index, 1); // Remove id from array
  }


  // Function to get all blogs from the database
  getCsv() {
    // Function to GET all blogs from database
    this.userService.getCsv().subscribe(data => {
      //this.csvPosts = data.csv; // Assign array to use in HTML
    });
 //console.log("hello");
    this.getAllAgents();
    this.router.navigate(['/uploadcsv']);
  }

  // Function to get all blogs from the database
  getAllAgents() {
    // Function to GET all blogs from database
    this.agentService.getAllAgents().subscribe(data => {
      console.log(data);
      this.agentPosts = data.agents; // Assign array to use in HTML
    });
  }

  ngOnInit() {
       this.getAllAgents();
  }

}
