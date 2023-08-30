export enum SocketEventsEnum {
  boardsJoin = 'boards:join',
  boardsLeave = 'boards:leave',

  boardUpdate = 'boards:create',
  boardUpdateSuccess = 'boards:createSuccess',
  boardUpdateFailure = 'boards:createFailure',

  columnsCreate = 'columns:create',
  columnsCreateSuccess = 'columns:createSuccess',
  columnsCreateFailure = 'columns:createFailure',

  tasksCreate = 'tasks:create',
  tasksCreateSuccess = 'tasks:createSuccess',
  tasksCreateFailure = 'tasks:createFailure',
}
