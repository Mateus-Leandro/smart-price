import { Component, signal } from '@angular/core';
import { ListaPrecificacao } from "./lista-precificacao/lista-precificacao";
@Component({
  selector: 'app-root',
  imports: [ListaPrecificacao],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
