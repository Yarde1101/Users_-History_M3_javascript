# RIWITickets — Management System

## Description

RIWI Tickets Management System is a Single Page Application (SPA) built with Vanilla JavaScript for managing technical support tickets.

The application implements authentication, role-based access control, session persistence, and ticket management through two independent JSON Server APIs.

Users can log in according to their assigned role and interact with the system based on their permissions.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Vite
- Axios
- JSON Server
- Local Storage

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd RIWITickets
```

### 2. Install dependencies

```bash
npm install
```

### 3. Verify environment variables

Create or verify the `.env` file:

```env
VITE_AUTH_API=http://localhost:3001
VITE_TICKETS_API=http://localhost:3002
VITE_TIME_OUT=5000
```

---

## How to Run Both JSON Server Services

The project uses two independent JSON Server instances.

### Authentication Service

```bash
npx json-server --watch auth-db.json --port 3001
```

Runs the authentication API containing:

- Users
- Roles

### Tickets Service

```bash
npx json-server --watch data-db.json --port 3002
```

Runs the ticket management API containing:

- Tickets

### Start the Application

In a separate terminal:

```bash
npm run dev
```

Open the URL provided by Vite, usually:

```text
http://localhost:5173
```

---

## Project Structure

```text
RIWITickets/
│
├── css/
│   └── styles.css
│
├── js/
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── httpClient.js
│   │   └── ticketService.js
│   │
│   ├── views/
│   │   ├── adminView.js
│   │   ├── tecnicoView.js
│   │   ├── clienteView.js
│   │   ├── login.js
│   │   └── register.js
│   │
│   ├── app.js
│   └── router.js
│
├── auth-db.json
├── data-db.json
├── .env
├── index.html
└── package.json
```

---

## Role Behavior Explanation

### Administrator

The Administrator has full access to the system.

Permissions:

- View all tickets
- Create tickets
- Edit tickets
- Delete tickets
- Assign technicians
- Manage ticket status

Account:

```text
Email: milaadmin@ticket.com
Password: admin123
```

---

### Technician

Technicians are responsible for handling assigned tickets.

Permissions:

- View assigned tickets
- Update ticket status
- Manage support tasks

Account:

```text
Email: jesu@ticket.com
Password: ticket123
```

---

### Client

Clients can submit support requests.

Permissions:

- Create tickets
- View their own tickets
- Track ticket status

Clients cannot modify or delete tickets assigned to the support team.

---

## Technical Decisions

### Single Page Application (SPA)

The application uses a SPA architecture to provide a smoother user experience without full page reloads.

### Modular Architecture

The project is organized into:

- Views
- Services
- Middleware
- Routing

This separation improves maintainability and scalability.

### Axios for HTTP Requests

Axios is used to simplify communication with the REST APIs and handle asynchronous requests efficiently.

### JSON Server as Mock Backend

Two independent JSON Server instances simulate backend services:

1. Authentication Service
2. Ticket Management Service

This separation follows a microservice-inspired architecture.

### Environment Variables

API URLs are managed through environment variables, making configuration easier across environments.

### Session Persistence

User session information is stored locally to keep users authenticated after page refreshes.

### Role-Based Access Control

Permissions are controlled through middleware and role validation, ensuring users only access authorized features.

---

## Authors

CAMILA MARRUGO
JESUS CANTILLO
MOISÉS GUTIERREZ
YARDELIS OROZCO