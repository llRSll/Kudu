"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CashFlow } from "@/app/actions/cashflows";
import { Property } from "@/app/actions/properties";
import { EditCashFlowForm } from "./edit-cash-flow-form";
import { DeleteCashFlowDialog } from "./delete-cash-flow-dialog";

interface CashFlowTableRowProps {
  cashFlow: CashFlow;
  property: Property;
  onUpdate: () => void;
  selectedType: string;
}

export function CashFlowTableRow({
  cashFlow,
  property,
  onUpdate,
  selectedType,
}: CashFlowTableRowProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "RENT":
        return "bg-green-100 text-green-800";
      case "MAINTENANCE":
      case "REPAIR":
        return "bg-orange-100 text-orange-800";
      case "UTILITIES":
        return "bg-blue-100 text-blue-800";
      case "MORTGAGE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    onUpdate();
  };

  return (
    <>
      <TableRow className="hover:bg-muted/50">
        {/* Month */}
        <TableCell>
          <div className="font-medium">
            {format(new Date(cashFlow.timestamp), "MMM d")}
          </div>
        </TableCell>

        {/* Income */}
        <TableCell>
          <div className="font-medium">{formatCurrency(cashFlow.income)}</div>
        </TableCell>

        {/* Expenses */}
        <TableCell>
          {
            <div className="font-medium">
              {formatCurrency(cashFlow.expenses)}
            </div>
          }
        </TableCell>

        {/* Maintenance */}
        <TableCell>
          {
            <div className="font-medium">
              {formatCurrency(cashFlow.maintenance)}
            </div>
          }
        </TableCell>

        {/* Net Income */}
        <TableCell>
          <div
            className={`font-medium ${
              Number(cashFlow.income) -
                (Number(cashFlow.expenses) + Number(cashFlow.maintenance)) >=
              0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(
              Number(cashFlow.income) -
                (Number(cashFlow.expenses) + Number(cashFlow.maintenance))
            )}
          </div>
        </TableCell>

        {/* Transaction Type */}
        <TableCell>
          <Badge
            variant="secondary"
            className={`text-xs ${getTransactionTypeColor(
              cashFlow.transaction_type
            )}`}
          >
            {cashFlow.transaction_type}
          </Badge>
        </TableCell>

        {/* Type (Credit/Debit) */}
        <TableCell className="text-center">
          <Badge
            variant={
              cashFlow.debit_credit === "CREDIT" ? "default" : "destructive"
            }
          >
            {cashFlow.debit_credit === "CREDIT" ? "Credit" : "Debit"}
          </Badge>
        </TableCell>

        {/* Description */}
        <TableCell>
          <div className="font-medium">{cashFlow.description}</div>
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right">
          {/* Large screens: show icons directly */}
          <div className="hidden lg:flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsEditDialogOpen(true)}
              aria-label="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <DeleteCashFlowDialog cashFlow={cashFlow} onSuccess={onUpdate}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DeleteCashFlowDialog>
          </div>
          {/* Small screens: show dropdown menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setIsEditDialogOpen(true)}
                  className="ps-0"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteCashFlowDialog
                    cashFlow={cashFlow}
                    onSuccess={onUpdate}
                  >
                    <div className="flex items-center w-full text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </div>
                  </DeleteCashFlowDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Cash Flow</DialogTitle>
            <DialogDescription>
              Update the details of this cash flow entry.
            </DialogDescription>
          </DialogHeader>
          <EditCashFlowForm
            property={property}
            cashFlowId={cashFlow.id}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
