
# Fullstack Fintech Application

This project is a fullstack application for managing client data, built with **NestJS**, **PostgreSQL**, and **React**. Below are the instructions to set up the development environment.

---

## Features

- **Backend:** NestJS with TypeORM for PostgreSQL
- **Frontend:** React with Vite (to be implemented)
- **Database:** PostgreSQL with pgAdmin for GUI management
- **Docker:** For easy environment setup

---

## Getting Started

### Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v20 or later)
- **Docker** and **Docker Compose**
- **npm** or **yarn**

### Environment Setup

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file based on the example file provided:
   ```bash
   cp .env.example .env
   ```
   Fill in the following variables in the `.env` file:
   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=secret
   DB_NAME=dev_db
   ```

4. **Run the Development Environment:**
   Start the database services (PostgreSQL and pgAdmin) using Docker:
   ```bash
   npm run docker:dev
   ```

5. **Start the Backend Server:**
   Run the backend in development mode:
   ```bash
   npm run start:dev
   ```

6. **Access the Database via pgAdmin:**
   - Open your browser and go to `http://localhost:5050`.
   - Use the credentials defined in the Docker Compose file:
     - **Email:** `admin@local.com`
     - **Password:** `admin`

---

## Testing the Setup

1. **Database Connection:**
   - Verify that the database is accessible via CLI:
     ```bash
     docker exec -it postgres_db psql -U postgres -d dev_db
     ```
   - You should be able to run queries like:
     ```sql
     SELECT NOW();
     ```

2. **Backend API:**
   - Confirm that the backend server is running on `http://localhost:3000`.

---

## Scripts

### Development
- **Start database services:** `npm run docker:dev`
- **Stop database services:** `npm run docker:dev:down`
- **Start backend:** `npm run start:dev`

### Production (WIP)
To be added once the production environment is finalized.

---

## Troubleshooting

### Database Connection Issues
- Ensure Docker is running.
- Verify that the `.env` file contains the correct credentials.

### Backend Issues
- Check the logs for errors:
  ```bash
  npm run start:dev
  ```

### Common Docker Commands
- List running containers:
  ```bash
  docker ps
  ```
- View logs for a specific service (e.g., Postgres):
  ```bash
  docker logs postgres_db
  ```
- Stop and remove all containers:
  ```bash
  docker compose down
  ```
