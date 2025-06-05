import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/mysql-core";
import {
    mysqlEnum as Enum,
    index,
    mysqlTable as table,
} from "drizzle-orm/mysql-core";

export const users = table(
    "users",
    {
        id: t.int("id").primaryKey().autoincrement(),
        name: t.varchar("full_name", { length: 255 }).notNull(),
        email: t.varchar("email", { length: 255 }).notNull().unique(),
        password: t.varchar("password", { length: 255 }).notNull(),
        contact_number: t.varchar("contact_number", { length: 11 }).notNull(),
        gender: Enum(["male", "female", "other"]).notNull(),
        address: t.varchar("address", { length: 255 }).notNull(),
        role: Enum(["admin", "user"]).default("user").notNull(),
        isActive: t.boolean("is_active").default(true),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        updatedAt: t
            .timestamp("updated_at")
            .defaultNow()
            .onUpdateNow()
            .notNull(),
    },
    (table) => [
        index("idx_users_email").on(table.email),
        index("idx_users_password").on(table.password),
        index("idx_users_role").on(table.role),
        index("idx_users_is_active").on(table.isActive),
    ]
);

export const refreshTokens = table(
    "refresh_tokens",
    {
        id: t.int("id").primaryKey().autoincrement(),
        userId: t
            .int("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        token: t.varchar("token", { length: 255 }).notNull(),
        expiresAt: t.timestamp("expires_at").notNull(),
        isRevoked: t.boolean("is_revoked").default(false).notNull(),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_refresh_tokens_user_id").on(table.userId),
        index("idx_refresh_tokens_expires_at").on(table.expiresAt),
        index("idx_refresh_tokens_is_revoked").on(table.isRevoked),
    ]
);

export const categories = table(
    "categories",
    {
        id: t.int("id").primaryKey().autoincrement(),
        name: t.varchar("name", { length: 100 }).notNull(),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        updatedAt: t
            .timestamp("updated_at")
            .defaultNow()
            .onUpdateNow()
            .notNull(),
    },
    (table) => [index("idx_categories_name").on(table.name)]
);

export const books = table(
    "books",
    {
        id: t.int("id").primaryKey().autoincrement(),
        title: t.varchar("title", { length: 100 }).notNull(),
        description: t.text("description").notNull(),
        file_path: t.varchar("file_path", { length: 255 }).notNull(),
        cover_path: t.varchar("cover_path", { length: 255 }).notNull(),
        author_name: t.varchar("author_name", { length: 100 }).notNull(),
        category_id: t
            .int("category_id")
            .references(() => categories.id, { onDelete: "set null" }),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        updatedAt: t
            .timestamp("updated_at")
            .defaultNow()
            .onUpdateNow()
            .notNull(),
    },
    (table) => [
        index("idx_books_title").on(table.title),
        index("idx_books_category_id").on(table.category_id),
    ]
);

export const bookmarks = table(
    "bookmarks",
    {
        id: t.int("id").primaryKey().autoincrement(),
        user_id: t
            .int("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        book_id: t
            .int("book_id")
            .notNull()
            .references(() => books.id, { onDelete: "cascade" }),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_bookmarks_user_id").on(table.user_id),
        index("idx_bookmarks_book_id").on(table.book_id),
    ]
);

export const reviews = table(
    "reviews",
    {
        id: t.int("id").primaryKey().autoincrement(),
        user_id: t
            .int("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        book_id: t
            .int("book_id")
            .notNull()
            .references(() => books.id, { onDelete: "cascade" }),
        rating: t.int("rating").notNull().default(0),
        comment: t.text("comment").notNull(),
        is_public: t.boolean("is_public").default(true).notNull(),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        updatedAt: t
            .timestamp("updated_at")
            .defaultNow()
            .onUpdateNow()
            .notNull(),
    },
    (table) => [
        index("idx_reviews_user_id").on(table.user_id),
        index("idx_reviews_book_id").on(table.book_id),
        index("idx_reviews_rating").on(table.rating),
        index("idx_reviews_comment").on(table.comment),
        index("idx_reviews_is_public").on(table.is_public),
    ]
);

export const reading_sessions = table(
    "reading_sessions",
    {
        id: t.int("id").primaryKey().autoincrement(),
        user_id: t
            .int("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        book_id: t
            .int("book_id")
            .notNull()
            .references(() => books.id, { onDelete: "cascade" }),
        page_number: t.int("page_number").default(1).notNull(),
        progress_percentage: t
            .decimal("progress_percentage", { precision: 5, scale: 2 })
            .default("0.00")
            .notNull(),
        session_duration: t.int("session_duration"), // Duration in minutes
        last_read_at: t.timestamp("last_read_at"),
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        index("idx_reading_sessions_user_id").on(table.user_id),
        index("idx_reading_sessions_book_id").on(table.book_id),
        index("idx_reading_sessions_last_read_at").on(table.last_read_at),
    ]
);

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
    refreshTokens: many(refreshTokens),
    books: many(books),
    bookmarks: many(bookmarks),
    reviews: many(reviews),
    readingSessions: many(reading_sessions),
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
    user: one(users, {
        fields: [refreshTokens.userId],
        references: [users.id],
    }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    books: many(books), // Books in category
}));

export const booksRelations = relations(books, ({ one, many }) => ({
    category: one(categories, {
        fields: [books.category_id],
        references: [categories.id],
    }),
    bookmarks: many(bookmarks), // Bookmarks for this book
    reviews: many(reviews), // Reviews for this book
    readingSessions: many(reading_sessions), // Reading sessions for this book
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
    user: one(users, {
        fields: [bookmarks.user_id],
        references: [users.id],
    }),
    book: one(books, {
        fields: [bookmarks.book_id],
        references: [books.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    user: one(users, {
        fields: [reviews.user_id],
        references: [users.id],
    }),
    book: one(books, {
        fields: [reviews.book_id],
        references: [books.id],
    }),
}));

export const readingSessionsRelations = relations(
    reading_sessions,
    ({ one }) => ({
        user: one(users, {
            fields: [reading_sessions.user_id],
            references: [users.id],
        }),
        book: one(books, {
            fields: [reading_sessions.book_id],
            references: [books.id],
        }),
    })
);
