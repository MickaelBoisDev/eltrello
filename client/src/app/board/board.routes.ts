import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { Routes } from '@angular/router';
import { TaskModalComponent } from './components/taskModal/taskModal.componen';
export const boardRoutes: Routes = [
  {
    path: '',
    component: BoardComponent,
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskModalComponent,
      },
    ],
  },
];
