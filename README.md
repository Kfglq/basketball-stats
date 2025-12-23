# Basketball Stats System

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

## Getting Started

### Prerequisites

* Go: 1.20+

* Node.js: 18+ (pnpm/npm)

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
