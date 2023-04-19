import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() name: string = '';

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.name = this.dataService.getNamePerson();
  }

}
