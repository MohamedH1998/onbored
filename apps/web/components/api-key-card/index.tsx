import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ApiKey } from "@repo/database";

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onRevoke?: (keyId: string) => void;
  onDelete?: (keyId: string) => void;
}

export function ApiKeyCard({ apiKey, onRevoke, onDelete }: ApiKeyCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const maskApiKey = (token: string) => {
    if (token.length <= 8) return token;
    return `${token.substring(0, 8)}${"•".repeat(token.length - 12)}${token.substring(token.length - 4)}`;
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(apiKey.id);
    } else if (onRevoke) {
      onRevoke(apiKey.id);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">{apiKey.label}</h3>
            <Badge variant="secondary" className="text-xs">
              {apiKey.token.startsWith("pk_live_") ? "Live" : "Test"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
              {isVisible ? apiKey.token : maskApiKey(apiKey.token)}
            </code>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
                className="h-8 w-8 p-0"
                title={isVisible ? "Hide API key" : "Show API key"}
              >
                {isVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(apiKey.token, "API Key")}
                className="h-8 w-8 p-0"
                title="Copy API key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Created: {formatDate(apiKey.createdAt.toISOString())}</p>
            {apiKey.lastUsedAt && (
              <p>Last used: {formatDate(apiKey.lastUsedAt.toISOString())}</p>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
