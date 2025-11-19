<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).


# Workout Tracker API

REST API for personal and group workout management, built with NestJS and PostgreSQL.

## Features

- 🔐 JWT Authentication with refresh tokens
- 👤 User profiles and management
- 🏋️ Workout tracking and management
- 👥 Collaborative group system
- 📊 Personal and group progress tracking
- 🏆 Group rankings and statistics
- 👑 Role-based access control (admin/member)

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## ⚙️ Environment Setup

Create a `.env` file in the root directory:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=workout_tracker

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

## 📚 API Documentation

### 🔐 Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer {access_token}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {access_token}
```

---

### 🏋️ Workouts

#### Create Workout
```http
POST /workouts
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Chest and Triceps Routine",
  "description": "Strength training workout",
  "exercises": [
    {
      "name": "Bench Press",
      "sets": 4,
      "reps": 10,
      "weight": 80
    }
  ],
  "groupId": "optional-group-id"
}
```

#### Get Workout by ID
```http
GET /workouts/:id
Authorization: Bearer {access_token}
```

#### Complete Workout
```http
POST /workouts/:id/complete
Authorization: Bearer {access_token}
```

#### Delete Workout
```http
DELETE /workouts/:id
Authorization: Bearer {access_token}
```

---

### 📊 Progress

#### My Personal Progress
```http
GET /progress/me
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "totalWorkouts": 45,
  "completedThisWeek": 5,
  "streak": 7,
  "stats": {
    "avgWorkoutsPerWeek": 6.2
  }
}
```

#### My Progress in Group
```http
GET /progress/group/:groupId/me
Authorization: Bearer {access_token}
```

#### Group Overall Progress
```http
GET /progress/group/:groupId
Authorization: Bearer {access_token}
```

#### Group Ranking
```http
GET /progress/group/:groupId/ranking
Authorization: Bearer {access_token}
```

**Response:**
```json
[
  {
    "userId": "user-id-1",
    "name": "John Doe",
    "completedWorkouts": 32,
    "position": 1
  },
  {
    "userId": "user-id-2",
    "name": "Jane Smith",
    "completedWorkouts": 28,
    "position": 2
  }
]
```

---

### 👥 Groups

#### Create Group
```http
POST /groups
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "CrossFit Team",
  "description": "Functional training group"
}
```

#### Get My Groups
```http
GET /groups/my-groups
Authorization: Bearer {access_token}
```

#### Get Group Details
```http
GET /groups/:groupId
Authorization: Bearer {access_token}
```

#### Get Group Members
```http
GET /groups/:groupId/members
Authorization: Bearer {access_token}
```

#### Get Group Workouts
```http
GET /groups/:groupId/workouts
Authorization: Bearer {access_token}
```

#### Update Member Role
```http
PUT /groups/:groupId/members/:userId/role
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "role": "admin" // or "member"
}
```

**Note:** Only admins can change roles.

#### Remove Member from Group
```http
DELETE /groups/:groupId/members/:userId
Authorization: Bearer {access_token}
```

**Note:** Only admins can remove members.

#### Leave Group
```http
POST /groups/:groupId/leave
Authorization: Bearer {access_token}
```

#### Delete Group
```http
DELETE /groups/:groupId
Authorization: Bearer {access_token}
```

**Note:** Only the group creator can delete the group.

---

## 🔒 Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

Include the token in the header of each request:
```
Authorization: Bearer {your_access_token}
```

Access tokens expire in 15 minutes. Use the `/auth/refresh` endpoint to obtain a new token.

---

## 📁 Project Structure
```
src/
├── auth/           # Authentication module
├── users/          # Users module
├── workouts/       # Workouts module
├── groups/         # Groups module
└── progress/       # Progress and statistics module
```

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
