export interface Room {
    roomId: string;
    roomName: string;
  }
  
  export interface Message {
    roomId: string;
    messageId: string;
    messageText: string;
  }
  
  export interface User {
    username: string;
    password: string;
    role: "ADMIN" | "SUPER_ADMIN";
  }

  export interface Database {
    rooms: Room[];
    messages: Message[];
    users: User[];
  }
 