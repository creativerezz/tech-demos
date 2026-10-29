CREATE TABLE `links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text,
	`note` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
