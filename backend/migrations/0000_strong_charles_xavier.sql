CREATE TABLE `addon_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`hero_image_url` text NOT NULL,
	`hero_image_alt` text NOT NULL,
	`card_image_url` text NOT NULL,
	`card_image_alt` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `addon_categories_slug_unique` ON `addon_categories` (`slug`);--> statement-breakpoint
CREATE TABLE `catalog_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`placement` text NOT NULL,
	`addon_category_id` integer,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`price_cents` integer,
	`is_price_on_request` integer DEFAULT false NOT NULL,
	`category_breadcrumb` text NOT NULL,
	`image_url` text,
	`additional_image_urls` text,
	`description` text NOT NULL,
	`details` text,
	`pricing` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`addon_category_id`) REFERENCES `addon_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_items_slug_unique` ON `catalog_items` (`slug`);--> statement-breakpoint
CREATE TABLE `package_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`package_id` integer NOT NULL,
	`kind` text NOT NULL,
	`url` text NOT NULL,
	`alt` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `package_price_tiers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`package_id` integer NOT NULL,
	`label` text NOT NULL,
	`price_cents` integer NOT NULL,
	`note` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `package_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`package_id` integer NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`price_cents` integer,
	`is_price_on_request` integer DEFAULT false NOT NULL,
	`image_url` text,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`tags` text NOT NULL,
	`inclusions` text NOT NULL,
	`capacity` text NOT NULL,
	`space_requirement` text NOT NULL,
	`starting_price_cents` integer NOT NULL,
	`price_is_placeholder` integer DEFAULT false NOT NULL,
	`damage_deposit_cents` integer,
	`bundle_discount` text,
	`featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `packages_slug_unique` ON `packages` (`slug`);--> statement-breakpoint
CREATE TABLE `quote_inquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`event_date` text NOT NULL,
	`venue` text NOT NULL,
	`guest_count` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quote_inquiry_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_inquiry_id` integer NOT NULL,
	`item_slug` text NOT NULL,
	`item_name` text NOT NULL,
	`item_price_cents` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`quote_inquiry_id`) REFERENCES `quote_inquiries`(`id`) ON UPDATE no action ON DELETE cascade
);
