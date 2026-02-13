import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { identifier, password, loginType } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let user;
    if (loginType === "admin") {
      user = await User.findOne({
        email: identifier,
        role: { $in: ["hod", "principal"] },
      });
    } else {
      user = await User.findOne({ regNo: identifier, role: "student" });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id as string,
      role: user.role,
      email: user.email,
      name: user.name,
      regNo: user.regNo,
    });

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
