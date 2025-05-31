"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { type User as UserType } from "@/lib/actions/users";
import { type Role } from "@/lib/drizzle/schema";

interface AddUserFormProps {
  setOpen: (open: boolean) => void;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  roleId: z.string().min(1, "Role is required"),
});

interface CreatedUserDetails {
  id: string;
  full_name: string | null;
  role: string | null;
}

export function AddUserForm({ setOpen }: AddUserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreatedUserDetails | null>(
    null
  );

  useEffect(() => {
    async function fetchRoles() {
      const loadingToast = toast.loading("Loading roles...");
      try {
        const response = await fetch("/api/roles");
        
        toast.dismiss(loadingToast);
        
        if (!response.ok) {
          toast.error("Could not load roles. Please try again.");
          throw new Error("Failed to fetch roles");
        }
        
        const data = await response.json();
        setRoles(data.roles || []);
        toast.success("Roles loaded successfully");
        return data;
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Could not load roles. Please try again.");
        console.error("Error fetching roles:", error);
      }
    }
    fetchRoles();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      roleId: roles.length > 0 ? roles[0].id : "",
    },
  });

  useEffect(() => {
    if (roles.length > 0 && !form.getValues("roleId")) {
      form.setValue("roleId", roles[0].id);
    }
  }, [roles, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("[AddUserForm] onSubmit triggered with values:", values);
    setIsSubmitting(true);

    try {
      const loadingToast = toast.loading("Creating user...");
      
      try {
        const response = await fetch("/api/users/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        toast.dismiss(loadingToast);
        
        if (!response.ok) {
          toast.error(result.error || "Failed to create user");
          throw new Error(result.error || "Failed to create user");
        }

        toast.success("User created successfully!");
        
        setOpen(false);
        form.reset();
        router.refresh();

        if (result.user) {
          const newUser: UserType = result.user;
          setCreatedUser({
            id: newUser.id,
            full_name: newUser.full_name,
            role: newUser.role,
          });
          setShowSuccessModal(true);
        }
        
        return result;
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to create user");
        throw error;
      }
    } catch (err: any) {
      // Error is already handled by the toast service
      console.error("Error creating user:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoToUsersPage = () => {
    setShowSuccessModal(false);
    router.push("/users");
  };

  const handleGoToEditUserDetails = () => {
    if (createdUser) {
      setShowSuccessModal(false);
      router.push(`/users/${createdUser.id}/edit`);
    }
  };

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Enter the details for the new user and assign their initial role.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password (min 8 characters)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={roles.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            roles.length === 0
                              ? "Loading roles..."
                              : "Select a role"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || roles.length === 0}
              >
                {isSubmitting ? "Creating User..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      {createdUser && (
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Created Successfully</DialogTitle>
              <DialogDescription>
                {createdUser.full_name || "The user"} has been created
                successfully as a {createdUser.role || "new"} role.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between pt-4">
              <Button variant="outline" onClick={handleGoToUsersPage}>
                Go to Users Page
              </Button>
              <Button onClick={handleGoToEditUserDetails}>
                Go to Edit User Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
