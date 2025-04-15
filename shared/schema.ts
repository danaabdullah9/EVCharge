import { pgTable, text, serial, integer, boolean, timestamp, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  profileImage: text("profile_image"),
  points: integer("points").default(0).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  profileImage: true,
});

// Charging Station schema
export const stations = pgTable("stations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  chargerType: text("charger_type").notNull(),
  powerOutput: real("power_output").notNull(),
  hours: text("hours").notNull(),
  price: text("price"),
  amenities: json("amenities").notNull(),
  status: text("status").default("available").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertStationSchema = createInsertSchema(stations).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

// Station Report schema
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  stationId: integer("station_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  issues: json("issues"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  timestamp: true,
});

// Favorites schema
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  stationId: integer("station_id").notNull(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Station = typeof stations.$inferSelect;
export type InsertStation = z.infer<typeof insertStationSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;

// Station with additional calculated fields
export type StationWithStats = Station & {
  rating: number;
  reviewCount: number;
  availability: number;
  reliability: number;
  isFavorite: boolean;
  reports: (Report & { user: User })[];
  lastReported: string;
};
