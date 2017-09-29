import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class AgentService {

  options;
  domain = this.userService.domain;

  constructor(
    private userService: UserService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.userService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.userService.userToken // Attach token
      })
    });
  }

  // Function to create a new blog post
  /*newAgent(agent) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'blogs/newBlog', agent, this.options).map(res => res.json());
  }*/

  // Function to get all blogs from the database
  getAllAgents() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'agents/allAgents', this.options).map(res => res.json());
  }

  // Function to post a comment on a blog post
  postSMS(id, sms) {
    this.createAuthenticationHeaders(); // Create headers
    // Create blogData to pass to backend
    const smsData = {
      id: id,
      sms: sms
    }
    return this.http.post(this.domain + 'smss/sms', smsData, this.options).map(res => res.json());

  }

 /*
  // Function to get the blog using the id
  getSingleBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'blogs/singleBlog/' + id, this.options).map(res => res.json());
  }

  // Function to edit/update blog post
  editBlog(blog) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'blogs/updateBlog/', blog, this.options).map(res => res.json());
  }

  // Function to delete a blog
  deleteBlog(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'blogs/deleteBlog/' + id, this.options).map(res => res.json());
  }

  // Function to like a blog post
  likeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/likeBlog/', blogData, this.options).map(res => res.json());
  }

  // Function to dislike a blog post
  dislikeBlog(id) {
    const blogData = { id: id };
    return this.http.put(this.domain + 'blogs/dislikeBlog/', blogData, this.options).map(res => res.json());
  }

*/


}