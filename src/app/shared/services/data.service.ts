import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private namePerson: string = '';

  constructor() { }

  getNamePerson(): string {
    return this.namePerson;
  }

  setNamePerson(namePerson: string): void {
    this.namePerson = namePerson;
  }
}
