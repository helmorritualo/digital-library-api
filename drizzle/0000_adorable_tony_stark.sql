CREATE TABLE `bookmarks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`book_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`file_path` varchar(255) NOT NULL,
	`cover_path` varchar(255) NOT NULL,
	`author_name` varchar(100) NOT NULL,
	`category_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reading_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`book_id` int NOT NULL,
	`page_number` int NOT NULL DEFAULT 1,
	`progress_percentage` decimal(5,2) NOT NULL DEFAULT '0.00',
	`session_duration` int,
	`last_read_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reading_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `refresh_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`is_revoked` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`book_id` int NOT NULL,
	`rating` int NOT NULL DEFAULT 0,
	`comment` text NOT NULL,
	`is_public` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`contact_number` varchar(11) NOT NULL,
	`gender` enum('male','female','other') NOT NULL,
	`address` varchar(255) NOT NULL,
	`role` enum('admin','user') NOT NULL DEFAULT 'user',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `books` ADD CONSTRAINT `books_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_sessions` ADD CONSTRAINT `reading_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reading_sessions` ADD CONSTRAINT `reading_sessions_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_book_id_books_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_bookmarks_user_id` ON `bookmarks` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_bookmarks_book_id` ON `bookmarks` (`book_id`);--> statement-breakpoint
CREATE INDEX `idx_books_title` ON `books` (`title`);--> statement-breakpoint
CREATE INDEX `idx_books_category_id` ON `books` (`category_id`);--> statement-breakpoint
CREATE INDEX `idx_categories_name` ON `categories` (`name`);--> statement-breakpoint
CREATE INDEX `idx_reading_sessions_user_id` ON `reading_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_reading_sessions_book_id` ON `reading_sessions` (`book_id`);--> statement-breakpoint
CREATE INDEX `idx_reading_sessions_last_read_at` ON `reading_sessions` (`last_read_at`);--> statement-breakpoint
CREATE INDEX `idx_refresh_tokens_user_id` ON `refresh_tokens` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_refresh_tokens_expires_at` ON `refresh_tokens` (`expires_at`);--> statement-breakpoint
CREATE INDEX `idx_refresh_tokens_is_revoked` ON `refresh_tokens` (`is_revoked`);--> statement-breakpoint
CREATE INDEX `idx_reviews_user_id` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_book_id` ON `reviews` (`book_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_rating` ON `reviews` (`rating`);--> statement-breakpoint
CREATE INDEX `idx_reviews_comment` ON `reviews` (`comment`);--> statement-breakpoint
CREATE INDEX `idx_reviews_is_public` ON `reviews` (`is_public`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_password` ON `users` (`password`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_users_is_active` ON `users` (`is_active`);