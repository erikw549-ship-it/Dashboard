"use client";

import { Calendar, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CaseItem } from "@/lib/casesStore";

interface CaseCardProps {
  caseData: Pick<
    CaseItem,
    | "id"
    | "title"
    | "status"
    | "createdAt"
    | "summary"
    | "applicantName"
    | "postalCode"
    | "confirm_url"
  >;
  onViewDetails: () => void;
}

export function CaseCard({ caseData, onViewDetails }: CaseCardProps) {
  const handleConfirm = async () => {
    try {
      const url = caseData.confirm_url;
      if (!url) {
        console.warn("[v0] No confirm_url set on case", caseData.id);
        return;
      }
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: caseData.id }),
      });
      console.log("[v0] Case confirmed:", caseData.id);
    } catch (error) {
      console.error("[v0] Error confirming case:", error);
    }
  };

  const statusColor =
    caseData.status === "Offen"
      ? "bg-chart-4/20 text-chart-4"
      : "bg-primary/20 text-primary";

  return (
    <Card className="group bg-card border-border transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="font-mono text-sm text-muted-foreground">
              Case #{caseData.id}
            </p>
            <h3 className="font-semibold text-foreground leading-tight">
              {caseData.title}
            </h3>
          </div>
          <Badge className={`${statusColor} border-0 font-medium`}>
            {caseData.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(caseData.createdAt).toLocaleDateString("de-DE")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{caseData.summary}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
          onClick={onViewDetails}
        >
          Details anzeigen
        </Button>
        <Button
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleConfirm}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Bestätigen
        </Button>
      </CardFooter>
    </Card>
  );
}
