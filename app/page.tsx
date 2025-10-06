"use client";

import { useEffect, useState } from "react";
import type { CaseItem } from "@/lib/casesStore";
import { Search, FolderOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CaseCard } from "@/components/case-card";
import { CaseDetailModal } from "@/components/case-detail-modal";

// uses CaseItem from lib/casesStore

export default function CaseDashboard() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  useEffect(() => {
    let canceled = false;
    fetch("/api/cases")
      .then((r) => r.json())
      .then((d) => {
        if (!canceled) setCases(Array.isArray(d?.cases) ? d.cases : []);
      })
      .catch(() => {
        if (!canceled) setCases([]);
      });
    return () => {
      canceled = true;
    };
  }, []);

  const filteredCases = cases.filter((caseItem) => {
    const query = searchQuery.toLowerCase();
    return (
      caseItem.title.toLowerCase().includes(query) ||
      caseItem.applicantName.toLowerCase().includes(query) ||
      caseItem.postalCode.includes(query) ||
      caseItem.id.toString().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">
              Case Dashboard
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Suche nach Namen, PLZ oder Case-ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCases.map((caseItem) => (
            <CaseCard
              key={caseItem.id}
              caseData={caseItem}
              onViewDetails={() => setSelectedCase(caseItem)}
            />
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Keine Cases gefunden.</p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </div>
  );
}
