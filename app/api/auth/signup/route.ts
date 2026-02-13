import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, regNo, department, year, semester, email, password } = body;

    if (!name || !regNo || !department || !year || !semester || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { regNo }],
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            existingUser.email === email
              ? "Email already registered"
              : "Register number already exists",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      regNo,
      department,
      year,
      semester,
      email,
      password: hashedPassword,
      role: "student",
    });

    const token = signToken({
      userId: user._id as string,
      role: "student",
      email: user.email,
      name: user.name,
      regNo: user.regNo,
    });

    const response = NextResponse.json(
      { message: "Account created successfully", role: "student" },
      { status: 201 }
    );

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
