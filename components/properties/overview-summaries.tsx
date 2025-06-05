"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tenant, MaintenanceItem } from "@/app/actions/properties";

interface TenantsSummaryProps {
  tenants: Tenant[];
}

export function TenantsSummary({ tenants }: TenantsSummaryProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Tenants Summary</h3>
      {tenants.length === 0 && (
        <p className="text-sm text-muted-foreground">No tenants currently registered.</p>
      )}
      {tenants.map((tenant) => (
        <div key={tenant.id} className="flex items-center justify-between py-2 border-b last:border-0">
          <div>
            <div className="font-medium">{tenant.name}</div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(tenant.lease_start), "MMM d, yyyy")} - {format(new Date(tenant.lease_end), "MMM d, yyyy")}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">${tenant.rent_amount.toLocaleString()}</div>
            <Badge
              variant={
                tenant.status === "active" ? "default" : 
                tenant.status === "late" ? "destructive" : "outline"
              }
            >
              {tenant.status === "active" ? "Active" : 
               tenant.status === "late" ? "Late Payment" : "Ending Soon"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

interface MaintenanceSummaryProps {
  maintenanceItems: MaintenanceItem[];
}

export function MaintenanceSummary({ maintenanceItems }: MaintenanceSummaryProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Maintenance Summary</h3>
      {maintenanceItems.length === 0 && (
        <p className="text-sm text-muted-foreground">No maintenance items currently scheduled.</p>
      )}
      {maintenanceItems.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
          <div>
            <div className="font-medium">{item.title}</div>
            <div className="text-xs text-muted-foreground">{format(new Date(item.date), "MMM d, yyyy")}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">${item.cost.toLocaleString()}</div>
            <Badge
              variant={
                item.status === "completed" ? "default" : 
                item.status === "pending" ? "secondary" : "outline"
              }
            >
              {item.status === "completed" ? "Completed" : 
               item.status === "pending" ? "Pending" : "Scheduled"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
