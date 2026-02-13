"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  Shield,
  Clock,
  FileCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function SeedBanner() {
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string[]>([]);

  async function handleSeed() {
    setLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setResult(data.results || []);
      setSeeded(true);
    } catch {
      setResult(["Error seeding database"]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col items-center gap-3 p-4 sm:flex-row sm:justify-between">
        <div>
          <p className="font-medium text-foreground">
            First time? Seed admin accounts (HOD & Principal)
          </p>
          {seeded && result.length > 0 && (
            <ul className="mt-1 text-sm text-muted-foreground">
              {result.map((r, i) => (
                <li key={i} className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button
          onClick={handleSeed}
          disabled={loading || seeded}
          size="sm"
          variant="outline"
          className="shrink-0 text-foreground"
        >
          {loading ? "Seeding..." : seeded ? "Done" : "Seed Database"}
        </Button>
      </CardContent>
    </Card>
  );
}

const features = [
  {
    icon: FileCheck,
    title: "Apply Online",
    description:
      "Students can request Bonafide or Study certificates with just a few clicks.",
  },
  {
    icon: Shield,
    title: "Multi-Level Approval",
    description:
      "Secure two-step approval workflow through HOD and Principal verification.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description:
      "Track your application status at every stage of the approval process.",
  },
  {
    icon: Award,
    title: "Instant PDF Download",
    description:
      "Download your approved certificate as a professionally formatted PDF.",
  },
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 pb-16 pt-8 text-center">
          <div
            className={`transition-all duration-700 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Award className="h-4 w-4" />
              Digital Certificate Automation
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Streamline Your Certificate
              <br />
              <span className="text-primary">Approval Process</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A modern system for managing academic certificates with automated
              multi-level approval workflow, from application to PDF download.
            </p>
          </div>

          <div
            className={`flex flex-col gap-3 sm:flex-row transition-all duration-700 delay-200 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-foreground">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Seed */}
        <section className="mb-12">
          <SeedBanner />
        </section>

        {/* Features */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className={`group border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Workflow */}
        <section className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { step: "1", label: "Student Applies", desc: "Submit certificate request" },
              { step: "2", label: "HOD Reviews", desc: "Department head approves" },
              { step: "3", label: "Principal Approves", desc: "Final authorization" },
              { step: "4", label: "Download PDF", desc: "Get your certificate" },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`flex flex-col items-center gap-2 text-center transition-all duration-500 ${
                  mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${700 + i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground">{item.label}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
          CertFlow - Digital Certificate Automation System
        </div>
      </footer>
    </div>
  );
}
