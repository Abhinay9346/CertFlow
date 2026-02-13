import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICertificate extends Document {
  studentRegNo: string;
  studentName: string;
  department: string;
  year: string;
  semester: string;
  certificateType: "Bonafide" | "Study";
  purpose: string;
  appliedDate: Date;
  hodStatus: "Pending" | "Approved" | "Rejected";
  hodApprovedDate?: Date;
  principalStatus: "Pending" | "Approved" | "Rejected";
  principalApprovedDate?: Date;
  finalStatus: "Pending" | "Approved" | "Rejected";
  pdfGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    studentRegNo: { type: String, required: true },
    studentName: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    semester: { type: String, required: true },
    certificateType: {
      type: String,
      enum: ["Bonafide", "Study"],
      required: true,
    },
    purpose: { type: String, required: true },
    appliedDate: { type: Date, default: Date.now },
    hodStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    hodApprovedDate: { type: Date },
    principalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    principalApprovedDate: { type: Date },
    finalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    pdfGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
