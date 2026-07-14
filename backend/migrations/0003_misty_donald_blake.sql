CREATE TABLE `admin_credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`updated_at` integer NOT NULL
);
