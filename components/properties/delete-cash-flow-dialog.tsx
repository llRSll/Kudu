"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { deleteCashFlow } from "@/app/actions/cashflows";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CashFlow } from "@/app/actions/cashflows";

interface DeleteCashFlowDialogProps {
  cashFlow: CashFlow;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export function DeleteCashFlowDialog({ cashFlow, onSuccess, children }: DeleteCashFlowDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      console.log("Deleting cash flow:", cashFlow.id);
      
      const result = await deleteCashFlow(cashFlow.id, cashFlow.property_id);
      
      if (result.success) {
        toast.success("Cash flow deleted successfully");
        setIsOpen(false);
        onSuccess();
      } else {
        throw new Error(result.error || "Failed to delete cash flow");
      }
    } catch (error) {
      console.error("Error deleting cash flow:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete cash flow. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Cash Flow</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this cash flow entry?
            <div className="mt-2 p-3 bg-muted rounded-md">
              <div className="text-sm">
                <div><strong>Description:</strong> {cashFlow.description}</div>
                <div><strong>Amount:</strong> ${cashFlow.amount.toLocaleString()}</div>
                <div><strong>Type:</strong> {cashFlow.debit_credit === "CREDIT" ? "Income" : "Expense"}</div>
                <div><strong>Transaction Type:</strong> {cashFlow.transaction_type}</div>
              </div>
            </div>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
