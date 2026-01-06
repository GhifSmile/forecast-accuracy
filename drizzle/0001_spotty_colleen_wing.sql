ALTER TABLE "master_user" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "master_user" ALTER COLUMN "is_active" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "master_user" ADD COLUMN "role" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "master_user" ADD COLUMN "updated_at" timestamp DEFAULT now();