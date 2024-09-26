import jwt from "jsonwebtoken";
import { Database, DB, readDB,} from "@lib/DB";
import { NextResponse } from "next/server";


// Define the shape of the request body
interface RequestBody {
  username: string;
  password: string;
}

// Define the shape of the user object in DB
interface User {
  username: string;
  password: string;
  role: string;
}

export const POST = async (request: Request): Promise<NextResponse> => {
  readDB();
  const body: RequestBody = await request.json();
  const { username, password } = body;

  // Find the user in the database
  const user = (<Database>DB).users.find(
    (user: User) => user.username === username && user.password === password
  );

  // If user is not found, return error response
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or password is incorrect",
      },
      { status: 400 }
    );
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      username,
      role: user.role,
    },
    process.env.JWT_SECRET as string, // Ensure JWT_SECRET is typed as string
    {
      expiresIn: "8h",
    }
  );

  return NextResponse.json({ ok: true, token });
};
