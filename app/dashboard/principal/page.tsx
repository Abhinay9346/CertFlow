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
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  Award,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Certificate {
  _id: string;
  studentRegNo: string;
  studentName: string;
  department: string;
  year: string;
  semester: string;
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

export default function PrincipalDashboard() {
  const { user } = useAuth();
  const {
    data: pendingData,
    isLoading: pendingLoading,
    mutate: mutatePending,
  } = useSWR<{ certificates: Certificate[] }>("/api/certificates", fetcher);

  const {
    data: allData,
    isLoading: allLoading,
    mutate: mutateAll,
  } = useSWR<{ certificates: Certificate[] }>(
    "/api/certificates?filter=all",
    fetcher
  );

  const pendingCerts = pendingData?.certificates ?? [];
  const allCerts = allData?.certificates ?? [];
  const approvedCount = allCerts.filter(
    (c) => c.finalStatus === "Approved"
  ).length;

  function refreshAll() {
    mutatePending();
    mutateAll();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Principal Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome, {user?.name} - Final approval authority for certificates
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border border-border bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Awaiting Review</p>
              <p className="text-2xl font-bold text-foreground">
                {pendingCerts.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-success/10">
              <Award className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issued</p>
              <p className="text-2xl font-bold text-foreground">
                {approvedCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-foreground">
                {allCerts.filter((c) => c.finalStatus === "Rejected").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{allCerts.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            HOD Approved ({pendingCerts.length})
          </TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                Awaiting Final Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : pendingCerts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <CheckCircle2 className="h-10 w-10 text-success/50" />
                  <p className="text-sm text-muted-foreground">
                    No applications awaiting final approval.
                  </p>
                </div>
              ) : (
                <CertificateTable
                  certificates={pendingCerts}
                  showActions
                  onAction={refreshAll}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-4">
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">All Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {allLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : allCerts.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <FileText className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No applications found.
                  </p>
                </div>
              ) : (
                <CertificateTable certificates={allCerts} onAction={refreshAll} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CertificateTable({
  certificates,
  showActions,
  onAction,
}: {
  certificates: Certificate[];
  showActions?: boolean;
  onAction: () => void;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-foreground">Student</TableHead>
            <TableHead className="text-foreground">Reg No</TableHead>
            <TableHead className="text-foreground">Dept</TableHead>
            <TableHead className="text-foreground">Type</TableHead>
            <TableHead className="text-foreground">Purpose</TableHead>
            <TableHead className="text-foreground">HOD Approved</TableHead>
            <TableHead className="text-foreground">Final Status</TableHead>
            {showActions && <TableHead className="text-foreground">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow
              key={cert._id}
              className="transition-colors hover:bg-secondary/50"
            >
              <TableCell className="font-medium text-foreground">
                {cert.studentName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {cert.studentRegNo}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {cert.department}
              </TableCell>
              <TableCell className="text-foreground">
                {cert.certificateType}
              </TableCell>
              <TableCell className="max-w-[180px] truncate text-muted-foreground">
                {cert.purpose}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(cert.hodApprovedDate)}
              </TableCell>
              <TableCell>
                <StatusBadge status={cert.finalStatus} />
              </TableCell>
              {showActions && (
                <TableCell>
                  <ApprovalActions certId={cert._id} onAction={onAction} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ApprovalActions({
  certId,
  onAction,
}: {
  certId: string;
  onAction: () => void;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);
    try {
      const res = await fetch("/api/certificates/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId: certId, action }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success(
        action === "approve"
          ? "Certificate approved & PDF generated!"
          : "Certificate rejected."
      );
      onAction();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => handleAction("approve")}
        disabled={!!loading}
        className="gap-1 bg-success text-success-foreground hover:bg-success/90"
      >
        {loading === "approve" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3 w-3" />
        )}
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleAction("reject")}
        disabled={!!loading}
        className="gap-1"
      >
        {loading === "reject" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        Reject
      </Button>
    </div>
  );
}
