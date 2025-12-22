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
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerk_id: varchar('clerk_id', { length: 255 }).unique().notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    is_native: boolean('is_native').default(false),
    avatar_url: text('avatar_url'),
    bio: text('bio'),
    preferences: jsonb('preferences'),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
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
    status: varchar('status', { length: 20 }),
    notes: text('notes'),
    itinerary: jsonb('itinerary'),
    created_at: timestamp('created_at').default(sql`NOW()`),
    updated_at: timestamp('updated_at').default(sql`NOW()`),
  }
);

// Type exports for use in other files
export type UserRecord = typeof users.$inferSelect;
export type DestinationRecord = typeof destinations.$inferSelect;
export type SeasonalWeatherRecord = typeof seasonal_weather.$inferSelect;
export type TipRecord = typeof tips.$inferSelect;
export type VoteRecord = typeof votes.$inferSelect;
export type TravelPlanRecord = typeof travel_plans.$inferSelect;
