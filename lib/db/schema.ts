import { pgTable, text, timestamp, integer, boolean, jsonb, uuid, varchar, serial } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

// ============================================================================
// LEARNING PHASES
// ============================================================================

export const phases = pgTable("phases", {
  id: serial("id").primaryKey(),
  phaseNumber: integer("phase_number").notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 50 }),
  completionType: varchar("completion_type", { length: 50 }).notNull(), // 'automated' | 'checklist' | 'code_review'
});

export const userPhaseProgress = pgTable("user_phase_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  phaseId: integer("phase_id").references(() => phases.id).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'locked' | 'unlocked' | 'in_progress' | 'completed'
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

// ============================================================================
// LESSONS & EXERCISES
// ============================================================================

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  phaseId: integer("phase_id").references(() => phases.id).notNull(),
  lessonNumber: integer("lesson_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // 'exercise' | 'tutorial' | 'quiz' | 'checklist'
  content: jsonb("content"), // Exercise config, tutorial content, etc.
  requiredForCompletion: boolean("required_for_completion").default(true),
});

export const userLessonProgress = pgTable("user_lesson_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id).notNull(),
  status: varchar("status", { length: 50 }).notNull(), // 'not_started' | 'in_progress' | 'completed'
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  timeSpentSeconds: integer("time_spent_seconds").default(0),
  attempts: integer("attempts").default(0),
  hintsUsed: integer("hints_used").default(0),
  checklistData: jsonb("checklist_data"), // For Phase 3-4 manual checkboxes
  codeReviewStatus: varchar("code_review_status", { length: 50 }), // 'pending' | 'approved' | 'needs_fixes'
  codeReviewFeedback: text("code_review_feedback"),
});

// ============================================================================
// CODE SUBMISSIONS (Phases 1-2)
// ============================================================================

export const codeSubmissions = pgTable("code_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id).notNull(),
  code: text("code").notNull(),
  result: jsonb("result").notNull(), // Test results, errors, output
  passed: boolean("passed").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  executionTimeMs: integer("execution_time_ms"),
});

// ============================================================================
// HINT TRACKING
// ============================================================================

export const hintUsage = pgTable("hint_usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id).notNull(),
  hintLevel: integer("hint_level").notNull(), // 1, 2, or 3
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
});

// ============================================================================
// ACTIVITY SESSIONS (Time Tracking)
// ============================================================================

export const activitySessions = pgTable("activity_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lessonId: uuid("lesson_id").references(() => lessons.id),
  phaseId: integer("phase_id").references(() => phases.id),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
  activityType: varchar("activity_type", { length: 50 }), // 'coding' | 'reading' | 'chess'
});

// ============================================================================
// CHESS GAME SESSIONS (Phases 3-5)
// ============================================================================

export const chessGameSessions = pgTable("chess_game_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  phaseId: integer("phase_id").references(() => phases.id).notNull(),
  opponent: varchar("opponent", { length: 50 }), // 'self' | 'ai' | 'chess-llama'
  moveHistory: jsonb("move_history").notNull(), // Array of moves in algebraic notation
  finalPosition: jsonb("final_position"), // Board state
  result: varchar("result", { length: 50 }), // 'white_wins' | 'black_wins' | 'draw' | 'abandoned'
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  durationSeconds: integer("duration_seconds"),
});

// ============================================================================
// DAILY STATS (Pre-aggregated Analytics)
// ============================================================================

export const dailyUserStats = pgTable("daily_user_stats", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  date: timestamp("date").notNull(),
  totalTimeSeconds: integer("total_time_seconds").default(0),
  exercisesCompleted: integer("exercises_completed").default(0),
  hintsUsed: integer("hints_used").default(0),
  codeSubmissions: integer("code_submissions").default(0),
  successfulSubmissions: integer("successful_submissions").default(0),
  chessGamesPlayed: integer("chess_games_played").default(0),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  phaseProgress: many(userPhaseProgress),
  lessonProgress: many(userLessonProgress),
  codeSubmissions: many(codeSubmissions),
  hintUsage: many(hintUsage),
  activitySessions: many(activitySessions),
  chessGameSessions: many(chessGameSessions),
  dailyStats: many(dailyUserStats),
}));

export const phasesRelations = relations(phases, ({ many }) => ({
  lessons: many(lessons),
  userProgress: many(userPhaseProgress),
  activitySessions: many(activitySessions),
  chessGameSessions: many(chessGameSessions),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  phase: one(phases, {
    fields: [lessons.phaseId],
    references: [phases.id],
  }),
  userProgress: many(userLessonProgress),
  codeSubmissions: many(codeSubmissions),
  hintUsage: many(hintUsage),
  activitySessions: many(activitySessions),
}));

export const userPhaseProgressRelations = relations(userPhaseProgress, ({ one }) => ({
  user: one(users, {
    fields: [userPhaseProgress.userId],
    references: [users.id],
  }),
  phase: one(phases, {
    fields: [userPhaseProgress.phaseId],
    references: [phases.id],
  }),
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
  user: one(users, {
    fields: [userLessonProgress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [userLessonProgress.lessonId],
    references: [lessons.id],
  }),
}));
