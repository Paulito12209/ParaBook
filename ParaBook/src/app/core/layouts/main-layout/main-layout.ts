import { Component } from '@angular/core';
import { Sidebar } from "../../../shared/components/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";
import { Header } from "../../../shared/components/header/header";
import { QuickCapture } from "../../../shared/components/quick-capture/quick-capture";
import { SearchModal } from "../../../shared/components/search-modal/search-modal";
import { ShortcutService } from "../../../core/services/shortcut.service";
import { inject } from "@angular/core";

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, RouterOutlet, Header, QuickCapture, SearchModal],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  shortcutService = inject(ShortcutService);
}
