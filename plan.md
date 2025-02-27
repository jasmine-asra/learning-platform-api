# Goal
A learning platform to track a user's stats for a particular course.

## Requirements
- Stats are persisted based on the completion of a **learning session**.
- Stats can be fetched for a **course**, which aggregates all of a **user's** session stats.
- Stats can be fetched for a single **learning session**.
- Stats should be persisted using a database (DynamoDB)
- The service must be easily runnable & deployable on the AWS ecosystem.

---

# Entities

## Table Schema

| Attribute Name | Type | Description |
|----------------|------|-------------|
| `userId` |String (Partition Key)|The user’s unique ID|
| `sessionId` | String (Sort Key) | Unique session ID (UUID) |
| `courseId` | String | The course ID the stats belong to |
| `totalModulesStudied` |Number|Number of modules studied in the course or session|
| `timeStudied` |Number|Time spent studying (in minutes)|
| `averageScore` |Number|User’s average score for the course or session|

Note: userId is in the request header

---

# Routes

1. **POST /courses/{courseId}**
- **Persists a session study event**
- Saves **totalModulesStudied**, **timeStudied** and **averageScore** for a **sessionId**.

2. **GET /courses/{courseId}**
- **Fetches course lifetime stats**
- Returns the sum of **totalModulesStudied** and **timeStudied**, and the average **averageScore** for a **courseId**.

3. **GET /courses/{courseId}/sessions/{sessionId}**
- **Fetches a single study session**
- Returns the **totalModulesStudied**, **timeStudied** and **averageScore** for a particular **sessionId**.

# Tests

1. **Persists a session study event**
- should save session stats successfully
- should generate sessionId if not provided
- should return 400 if required fields are missing
- should return 500 if database operation fails

2. **Fetches course lifetime stats**
- should fetch and aggregate lifetime stats for a course
- should return 404 if course is not found
- should return 400 if required fields are missing
- should return 500 if database operation fails

3. **Fetches a single study session**
- should fetch stats for a specific session
- should return 404 if session is not found
- should return 400 if required fields are missing
- should return 500 if database operation fails