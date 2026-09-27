# Vehicle Spare Parts Management System

A web-based Vehicle Spare Parts Management System built with React (Vite) and Spring Boot (MongoDB).

## Overview
This system allows a vehicle spare parts business to manage inventory, suppliers, customers, and sales orders. It features a clean modular monolithic architecture designed to be understandable for a university Software Engineering project.

## Features
- Spare Parts Management (CRUD)
- Inventory Control (Low stock alerts)
- Supplier & Customer Management
- Sales & Order Management
- Admin & Staff Roles
- Interactive Dashboard (Recharts)
- Dark Mode Support

## Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Axios, React Router v7.
- **Backend**: Java 21, Spring Boot 3.x, Spring Data MongoDB, Spring Security (JWT).
- **Database**: MongoDB

## Architecture
This project follows a clean modular monolithic architecture:
React -> REST API -> Spring Boot -> MongoDB

## Prerequisites
- Node.js (v18+)
- Java 21 (JDK)
- Maven
- MongoDB (Running locally on default port 27017, or configure Atlas)

## Setup Instructions

### MongoDB Setup
Make sure MongoDB is running locally. The database `vehicle_spareparts` will be created automatically.

### Backend Setup
1. Navigate to the `backend` directory.
2. Run `./mvnw spring-boot:run` (or `mvnw.cmd spring-boot:run` on Windows).
3. The server will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the application at `http://localhost:5173`.

## Folder Structure
```
├── backend/            # Spring Boot application
│   └── src/main/java/com/vehiclespareparts/
└── frontend/           # React + Vite application
    └── src/
        ├── components/
        ├── pages/
        ├── api/
        └── layouts/
```
"# Vehicle-Spare-Parts-System" 
