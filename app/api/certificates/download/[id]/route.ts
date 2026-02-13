import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/lib/models/certificate";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const user = await getSessionUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    if (
      user.role === "student" &&
      certificate.studentRegNo !== user.regNo
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (certificate.finalStatus !== "Approved") {
      return NextResponse.json(
        { error: "Certificate not yet approved" },
        { status: 400 }
      );
    }

    // Return certificate data for client-side PDF generation
    return NextResponse.json({
      certificate: {
        studentName: certificate.studentName,
        studentRegNo: certificate.studentRegNo,
        department: certificate.department,
        year: certificate.year,
        semester: certificate.semester,
        certificateType: certificate.certificateType,
        purpose: certificate.purpose,
        appliedDate: certificate.appliedDate,
        principalApprovedDate: certificate.principalApprovedDate,
      },
    });
  } catch (error: unknown) {
    console.error("Download certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
