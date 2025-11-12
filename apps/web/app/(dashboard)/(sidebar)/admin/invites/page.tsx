"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  getInvites,
  createInvite,
  approveInvite,
  revokeInvite,
  getBetaMode,
  setBetaMode,
} from "@/utils/actions/invites";
import { toast } from "sonner";
import type { Invite } from "@repo/database";

type InviteWithCreator = Invite & {
  createdBy: { name: string; email: string };
};

export default function InvitesPage() {
  const [invites, setInvites] = useState<InviteWithCreator[]>([]);
  const [betaMode, setBetaModeState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [invitesResult, betaModeResult] = await Promise.all([
      getInvites(),
      getBetaMode(),
    ]);

    if (invitesResult.success) {
      setInvites(invitesResult.data);
    } else {
      toast.error(invitesResult.error);
    }

    if (betaModeResult.success) {
      setBetaModeState(betaModeResult.data);
    }

    setLoading(false);
  }

  async function handleToggleBetaMode(enabled: boolean) {
    const result = await setBetaMode(enabled);
    if (result.success) {
      setBetaModeState(enabled);
      toast.success(`Beta mode ${enabled ? "enabled" : "disabled"}`);
    } else {
      toast.error(result.error);
    }
  }

  async function handleAddInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    const result = await createInvite(email);
    if (result.success) {
      toast.success(`Invite created for ${email}`);
      setEmail("");
      loadData();
    } else {
      toast.error(result.error);
    }
    setSubmitting(false);
  }

  async function handleApprove(inviteId: string) {
    const result = await approveInvite(inviteId);
    if (result.success) {
      toast.success("Invite approved");
      loadData();
    } else {
      toast.error(result.error);
    }
  }

  async function handleRevoke(inviteId: string) {
    const result = await revokeInvite(inviteId);
    if (result.success) {
      toast.success("Invite revoked");
      loadData();
    } else {
      toast.error(result.error);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Beta Invites
          </h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 md:px-14 py-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Beta Invites</h1>
        <p className="text-muted-foreground mt-1">
          Manage beta access and invite allowlist
        </p>
      </div>

      {/* Beta Mode Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div>
          <h3 className="font-medium">Beta Mode</h3>
          <p className="text-sm text-muted-foreground">
            {betaMode
              ? "Only invited users can sign up"
              : "Anyone can sign up"}
          </p>
        </div>
        <Switch
          checked={betaMode}
          onCheckedChange={handleToggleBetaMode}
          aria-label="Toggle beta mode"
        />
      </div>

      {/* Add Invite Form */}
      <form onSubmit={handleAddInvite} className="flex gap-2">
        <Input
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          className="max-w-md"
        />
        <Button type="submit" disabled={submitting}>
          Add Invite
        </Button>
      </form>

      {/* Invites Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Used At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invites.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No invites yet
                </TableCell>
              </TableRow>
            ) : (
              invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell className="font-medium">{invite.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invite.status === "APPROVED"
                          ? "default"
                          : invite.status === "PENDING"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {invite.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {invite.createdBy ? (
                      <div className="text-sm">
                        <div>{invite.createdBy.name}</div>
                        <div className="text-muted-foreground">
                          {invite.createdBy.email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Waitlist
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(invite.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {invite.usedAt
                      ? new Date(invite.usedAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {invite.status === "PENDING" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(invite.id)}
                        >
                          Approve
                        </Button>
                      )}
                      {invite.status === "APPROVED" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(invite.id)}
                        >
                          Revoke
                        </Button>
                      )}
                      {invite.status === "PENDING" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(invite.id)}
                        >
                          Decline
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
