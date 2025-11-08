"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Mail, FileText } from "lucide-react";
import { AccountTableRow } from "@/typings";

interface AccountBulkActionsProps {
  selectedAccounts: AccountTableRow[];
  onClearSelection: () => void;
}

export function AccountBulkActions({
  selectedAccounts,
  onClearSelection,
}: AccountBulkActionsProps) {
  if (selectedAccounts.length === 0) return null;

  const handleExportCSV = () => {
    //@TODO: Implement Slack integration
    alert("CSV export coming soon!");
  };

  const handleSendToSlack = () => {
    //@TODO: Implement Slack integration
    alert("Slack integration coming soon!");
  };

  const handleCreateLinearIssue = () => {
    //@TODO: Implement Linear integration
    alert("Linear integration coming soon!");
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-4 flex items-center gap-4">
        <span className="text-sm font-medium">
          {selectedAccounts.length} account
          {selectedAccounts.length !== 1 ? "s" : ""} selected
        </span>

        <div className="h-4 w-px bg-border" />

        <Button
          size="sm"
          variant="outline"
          onClick={handleExportCSV}
          className="gap-2"
        >
          <Download className="h-3 w-3" />
          Export CSV
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleSendToSlack}
          className="gap-2"
        >
          <Mail className="h-3 w-3" />
          Send to Slack
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleCreateLinearIssue}
          className="gap-2"
        >
          <FileText className="h-3 w-3" />
          Create Linear Issue
        </Button>

        <div className="h-4 w-px bg-border" />

        <Button size="sm" variant="ghost" onClick={onClearSelection}>
          Clear
        </Button>
      </div>
    </div>
  );
}
