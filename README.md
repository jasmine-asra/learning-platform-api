# Learning Platform API

A serverless API built with Express.js to track user statistics for a particular course. This service is designed to be easily deployable and runnable within the AWS ecosystem using AWS Lambda and DynamoDB.

## Contents
- [Features](#features)
- [Table Schema](#table-schema)
- [API Endpoints](#api-endpoints)
  - [Persist a study session](#1-persist-a-study-session)
  - [Fetch course lifetime stats](#2-fetch-course-lifetime-stats)
  - [Fetch a single learning session](#3-fetch-a-single-learning-session)
- [Installation](#installation)
- [Deploying to AWS](#deploying-to-aws)
- [Running Locally](#running-locally)
  - [Prerequisites](#prerequisites)
  - [Start DynamoDB Local](#1-start-dynamodb-local)
  - [Set Up Environment Variables](#2-set-up-environment-variables)
  - [Create DynamoDB Table](#3-create-dynamodb-table)
  - [Start the API Server Locally](#4-start-the-api-server-locally)
- [Tests](#tests)
- [Additional Notes](#additional-notes)
- [License](#license)

## Features
- Persist and track user learning session statistics.
- Fetch aggregated statistics for a specific course.
- Fetch statistics for a single learning session.
- Easily deployable to AWS Lambda via Serverless Framework.
- Can be run locally using DynamoDB Local.

## Table Schema

| Attribute Name | Type | Description |
|---------------|------|-------------|
| `userId` | String (Partition Key) | The user’s unique ID |
| `sessionId` | String (Sort Key) | Unique session ID (UUID) |
| `courseId` | String | The course ID the stats belong to |
| `totalModulesStudied` | Number | Number of modules studied in the course or session |
| `timeStudied` | Number | Time spent studying (in minutes) |
| `averageScore` | Number | User’s average score for the course or session |

## API Endpoints

### Common Headers (for all requests):
- `userId`: The unique user ID (required)

### **1. Persist a study session**
**POST** `/courses/{courseId}`

**Request Example**
```sh
curl -X POST <api-endpoint>/courses/<courseId> \
  -H "Content-Type: application/json" \
  -H "userId: <userId>" \
  -d '{
    "sessionId": "<uuid-value>",
    "totalModulesStudied": <number>,
    "timeStudied": <number>,
    "averageScore": <number>
  }'
```

### **2. Fetch course lifetime stats**
**GET** `/courses/{courseId}`

**Response Example:**
```json
{
  "totalModulesStudied": 10,
  "timeStudied": 120,
  "averageScore": 88
}
```

**Request Example**
```sh
curl -X GET <api-endpoint>/courses/<courseId> \
  -H "userId: <userId>"
```

### **3. Fetch a single learning session**
**GET** `/courses/{courseId}/sessions/{sessionId}`

**Response Example:**
```json
{
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "totalModulesStudied": 5,
  "timeStudied": 60,
  "averageScore": 92
}
```

**Request Example**
```sh
curl -X GET <api-endpoint>/courses/<courseId>/sessions/<sessionId> \
  -H "userId: <userId>"
```

---

## Installation

### Prerequisites
- Node.js & npm

### Steps
#### 1. Install dependencies
Before deploying or running locally, install the necessary dependencies:
```sh
npm install
```

---

## Deploying to AWS

### Prerequisites
- `serverless` CLI (`npm install -g serverless`)
- AWS CLI (configured with credentials)

### Steps
#### 1. Ensure your AWS credentials are properly configured:
```sh
aws configure
```
#### 2. Deploy the service using Serverless Framework:
```sh
serverless deploy
```
Once deployed, Serverless will provide the API Gateway endpoint for accessing your API.

---

## Running Locally

### Prerequisites
- Docker (for running DynamoDB Local)
- `ts-node` (`npm install -g ts-node`)

### Steps
#### 1. Start DynamoDB Local
Run the following command to start a local instance of DynamoDB:
```sh
docker run -p 8000:8000 amazon/dynamodb-local
```

#### 2. Set Up Environment Variables
Create a `.env` file in the project root with the following content:
```env
USE_LOCAL_DYNAMODB=true
```

#### 3. Create DynamoDB Table
Run the following command to create the required table:
```sh
ts-node src/config/createTable.ts
```

#### 4. Start the API Server Locally
```sh
npm run dev
```

The server should now be running locally.

---

## Tests

This project uses Jest for testing. To run tests, use the following command:
```sh
npm test
```

---

## Additional Notes

- The `serverless.yml` configuration is set up to deploy the service as AWS Lambda functions.
- The API is stateless; all session statistics are stored in DynamoDB.

---

Author: Jasmine Harper