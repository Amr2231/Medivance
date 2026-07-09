"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AUDIT_ACTIONS,
  AUDIT_ENTITIES,
  AUDIT_SORT_FIELDS,
} from "../../constants/audit-logs.constants";

// types
export type AuditLogFiltersState = {
  action: string;
  entity: string;
  actorId: string;
  entityId: string;
  fromDate: string;
  toDate: string;
  sort: string;
  order: "ASC" | "DESC";
};

type AuditLogFiltersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: AuditLogFiltersState;
  onApply: (filters: AuditLogFiltersState) => void;
  onReset: () => void;
};

// component
export function AuditLogFiltersModal({
  open,
  onOpenChange,
  filters,
  onApply,
  onReset,
}: AuditLogFiltersModalProps) {
  // state
  const [local, setLocal] = React.useState(filters);

  // handlers
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setLocal(filters);
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter audit logs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            {/* actions */}
            <Label htmlFor="filter-action">Action</Label>
            <Select
              value={local.action || "all"}
              onValueChange={(v) =>
                setLocal((s) => ({ ...s, action: v === "all" ? "" : v }))
              }
            >
              <SelectTrigger id="filter-action" className="w-full">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                {AUDIT_ACTIONS.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* entity filter */}
          <div className="space-y-2">
            <Label htmlFor="filter-entity">Entity</Label>
            <Select
              value={local.entity || "all"}
              onValueChange={(v) =>
                setLocal((s) => ({ ...s, entity: v === "all" ? "" : v }))
              }
            >
              <SelectTrigger id="filter-entity" className="w-full">
                <SelectValue placeholder="All entities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All entities</SelectItem>
                {AUDIT_ENTITIES.map((entity) => (
                  <SelectItem key={entity} value={entity}>
                    {entity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actor ID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="filter-actor">Actor ID</Label>
              <Input
                id="filter-actor"
                type="number"
                placeholder="e.g. 1"
                value={local.actorId}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, actorId: e.target.value }))
                }
              />
            </div>

            {/* Entity ID */}
            <div className="space-y-2">
              <Label htmlFor="filter-entity-id">Entity ID</Label>
              <Input
                id="filter-entity-id"
                placeholder="ID"
                value={local.entityId}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, entityId: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="filter-from">From date</Label>
              <Input
                id="filter-from"
                type="date"
                value={local.fromDate}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, fromDate: e.target.value }))
                }
              />
            </div>

            {/* To date */}
            <div className="space-y-2">
              <Label htmlFor="filter-to">To date</Label>
              <Input
                id="filter-to"
                type="date"
                value={local.toDate}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, toDate: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Sort and order */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="filter-sort">Sort by</Label>
              <Select
                value={local.sort}
                onValueChange={(v) => setLocal((s) => ({ ...s, sort: v }))}
              >
                <SelectTrigger id="filter-sort" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIT_SORT_FIELDS.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="filter-order">Order</Label>
              <Select
                value={local.order}
                onValueChange={(v) =>
                  setLocal((s) => ({ ...s, order: v as "ASC" | "DESC" }))
                }
              >
                <SelectTrigger id="filter-order" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESC">Newest first</SelectItem>
                  <SelectItem value="ASC">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Apply filters */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
          <Button
            className=""
            onClick={() => {
              onApply(local);
              onOpenChange(false);
            }}
          >
            Apply filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
