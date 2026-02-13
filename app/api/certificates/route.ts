import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/lib/models/certificate";
import { getSessionUser } from "@/lib/auth";

// GET: Fetch certificates based on role
export async function GET(request: Request) {
  try {
    await connectDB();
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter");

    let query = {};

    if (user.role === "student") {
      query = { studentRegNo: user.regNo };
    } else if (user.role === "hod") {
      if (filter === "all") {
        query = {};
      } else {
        query = { hodStatus: "Pending" };
      }
    } else if (user.role === "principal") {
      if (filter === "all") {
        query = {};
      } else {
        query = { hodStatus: "Approved", principalStatus: "Pending" };
      }
    }

    const certificates = await Certificate.find(query).sort({
      appliedDate: -1,
    });

    return NextResponse.json({ certificates });
  } catch (error: unknown) {
    console.error("Get certificates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Student applies for a certificate
export async function POST(request: Request) {
  try {
    await connectDB();
    const user = await getSessionUser();

    if (!user || user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { certificateType, purpose } = body;

    if (!certificateType || !purpose) {
      return NextResponse.json(
        { error: "Certificate type and purpose are required" },
        { status: 400 }
      );
    }

    // Get student details from DB
    const { connectDB: reconnect } = await import("@/lib/mongodb");
    await reconnect();
    const UserModel = (await import("@/lib/models/user")).default;
    const student = await UserModel.findById(user.userId);

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    const certificate = await Certificate.create({
      studentRegNo: student.regNo,
      studentName: student.name,
      department: student.department,
      year: student.year,
      semester: student.semester,
      certificateType,
      purpose,
      appliedDate: new Date(),
    });

    return NextResponse.json(
      { message: "Application submitted successfully", certificate },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Create certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
