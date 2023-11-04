import {pgTable, serial, text, timestamp} from 'drizzle-orm/pg-core';

export const $notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createAt: timestamp('created_at').notNull().defaultNow(),
    imageUrl: text('image_url'),
    userId: text('user_id').notNull(),
    editorState: text('editor_state').notNull(),
});

export type NoteType = typeof $notes.$inferInsert;

// Drizzle interacts with the database through a connection pool.
// drizzle-kit provides a connection pool for Postgres and Neon.

