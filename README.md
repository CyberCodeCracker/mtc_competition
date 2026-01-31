# ENET'COM Forum - Career Platform

A full-stack web platform connecting ENET'COM students with internship and job opportunities.

![ENET'COM Forum](frontend/src/assets/logo.png)

## Features

### For Students
- Browse PFE, internship, and job offers
- Apply to opportunities with cover letters
- Track application status
- Manage profile

### For Companies
- Post job offers and internships
- Review student applications
- Accept or reject candidates
- Company profile management

### For Administrators
- Dashboard with platform statistics
- User management (create students, companies, admins)
- Approve company registrations
- Monitor all applications and offers

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma ORM** with **MySQL** database
- **JWT** authentication with refresh tokens
- **Zod** for request validation
- **bcrypt** for password hashing
- **Helmet** & **CORS** for security

### Frontend
- **Angular 19** with standalone components
- **Tailwind CSS** for styling
- **Angular Material** for UI components
- **SCSS** for custom styles
- **Angular Signals** for reactive state management

## Project Structure

```
mtc/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Database seeder
│   ├── src/
│   │   ├── config/            # Configuration
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── types/             # TypeScript types
│   │   ├── validators/        # Zod schemas
│   │   └── server.ts          # Entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/          # Services, guards, interceptors
    │   │   ├── pages/         # Page components
    │   │   ├── shared/        # Shared components
    │   │   ├── app.routes.ts  # Routes configuration
    │   │   └── app.config.ts  # App providers
    │   ├── assets/            # Static assets
    │   ├── environments/      # Environment configs
    │   └── styles.scss        # Global styles
    ├── angular.json
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://root:password@localhost:3306/enetcom_forum"
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:4200
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

5. Seed the database:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

The application will be available at `http://localhost:4200`

## Demo Credentials

After seeding the database, you can use these credentials:

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@enetcom.tn           | admin123    |
| Company | contact@technosoft.tn      | company123  |
| Student | ahmed.benali@enetcom.tn    | student123  |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/register/student` - Register student (Admin only)
- `POST /api/auth/register/company` - Register company (Admin only)
- `POST /api/auth/register/admin` - Register admin (Admin only)

### Students
- `GET /api/students` - List all students (Admin)
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student (Admin)
- `GET /api/students/me/applications` - Get current student's applications
- `GET /api/students/me/stats` - Get current student's statistics

### Companies
- `GET /api/companies` - List all companies
- `GET /api/companies/:id` - Get company by ID
- `PUT /api/companies/:id` - Update company
- `DELETE /api/companies/:id` - Delete company (Admin)
- `PATCH /api/companies/:id/approval` - Toggle approval (Admin)
- `GET /api/companies/me/offers` - Get company's offers
- `GET /api/companies/me/applications` - Get applications to company's offers
- `GET /api/companies/me/stats` - Get company statistics

### Offers
- `GET /api/offers` - List all offers (with filters)
- `GET /api/offers/:id` - Get offer by ID
- `POST /api/offers` - Create offer (Company)
- `PUT /api/offers/:id` - Update offer (Company/Admin)
- `DELETE /api/offers/:id` - Delete offer (Company/Admin)
- `GET /api/offers/:id/applications` - Get offer applications

### Applications
- `POST /api/applications` - Create application (Student)
- `GET /api/applications/:id` - Get application by ID
- `GET /api/applications` - List applications (with filters)
- `PATCH /api/applications/:id/status` - Update status (Company/Admin)
- `DELETE /api/applications/:id/withdraw` - Withdraw application (Student)

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/offers-by-category` - Get offers by category
- `GET /api/admin/dashboard/recent-activity` - Get recent activity
- `GET /api/admin/dashboard/application-trends` - Get application trends
- `GET /api/admin/dashboard/top-companies` - Get top companies

## UI Design

The platform features:
- **Glassmorphism** design with frosted glass effects
- **Particle animations** in the background
- **Gradient colors** (blue to cyan accent)
- **Responsive layout** for all devices
- **Dark mode** theme
- **Smooth micro-animations**

## License

This project is licensed under the MIT License.
