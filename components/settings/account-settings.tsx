"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast"; // Replace custom hook with direct import
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Remove the useAppToast import
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { validateImageFile, compressImage } from "@/lib/utils/image-utils";
import { AvatarUploadDialog } from "./avatar-upload-dialog";
import { AccountSettingsSkeleton } from "./account-settings-skeleton";
import {
  updateAccountSettings,
  getUserSettings,
  updateUserAvatar,
  removeUserAvatar,
} from "@/app/actions/settings";
import {
  accountSettingsSchema,
  type AccountSettingsData,
} from "@/lib/schemas/settings";

export function AccountSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const { user } = useAuth();

  const form = useForm<AccountSettingsData>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      first_name: "",
      middle_initial: "",
      surname: "",
      email: "",
      phone_number: "",
      dob: "",
      tax_file_number: "",
    },
  });

  // Fetch user settings on component mount
  useEffect(() => {
    async function fetchUserSettings() {
      if (!user?.id) return;

      try {
        // Add a check to prevent redundant fetching if user settings already loaded
        if (userSettings?.id === user.id) return;

        setIsLoading(true);
        const settings = await getUserSettings(user.id);
        if (settings) {
          setUserSettings(settings);
          form.reset({
            first_name: settings.first_name || "",
            middle_initial: settings.middle_initial || "",
            surname: settings.surname || "",
            email: settings.email || "",
            phone_number: settings.phone_number || "",
            dob: settings.dob || "",
            tax_file_number: settings.tax_file_number || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
        toast.error("Failed to load user settings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserSettings();
  }, [user?.id, form, toast, userSettings?.id]);


  async function onSubmit(data: AccountSettingsData) {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateAccountSettings(user.id, data);
      if (result.success) {
        console.log("Account settings updated successfully");
        // toast.success("Account settings updated successfully")
        setUserSettings(result.user);
      } else {
        // toast.error(result.error || "Failed to update account settings");
      }
    } catch (error) {
      console.error("Error updating account settings:", error);
      // toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAvatarUpload(
    fileToUpload: File | Blob,
    originalFileName: string
  ) {
    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    setIsUploadingAvatar(true);

    try {
      // Upload file to server
      const formData = new FormData();
      if (fileToUpload instanceof Blob) {
        formData.append("avatar", fileToUpload, originalFileName);
      } else {
        formData.append("avatar", fileToUpload);
      }

      console.log("Uploading avatar to Supabase storage...");
      const uploadResponse = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        console.error("Upload failed:", uploadResult);
        throw new Error(uploadResult.error || "Failed to upload avatar");
      }

      console.log("Avatar uploaded successfully:", uploadResult.avatarUrl);
      
      // Update user avatar in database
      const result = await updateUserAvatar(user.id, uploadResult.avatarUrl);

      if (result.success) {
        toast.success("Avatar updated successfully");
        setUserSettings(result.user);
      } else {
        console.error("Database update failed:", result);
        throw new Error(result.error || "Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update avatar"
      );
      throw error; // Re-throw to let dialog handle it
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function handleAvatarChange() {
    setShowAvatarDialog(true);
  }

  async function handleAvatarRemove() {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const result = await removeUserAvatar(user.id);

      if (result.success) {
        toast.success("Avatar removed successfully");
        setUserSettings(result.user);
      } else {
        throw new Error(result.error || "Failed to remove avatar");
      }
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to remove avatar"
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function getInitials() {
    if (!userSettings) return "U";
    const first = userSettings.first_name?.[0] || "";
    const last = userSettings.surname?.[0] || "";
    return (first + last).toUpperCase() || "U";
  }

  if (isLoading || !userSettings) {
    return <AccountSettingsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your account information and profile details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16 border border-primary/10">
              <AvatarImage
                src={
                  userSettings?.avatar_url ||
                  "/placeholder.svg?height=64&width=64"
                }
                alt="User"
              />
              <AvatarFallback className="bg-primary/5 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Profile Photo</h4>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAvatarChange}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <span className="flex items-center gap-2">
                      <Spinner size="small" />
                      Uploading...
                    </span>
                  ) : (
                    "Change"
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={handleAvatarRemove}
                  disabled={isUploadingAvatar || !userSettings?.avatar_url}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surname</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your surname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="middle_initial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Initial (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="M"
                        maxLength={1}
                        {...field}
                        value={field.value || ""}
                      />
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
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+61 123 456 789"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Include country code for international numbers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_file_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax File Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 456 789"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Your Australian Tax File Number for financial records
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="small" />
                    Saving...
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Avatar Upload Dialog */}
      <AvatarUploadDialog
        isOpen={showAvatarDialog}
        onClose={() => setShowAvatarDialog(false)}
        onUpload={handleAvatarUpload}
        currentAvatarUrl={userSettings?.avatar_url}
        userInitials={getInitials()}
        isUploading={isUploadingAvatar}
      />
    </div>
  );
}
