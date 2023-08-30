import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { Routes } from '@angular/router';
export const boardRoutes: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
];
