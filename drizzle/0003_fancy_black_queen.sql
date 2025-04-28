CREATE TABLE "family_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "family_roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "family_members" RENAME COLUMN "role" TO "family_role_id";--> statement-breakpoint
ALTER TABLE "family_members" ADD CONSTRAINT "family_members_family_role_id_family_roles_id_fk" FOREIGN KEY ("family_role_id") REFERENCES "public"."family_roles"("id") ON DELETE no action ON UPDATE no action;