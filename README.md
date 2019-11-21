# EdTech SaaS Platform — Early Version (Backend Architecture)

Database schema and API collection for a multi-tenant EdTech SaaS platform built in 2019-2021. This was an early-stage product supporting online tutoring, student management, live classes, and content delivery.

## Built: 2019–2021

## Tech Stack

- **Backend:** Node.js REST API
- **Database:** MySQL (multi-tenant architecture)
- **Live Classes:** BlueJeans integration
- **SMS/OTP:** Twilio
- **CDN:** AWS CloudFront (signed URLs for content delivery)
- **Push Notifications:** Firebase Cloud Messaging
- **Panels:** Super Admin, Tutor, Student, Website

## Database Architecture

The schema includes 100+ tables covering:

### Multi-Tenant Core
- Account/tenant management with subscription tiers
- Role-based access (Super Admin, Account Admin, Tutor, Student)
- Multi-timezone support

### Learning Management
- Courses, Subjects, Topics, Content hierarchy
- Live class scheduling and recording (BlueJeans)
- PPT/PDF content delivery via signed CDN URLs
- Test series and assessments
- Student progress tracking

### Commerce
- Subscription plans and payment processing
- Coupon/discount system
- Payment gateway integration

### Communication
- SMS/OTP via Twilio
- Push notifications (FCM)
- In-app messaging

## API Collections

Postman collections documenting the REST API:
- **Super Admin** — Platform management, account CRUD, analytics
- **Tutor** — Content upload, class scheduling, student management
- **Student** — Course access, live class join, progress tracking
- **Website** — Public pages, registration, authentication

## Structure

```
├── Database/
│   ├── database.sql          — Production schema (100+ tables)
│   ├── TOA_Dev_DB.sql        — Development environment schema
│   └── TOA_Master_DB.sql     — Master/template schema
├── Postman Collections/
│   ├── TOA Super Admin.postman_collection.json
│   ├── TOA.postman_collection.json
│   ├── Student.postman_collection.json
│   ├── WebSite.postman_collection.json
│   └── Twillio.postman_collection.json
└── README.md
```

## Setup

1. Import any SQL file into MySQL 5.7+
2. Import Postman collections into Postman
3. Configure environment variables (base URL, auth tokens)

## Note

This was the early-stage backend for a multi-tenant EdTech platform that later evolved into a full product. The schema demonstrates multi-tenant SaaS architecture, content delivery pipeline, and live classroom integration at scale.
