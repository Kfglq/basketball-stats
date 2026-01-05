# Basketball Stats System

[Live Demo - Frontend](https://basketball-stats-nine.vercel.app/) | [API Endpoint](https://basketball-stats-dbz1.onrender.com/)

[![Full Stack CI](https://github.com/Kfglq/basketball-stats/actions/workflows/ci.yml/badge.svg)](https://github.com/Kfglq/basketball-stats/actions/workflows/ci.yml)

A full-stack web application designed for managing and visualizing basketball player statistics.
This project demonstrates a scalable architecture for both frontend and backend development.

## Tech Stack

### Frontend

* Framework: Vue 3 (Composition API) with TypeScript

* State Management: Pinia (Customized with an automated Store Factory)

* UI Component Library: Naive UI

* Tools: Axios, SCSS/Sass, Lodash, FontAwesome

### Backend

* Language: Golang (Gin Gonic framework)

* Database: PostgreSQL with sqlx

* Architecture: Clean Architecture (Handler-Service-Repository)

## Key Features

* Clean Architecture (Backend): Robust multi-layer architecture with strict Dependency Injection (DI) for better testability.

* Dynamic Store Factory (Frontend): A custom Pinia store generator using TypeScript Generics to automate state and setter creation, ensuring type safety and reducing boilerplate.

* Predictable Data Flow: Organized store logic following Redux-Saga inspired patterns (Actions/State/Service).

## Project Structure (Frontend Logic)
This architecture is a custom wrapper built on Pinia to enforce strict data flow and modularity.
The frontend data flow is strictly separated to ensure scalability:

```
  stores/
  ├── actions/       # Business logic and asynchronous operations
  ├── service/       # API calling logic
  ├── state/         # Data schema and initial states
  ├── createStore.ts # Core Store Factory (Metaprogramming)
  └── index.ts       # Store entry point
```

## Cloud Architecture & CI/CD

This project implements a fully automated **Modern DevOps Pipeline**. Any change pushed to the `main` branch triggers an automated sequence of quality checks and multi-platform deployments.

### Deployment Infrastructure
* **Frontend Hosting**: **Vercel** (Edge network for optimized content delivery).
* **Backend Hosting**: **Render** (Managed Web Service with automated health checks).
* **Database**: **Neon** (Serverless PostgreSQL providing high availability and persistent storage).

### CI/CD Pipeline (GitHub Actions)
The workflow ensures code integrity before any deployment:
1.  **Backend CI**: 
  * Automated Go environment setup.
  * Dependency verification (`go mod tidy`).
  * **Static Analysis & Unit Testing**: Running `go test` to ensure logic correctness.
  * Build verification.
2.  **Frontend CI**:
  * Node.js environment synchronization.
  * **Type Safety Check**: Running `vue-tsc` to ensure zero TypeScript errors.
  * Production build simulation.
3.  **Automated CD**:
  * Upon successful CI completion, Vercel and Render pull the verified code for zero-downtime deployment.

## Getting Started

### Prerequisites

* Go: 1.20+

* Node.js: 18.x or higher (Recommended: v22.x)

* PostgreSQL: 14+

* Task: Install Task (Recommended for automation)

1. Environment Setup

Create environment files based on the examples provided in both folders:

* Copy backend/.env.example to backend/.env.development

* Copy frontend/.env.example to frontend/.env

2. Installation & Quick Start (Recommended)
If you have Task installed, you can manage the whole project from the root directory:

```
  # Install all dependencies
  go mod tidy && cd frontend && npm install

  # Start Backend (Port 5000)
  task be-dev

  # Start Frontend (Port 3000)
  task fe-dev
```

3. Manual Setup (Alternative)
If you prefer to run services individually:

### Backend

1. cd backend

2. go mod tidy

3. task dev (or go run cmd/server/main.go)

### Frontend

1. cd frontend

2. npm install

3. npm run dev

## Disclaimer
This project is for educational and portfolio purposes only. All NBA-related data, team names, and logos are the property of the National Basketball Association (NBA). No copyright infringement is intended.

## License
This project is licensed under the MIT License. See the LICENSE file for the full text.
