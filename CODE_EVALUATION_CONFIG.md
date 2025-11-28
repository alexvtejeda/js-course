# Code Evaluation Configuration

This file documents important configuration settings for the code evaluation system.

## Infinite Loop Timeout

**Location:** `lib/code-eval/evaluator.ts:8`

**Current Setting:** 15 seconds (15000ms)

```typescript
const EXECUTION_TIMEOUT = 15000; // 15 seconds
```

### How it works:
- When a user submits code, it is executed with a 15-second timeout
- If the code takes longer than 15 seconds, it will be terminated
- The user receives a detailed error message explaining the timeout and suggesting they check for infinite loops

### Error Message:
```
Your code took too long to execute (>15 seconds). This usually indicates an infinite loop.
Check your loop conditions and make sure they will eventually terminate.
```

### Adjusting the Timeout:
If you need to change the timeout duration:
1. Open `lib/code-eval/evaluator.ts`
2. Modify the `EXECUTION_TIMEOUT` constant on line 8
3. The value is in milliseconds (1000ms = 1 second)

**Examples:**
- 10 seconds: `const EXECUTION_TIMEOUT = 10000;`
- 30 seconds: `const EXECUTION_TIMEOUT = 30000;`
- 1 minute: `const EXECUTION_TIMEOUT = 60000;`

### Why 15 seconds?
This timeout strikes a balance between:
- **User Experience:** Users don't have to wait too long for infinite loops to be detected
- **Complex Solutions:** Gives legitimate complex solutions enough time to execute
- **Server Resources:** Prevents runaway code from consuming excessive server resources

## Code Persistence & Auto-Load

**Location:** `components/learning/CodeEditor.tsx`

### How it works:
- Every code submission is saved to the database with a timestamp
- When a user returns to an exercise, the most recent submission automatically loads
- Users can see their previous work and continue where they left off
- Submissions are associated with user ID and exercise ID for proper isolation

### Database Storage:
```typescript
// Saved in codeSubmissions table:
{
  userId: string,
  exerciseId: string,
  code: string,
  passed: boolean,
  submittedAt: timestamp
}
```

### API Endpoint:
- **GET** `/api/submissions?exerciseId=<id>` - Retrieves most recent submission
- Returns the saved code or null if no previous submission exists
- Includes `credentials: 'include'` for cookie-based session auth

### Benefits:
- **Continuity**: Users can pick up where they left off
- **Learning**: Review previous attempts to understand progress
- **Convenience**: No need to rewrite code from scratch each time
- **Data Integrity**: All submissions tracked for analytics

## Activity Tracking

**Locations:**
- `app/api/activity/route.ts` - Activity tracking API
- `lib/db/index.ts` - Database queries for daily stats
- `app/dashboard/page.tsx` - Activity heatmap visualization

### How it works:
- Activity events logged when users visit phase pages
- Daily statistics aggregated from activitySessions table
- 7-day activity heatmap displayed on dashboard
- Provides engagement feedback to motivate learners

### Activity Event Types:
- Phase page visits (phase-1, phase-2, etc.)
- Lesson starts and completions
- Code submissions
- Hint requests

### API Endpoints:
- **GET** `/api/activity` - Retrieves 7 days of activity stats
- **POST** `/api/activity` - Logs new activity event

### Dashboard Visualization:
- Heatmap shows activity intensity over 7 days
- Each day displays submission count
- Visual feedback encourages daily practice
- Helps users track their learning consistency
