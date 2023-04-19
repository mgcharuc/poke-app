import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PokemonService } from 'src/app/shared/services/pokemon.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  public fileSelected?: File;
  public errorUpload?: String;
  public previewImage?: String;
  public loading = false;
  public savePerfilFake = false;
  public savePokemonFake = false;
  filteredPasatiempos: Observable<string[]>;
  allPasatiempos: string[] = ['Jugar Fútbol', 'Jugar Basquetball', 'Jugar Tennis', 'Jugar Voleibol', 'Jugar Fifa', 'Jugar Videojuegos'];
  pasatiempos: string[] = [];
  public perfil = { nombre: '', pasatiempo: '', cumpleanio: '', edad: 0, documento: '' };
  @ViewChild('pasatiempoInput') pasatiempoInput: ElementRef<HTMLInputElement>;
  public formData: FormGroup;
  public pokemonList: any[] = [];

  constructor(private dataService: DataService, private pokemonService: PokemonService) {
    this.formData = new FormGroup({
      "image": new FormControl('', [Validators.required]),
      "nombre": new FormControl('', [Validators.required]),
      "pasatiempo": new FormControl(''),
      "cumpleanios": new FormControl('', [Validators.required]),
      "documento": new FormControl('', [Validators.required]),
    })
    const pasatiempo = this.formData.get("pasatiempo");
    if (pasatiempo !== undefined && pasatiempo !== null) {
      this.filteredPasatiempos = pasatiempo.valueChanges.pipe(
        startWith(null),
        map((item: string | null) => (item ? this._filter(item) : this.allPasatiempos.slice())),
      );
    }
  }

  ngOnInit(): void {
    // this.savePerfilFake = true;
    // this.enviar();
  }

  async enviar() {
    try {
      this.loading = true;
      // await new Promise(resolve => setTimeout(resolve, 1000));
      this.pokemonService.getPokemon().subscribe(data => {
        this.pokemonList = data.results;
      });
      this.loading = false;
      this.savePerfilFake = true;
      this.perfil.nombre = this.formData.get("nombre")?.value;
      this.perfil.pasatiempo = this.pasatiempos.join();
      this.perfil.documento = this.formData.get("documento")?.value;
    } catch (err) {
      console.error(err);
    }
  }

  dateEvent(type: string, event: any) {
    try {
      if (event.value !== null) {
        const cumpleanos = new Date(event.value);
        const dateCurrent = new Date();
        var edad = dateCurrent.getFullYear() - cumpleanos.getFullYear();
        var meses = dateCurrent.getMonth() - cumpleanos.getMonth();
        if (meses < 0 || (meses === 0 && dateCurrent.getDate() < cumpleanos.getDate())) {
          edad--;
        }
        const documentoInput = this.formData.get("documento");
        if (documentoInput !== undefined && documentoInput !== null) {
          this.perfil.edad = edad;
          if (edad >= 18) {
            documentoInput.setValidators([Validators.required, Validators.pattern('^[0-9]{9}$')]);
          } else {
            documentoInput.clearValidators();
          }
          documentoInput.updateValueAndValidity();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async handleFileInput(pEvent: any) {
    await this.clearFile();
    if (pEvent.target.files.length > 0) {
      const file = pEvent.target.files.item(0);
      await this.checkMimeType(file).then((result) => {
        if (result) {
          this.fileSelected = file;
        } else {
          this.errorUpload = 'Tipo de archivo no esta permitido';
        }
      }).catch((err) => {
        // this.errorUpload = 'Tipo de archivo no esta permitido';
        console.error(err);
      });
    }
  }

  async checkMimeType(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        var fileReader = new FileReader();
        fileReader.onloadend = async function (e: any) {
          var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
          var header = '';
          for (var i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }
          // Check the file signature against known types
          var type = file.type;
          switch (type) {
            case 'image/png':
            case 'image/gif':
            case 'image/jpeg':
              resolve(true);
              break;
            default:
              type = 'not accept';
              resolve(false);
          }
        };
        fileReader.readAsArrayBuffer(file);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  async uploadFile() {
    try {
      if (this.fileSelected !== undefined) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImage = e.target.result;
          const imageInput = this.formData.get("image");
          if (imageInput !== undefined && imageInput !== null) {
            imageInput.clearValidators();
            imageInput.updateValueAndValidity();
          }
        };
        reader.readAsDataURL(this.fileSelected);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async removeFile() {
    try {
      if (this.fileSelected !== undefined) {
        await this.clearFile();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async clearFile() {
    try {
      this.fileSelected = undefined;
      this.errorUpload = undefined;
      this.previewImage = undefined;
      const imageInput = this.formData.get("image");
      if (imageInput !== undefined && imageInput !== null) {
        imageInput.setValidators([Validators.required]);
        imageInput.updateValueAndValidity();
      }
    } catch (err) {
      console.error(err);
    }
  }

  updateNamePerson(): void {
    this.dataService.setNamePerson('José');
  }

  add(event: MatChipInputEvent | any): void {
    const value = (event.value || '').trim();

    if (value) {
      this.pasatiempos.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    const pasatiempo = this.formData.get("pasatiempo");
    if (pasatiempo !== undefined && pasatiempo !== null) {
      pasatiempo.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.pasatiempos.indexOf(fruit);

    if (index >= 0) {
      this.pasatiempos.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent | any): void {
    this.pasatiempos.push(event.option.viewValue);
    if (this.pasatiempoInput !== undefined) {
      this.pasatiempoInput.nativeElement.value = '';
    }
    const pasatiempo = this.formData.get("pasatiempo");
    if (pasatiempo !== undefined && pasatiempo !== null) {
      pasatiempo.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allPasatiempos.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

}
