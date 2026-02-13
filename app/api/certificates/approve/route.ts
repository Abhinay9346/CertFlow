import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Certificate from "@/lib/models/certificate";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();
    const user = await getSessionUser();

    if (!user || !["hod", "principal"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { certificateId, action } = await request.json();

    if (!certificateId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Certificate ID and valid action required" },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findById(certificateId);
    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    const status = action === "approve" ? "Approved" : "Rejected";

    if (user.role === "hod") {
      if (certificate.hodStatus !== "Pending") {
        return NextResponse.json(
          { error: "Certificate already processed by HOD" },
          { status: 400 }
        );
      }
      certificate.hodStatus = status;
      certificate.hodApprovedDate = new Date();
      if (status === "Rejected") {
        certificate.finalStatus = "Rejected";
      }
    } else if (user.role === "principal") {
      if (certificate.hodStatus !== "Approved") {
        return NextResponse.json(
          { error: "Certificate not yet approved by HOD" },
          { status: 400 }
        );
      }
      if (certificate.principalStatus !== "Pending") {
        return NextResponse.json(
          { error: "Certificate already processed by Principal" },
          { status: 400 }
        );
      }
      certificate.principalStatus = status;
      certificate.principalApprovedDate = new Date();
      if (status === "Approved") {
        certificate.finalStatus = "Approved";
        certificate.pdfGenerated = true;
      } else {
        certificate.finalStatus = "Rejected";
      }
    }

    await certificate.save();

    return NextResponse.json({
      message: `Certificate ${status.toLowerCase()} successfully`,
      certificate,
    });
  } catch (error: unknown) {
    console.error("Approve certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
