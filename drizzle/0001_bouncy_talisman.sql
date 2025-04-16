ALTER TABLE "Users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Families" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "Families" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "first_name" varchar(100);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "middle_initial" varchar(8);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "surname" varchar(100);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "full_name" varchar(255);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "phone_number" varchar(32);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "dob" varchar(16);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "tax_file_number" varchar(64);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "preferences" jsonb;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "status" varchar(32);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "role" varchar(32);--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "last_login" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "Users" ADD CONSTRAINT "Users_email_unique" UNIQUE("email");