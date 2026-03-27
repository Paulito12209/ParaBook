import { Component } from '@angular/core';
import { Sidebar } from "../../../shared/components/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { Header } from "../../../shared/components/header/header";
import { QuickCapture } from "../../../shared/components/quick-capture/quick-capture";

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, RouterOutlet, Header, QuickCapture],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
