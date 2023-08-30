import { io, Socket } from "socket.io-client";
import { CurrentUserInterface } from "./../../auth/types/currentUser.interface";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class SocketService {
  socket: Socket | undefined;

  setupSocketConnection(currentUser: CurrentUserInterface): void {
    this.socket = io(environment.socketUrl, {
      auth: {
        token: currentUser.token,
      },
    });
  }

  disconnect(): void {
    if (!this.socket) {
      throw new Error("Socket connection is not established");
    }
    this.socket.disconnect();
  }
}
