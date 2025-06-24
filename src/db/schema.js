import { varchar } from 'drizzle-orm/pg-core';
import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const favoritesTable = pgTable('favorites', {
    id: serial('id').primaryKey(),
    user_id: varchar('user_id'),
    content_id: varchar('content_id'),
    title: varchar('title').notNull(),
    descript: text('descript'),
    image_url: varchar('image_url'),
    category_id: integer('category_id').notNull(),
});