export enum SocketEventsEnum {
  boardsJoin = "boards:join",
  boardsLeave = "boards:leave",

  boardUpdate = "boards:update",
  boardUpdateSuccess = "boards:updateSuccess",
  boardUpdateFailure = "boards:updateFailure",

  boardDelete = "boards:delete",
  boardDeleteSuccess = "boards:deleteSuccess",
  boardDeleteFailure = "boards:deleteFailure",

  columnsCreate = "columns:create",
  columnsCreateSuccess = "columns:createSuccess",
  columnsCreateFailure = "columns:createFailure",

  tasksCreate = "tasks:create",
  tasksCreateSuccess = "tasks:createSuccess",
  tasksCreateFailure = "tasks:createFailure",
}
