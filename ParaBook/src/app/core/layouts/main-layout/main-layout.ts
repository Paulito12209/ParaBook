import { Component } from '@angular/core';
import { Navigation } from "../../../shared/components/navigation/navigation";
import { RouterOutlet } from "@angular/router";
import { Header } from "../../../shared/components/header/header";

@Component({
  selector: 'app-main-layout',
  imports: [Navigation, RouterOutlet, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}
