import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/user";

export async function POST() {
  try {
    await connectDB();

    const hodExists = await User.findOne({ role: "hod" });
    const principalExists = await User.findOne({ role: "principal" });

    const results: string[] = [];

    if (!hodExists) {
      const hashedPassword = await bcrypt.hash("hod123", 12);
      await User.create({
        name: "Dr. Smith (HOD)",
        email: "hod@college.edu",
        password: hashedPassword,
        role: "hod",
        department: "Computer Science",
      });
      results.push("HOD created: hod@college.edu / hod123");
    } else {
      results.push("HOD already exists");
    }

    if (!principalExists) {
      const hashedPassword = await bcrypt.hash("principal123", 12);
      await User.create({
        name: "Dr. Johnson (Principal)",
        email: "principal@college.edu",
        password: hashedPassword,
        role: "principal",
        department: "Administration",
      });
      results.push("Principal created: principal@college.edu / principal123");
    } else {
      results.push("Principal already exists");
    }

    return NextResponse.json({ message: "Seed complete", results });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
