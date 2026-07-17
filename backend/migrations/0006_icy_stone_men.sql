CREATE TABLE `package_faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`package_id` integer NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON UPDATE no action ON DELETE cascade
);
