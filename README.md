# TaskFlow

TaskFlow is a full-stack task management application inspired by Jira and Kanban workflows. It allows teams to manage projects, assign tasks, track progress, and collaborate through comments in a modern web interface.

# LIVE PREVIEW
## https://frontend-production-723c.up.railway.app/

## Features

### Task Management

* Create, edit, and delete tasks
* Assign tasks to users
* Set task priority levels:

  * LOW
  * MEDIUM
  * HIGH
  * CRITICAL
* Track task status:

  * TODO
  * IN_PROGRESS
  * DONE

### Kanban Board

* Visual task management board
* Move tasks through workflow stages
* Real-time status updates

### Project Management

* Create projects
* Organize tasks by project
* Filter tasks by project

### User Management

* Create team members
* Assign tasks to users
* Filter tasks by assigned user

### Comments

* Add comments to tasks
* View task discussion history

### Search & Filtering

* Search tasks by title or description
* Filter by:

  * Priority
  * Project
  * Assigned User

### Dashboard

* Total tasks
* TODO tasks
* In Progress tasks
* Completed tasks
* High Priority tasks

---

## Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* MySQL
* Maven

### Frontend

* React
* Vite
* Axios

### Database

* MySQL

### Deployment

* Railway

---

## Architecture

```text
React Frontend
       │
       ▼
REST API
       │
       ▼
Spring Boot
       │
       ▼
Spring Data JPA
       │
       ▼
MySQL
```

---

## Database Schema

### User

```text
id
name
email
role
```

### Project

```text
id
name
description
```

### Task

```text
id
title
description
status
priority
project_id
assigned_user_id
```

### Comment

```text
id
message
created_at
task_id
user_id
```

---

## Screenshots

<img width="1451" height="753" alt="1" src="https://github.com/user-attachments/assets/0a012b20-b6fe-4f51-b894-c35bfcffaf94" />

<img width="1452" height="729" alt="2" src="https://github.com/user-attachments/assets/12fbe7e2-432b-4780-b97c-15b02a2ee5a8" />

<img width="1454" height="741" alt="3" src="https://github.com/user-attachments/assets/df649110-7501-44a4-803a-4c79f5b5c31e" />


---

## Running Locally

### Backend

```bash
cd taskflow-backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend

```bash
cd taskflow-frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## API Examples

### Get Tasks

```http
GET /api/tasks
```

### Create Task

```http
POST /api/tasks
```

```json
{
  "title": "Build Dashboard",
  "description": "Create project statistics page",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": 1,
  "assignedUserId": 1
}
```

### Update Task Status

```http
PATCH /api/tasks/{id}/status?status=IN_PROGRESS
```

### Add Comment

```http
POST /api/tasks/{taskId}/comments
```

---

## Future Improvements

* JWT Authentication
* Role-Based Access Control
* Drag-and-Drop Kanban Board
* Activity Logs
* File Attachments
* Email Notifications
* Docker Deployment
* CI/CD Pipeline

---
