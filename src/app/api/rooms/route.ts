import { Database, DB, readDB, writeDB, } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";



interface RequestBody {
  roomName: string;
}

export const GET = async (): Promise<NextResponse> => {
  readDB();  
  const rooms = (<Database>DB).rooms;
  const totalRooms = rooms.length;
  
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};

export const POST = async (request: Request): Promise<NextResponse> => {
  const payload = checkToken();
  
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const body: RequestBody = await request.json();
  const { roomName } = body;
  
  const foundRoom = (<Database>DB).rooms.find((x: { roomName: string; }) => x.roomName === roomName);
  if (foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  (<Database>DB).rooms.push({
    roomId,
    roomName,
  });

  writeDB(); 

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
