import { Database, DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";


interface RequestBody {
  roomId: string;
  messageText: string;
  messageId: string;
}

export const GET = async (request: Request): Promise<NextResponse> => {
  readDB();
  const body: RequestBody = await request.json();
  const { roomId } = body;
  const foundRoomId = (<Database>DB).rooms.find((x: { roomId: string; }) => x.roomId === roomId);
  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messages = (<Database>DB).messages.filter((x: { roomId: string; }) => x.roomId === roomId); 
  return NextResponse.json(
    {
      ok: true,
      messages,
    }
  );
};

export const POST = async (request: Request): Promise<NextResponse> => {
  readDB();
  const body: RequestBody = await request.json();
  const { roomId, messageText } = body; 
  const foundRoomId = (<Database>DB).rooms.find((x: { roomId: string; }) => x.roomId === roomId);
  if (!foundRoomId) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  (<Database>DB).messages.push({
    messageId,
    messageText,
    roomId,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: Request): Promise<NextResponse> => {
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
  const { roomId, messageId } = body;
  const foundMessage = (<Database>DB).messages.find((x: { messageId: any; roomId: string; }) => x.messageId === messageId && x.roomId === roomId);
  if (!foundMessage) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  (<Database>DB).messages = (<Database>DB).messages.filter((x: { messageId: any; }) => x.messageId !== messageId);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};