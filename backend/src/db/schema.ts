import {
  pgTable,
  text,
  uuid,
  varchar,
  boolean,
  integer,
  timestamp,
  decimal,
  date,
  jsonb,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const voteTypeEnum = pgEnum('vote_type', ['UP', 'DOWN']);
export const postTagEnum = pgEnum('post_tag', ['review', 'question', 'tip', 'experience', 'recommendation']);
export const activityTypeEnum = pgEnum('activity_type', ['search', 'view_destination', 'view_tip', 'create_plan', 'vote', 'bookmark']);

// Users table - Simple JWT auth (no Clerk)
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    password_hash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    is_native: boolean('is_native').default(false),
    avatar_url: text('avatar_url'),
    bio: text('bio'),
    preferences: jsonb('preferences').default('{}'),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
  }
);

// Posts table (for reviews and discussions)
export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    content: text('content').notNull(),
    image_url: text('image_url'), // Photo for post
    tag: postTagEnum('tag').default('review'),
    destination_id: uuid('destination_id').references(() => destinations.id),
    destination_name: varchar('destination_name', { length: 255 }),
    created_by: uuid('created_by').references(() => users.id).notNull(),
    is_edited: boolean('is_edited').default(false),
    upvotes: integer('upvotes').default(0),
    downvotes: integer('downvotes').default(0),
    reply_count: integer('reply_count').default(0),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
  }
);

// Post Votes table
export const post_votes = pgTable(
  'post_votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    post_id: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    voted_by: uuid('voted_by').references(() => users.id).notNull(),
    vote_type: voteTypeEnum('vote_type').notNull(),
    voted_at: timestamp('voted_at').default(sql`NOW()`),
  }
);

// Replies table
export const replies = pgTable(
  'replies',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    post_id: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
    content: text('content').notNull(),
    created_by: uuid('created_by').references(() => users.id).notNull(),
    parent_reply_id: uuid('parent_reply_id'), // For nested replies
    is_edited: boolean('is_edited').default(false),
    upvotes: integer('upvotes').default(0),
    downvotes: integer('downvotes').default(0),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
  }
);

// Reply Votes table
export const reply_votes = pgTable(
  'reply_votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    reply_id: uuid('reply_id').references(() => replies.id, { onDelete: 'cascade' }).notNull(),
    voted_by: uuid('voted_by').references(() => users.id).notNull(),
    vote_type: voteTypeEnum('vote_type').notNull(),
    voted_at: timestamp('voted_at').default(sql`NOW()`),
  }
);

// Destinations table
export const destinations = pgTable(
  'destinations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    image_url: text('image_url'),
    category: varchar('category', { length: 100 }),
    latitude: decimal('latitude', { precision: 10, scale: 8 }),
    longitude: decimal('longitude', { precision: 11, scale: 8 }),
    avg_budget: integer('avg_budget'),
    avg_days: integer('avg_days'),
    popularity_score: integer('popularity_score').default(0),
    tags: text('tags').array(),
    highlights: text('highlights').array(),
    created_at: timestamp('created_at').default(sql`NOW()`),
  }
);

// Seasonal Weather table
export const seasonal_weather = pgTable(
  'seasonal_weather',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    destination_id: uuid('destination_id')
      .references(() => destinations.id)
      .notNull(),
    season: varchar('season', { length: 20 }).notNull(),
    avg_temp: integer('avg_temp'),
    humidity: integer('humidity'),
    rainfall: integer('rainfall'),
    comfort_score: integer('comfort_score'),
    seasonal_score: integer('seasonal_score'),
    description: text('description'),
    best_activities: text('best_activities').array(),
  }
);

// Tips table
export const tips = pgTable(
  'tips',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    destination_id: uuid('destination_id')
      .references(() => destinations.id)
      .notNull(),
    destination_name: varchar('destination_name', { length: 255 }),
    content: text('content').notNull(),
    image_url: text('image_url'),
    season: varchar('season', { length: 20 }),
    tags: text('tags').array(),
    upvotes: integer('upvotes').default(0),
    downvotes: integer('downvotes').default(0),
    featured: boolean('featured').default(false),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
  }
);

// Votes table
export const votes = pgTable(
  'votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    tip_id: uuid('tip_id')
      .references(() => tips.id)
      .notNull(),
    vote_type: varchar('vote_type', { length: 10 }),
    created_at: timestamp('created_at').default(sql`NOW()`),
  }
);

// Travel Plans table
export const travel_plans = pgTable(
  'travel_plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    destination_id: uuid('destination_id')
      .references(() => destinations.id)
      .notNull(),
    budget: integer('budget'),
    days: integer('days'),
    travel_type: varchar('travel_type', { length: 20 }),
    season: varchar('season', { length: 20 }),
    start_date: date('start_date'),
    end_date: date('end_date'),
    status: varchar('status', { length: 20 }).default('draft'),
    notes: text('notes'),
    itinerary: jsonb('itinerary'),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
  }
);

// Bookmarks table - Users can save destinations
export const bookmarks = pgTable(
  'bookmarks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .references(() => users.id)
      .notNull(),
    destination_id: uuid('destination_id')
      .references(() => destinations.id, { onDelete: 'cascade' })
      .notNull(),
    notes: text('notes'),
    created_at: timestamp('created_at').default(sql`NOW()`),
  }
);

// User Activity table - For analytics and tracking
export const user_activity = pgTable(
  'user_activity',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id').references(() => users.id),
    session_id: varchar('session_id', { length: 255 }),
    activity_type: varchar('activity_type', { length: 50 }).notNull(),
    destination_id: uuid('destination_id').references(() => destinations.id),
    metadata: jsonb('metadata').default('{}'),
    created_at: timestamp('created_at').default(sql`NOW()`),
  }
);

// Type exports for use in other files
export type UserRecord = typeof users.$inferSelect;
export type DestinationRecord = typeof destinations.$inferSelect;
export type SeasonalWeatherRecord = typeof seasonal_weather.$inferSelect;
export type TipRecord = typeof tips.$inferSelect;
export type VoteRecord = typeof votes.$inferSelect;
export type TravelPlanRecord = typeof travel_plans.$inferSelect;
export type PostRecord = typeof posts.$inferSelect;
export type PostVoteRecord = typeof post_votes.$inferSelect;
export type ReplyRecord = typeof replies.$inferSelect;
export type ReplyVoteRecord = typeof reply_votes.$inferSelect;
export type BookmarkRecord = typeof bookmarks.$inferSelect;
export type UserActivityRecord = typeof user_activity.$inferSelect;
