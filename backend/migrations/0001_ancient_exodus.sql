CREATE TABLE `admin_login_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ip` text NOT NULL,
	`created_at` integer NOT NULL
);
