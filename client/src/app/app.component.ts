import { Component } from '@angular/core';
import {ColorPreviewer} from "./color_previewer";
import {CollapseOnClick} from "./collapse-on-click.directive";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
