import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceEntity } from '../../../../core/models/entities';

@Component({
  selector: 'app-resource-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-details.html',
  styleUrl: './resource-details.scss',
})
export class ResourceDetailsComponent {
  @Input() resource: ResourceEntity | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
