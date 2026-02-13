"use client";

import useSWR from "swr";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { ApplyCertificateForm } from "@/components/apply-certificate-form";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Certificate {
  _id: string;
  certificateType: string;
  purpose: string;
  appliedDate: string;
  hodStatus: "Pending" | "Approved" | "Rejected";
  hodApprovedDate?: string;
  principalStatus: "Pending" | "Approved" | "Rejected";
  principalApprovedDate?: string;
  finalStatus: "Pending" | "Approved" | "Rejected";
  pdfGenerated: boolean;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, isLoading, mutate } = useSWR<{ certificates: Certificate[] }>(
    "/api/certificates",
    fetcher
  );

  const certificates = data?.certificates ?? [];
  const total = certificates.length;
  const pending = certificates.filter((c) => c.finalStatus === "Pending").length;
  const approved = certificates.filter((c) => c.finalStatus === "Approved").length;
  const rejected = certificates.filter((c) => c.finalStatus === "Rejected").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your certificate applications
          </p>
        </div>
        <ApplyCertificateForm onSuccess={() => mutate()} />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={total}
          icon={FileText}
          color="text-primary"
          bg="bg-primary/10"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={Clock}
          color="text-warning"
          bg="bg-warning/10"
        />
        <StatCard
          title="Approved"
          value={approved}
          icon={CheckCircle2}
          color="text-success"
          bg="bg-success/10"
        />
        <StatCard
          title="Rejected"
          value={rejected}
          icon={XCircle}
          color="text-destructive"
          bg="bg-destructive/10"
        />
      </div>

      {/* Certificates Table */}
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">My Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No applications yet. Click &quot;Apply for Certificate&quot; to get
                started.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground">Type</TableHead>
                    <TableHead className="text-foreground">Purpose</TableHead>
                    <TableHead className="text-foreground">Applied</TableHead>
                    <TableHead className="text-foreground">HOD</TableHead>
                    <TableHead className="text-foreground">Principal</TableHead>
                    <TableHead className="text-foreground">Final</TableHead>
                    <TableHead className="text-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow
                      key={cert._id}
                      className="transition-colors hover:bg-secondary/50"
                    >
                      <TableCell className="font-medium text-foreground">
                        {cert.certificateType}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {cert.purpose}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(cert.appliedDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <StatusBadge status={cert.hodStatus} />
                          {cert.hodApprovedDate && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(cert.hodApprovedDate)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <StatusBadge status={cert.principalStatus} />
                          {cert.principalApprovedDate && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(cert.principalApprovedDate)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={cert.finalStatus} />
                      </TableCell>
                      <TableCell>
                        {cert.finalStatus === "Approved" && cert.pdfGenerated ? (
                          <DownloadButton certId={cert._id} certType={cert.certificateType} />
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <Card className="border border-border bg-card transition-shadow hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bg}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DownloadButton({ certId, certType }: { certId: string; certType: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const res = await fetch(`/api/certificates/download/${certId}`);
      if (!res.ok) {
        toast.error("Failed to download certificate");
        return;
      }
      const data = await res.json();
      const cert = data.certificate;

      // Dynamic import of jsPDF for client-side PDF generation
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Header
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("CERTIFICATE", 105, 30, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`${cert.certificateType} Certificate`, 105, 42, {
        align: "center",
      });

      // Divider
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.line(30, 50, 180, 50);

      // Body
      doc.setFontSize(12);
      const y = 65;
      const lineSpacing = 10;

      doc.text(
        `This is to certify that ${cert.studentName}`,
        105,
        y,
        { align: "center" }
      );
      doc.text(
        `bearing Register Number: ${cert.studentRegNo}`,
        105,
        y + lineSpacing,
        { align: "center" }
      );
      doc.text(
        `of the Department of ${cert.department}`,
        105,
        y + lineSpacing * 2,
        { align: "center" }
      );
      doc.text(
        `${cert.year}, Semester ${cert.semester}`,
        105,
        y + lineSpacing * 3,
        { align: "center" }
      );
      doc.text(
        `is a bonafide student of this institution.`,
        105,
        y + lineSpacing * 5,
        { align: "center" }
      );

      doc.setFontSize(11);
      doc.text(`Purpose: ${cert.purpose}`, 105, y + lineSpacing * 7, {
        align: "center",
      });

      // Footer
      doc.setFontSize(10);
      doc.text(
        `Date of Issue: ${new Date(cert.principalApprovedDate).toLocaleDateString("en-IN")}`,
        30,
        250
      );
      doc.text("Principal", 160, 250);
      doc.text("(Authorized Signatory)", 145, 256);

      doc.save(`${cert.certificateType}_Certificate_${cert.studentRegNo}.pdf`);
      toast.success("Certificate downloaded!");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDownload}
      disabled={loading}
      className="gap-1.5 text-foreground"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      {certType === "Bonafide" ? "Bonafide" : "Study"}
    </Button>
  );
}
