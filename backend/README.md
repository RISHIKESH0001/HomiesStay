# Homies Stay API

Spring Boot backend for the Homies Stay web application.

## Stack

- Java 25
- Spring Boot 4.1.x
- Maven
- MySQL 8.4 LTS
- Spring Data JPA and Flyway for persistence and schema migrations

## Configuration

The application reads configuration from environment variables. For local development, copy `.env.example` to `.env`; Spring loads that ignored local file. Never commit `.env` or use these local credentials in production.

- `DB_URL` defaults to `jdbc:mysql://localhost:3306/homies_stay` with UTC connection settings.
- `DB_USERNAME` defaults to `homies_app`.
- `DB_PASSWORD` is the password for the runtime account.
- `FLYWAY_USERNAME` and `FLYWAY_PASSWORD` are the separate schema-migration account credentials.
- `SERVER_PORT` defaults to `8080`.
- `SESSION_COOKIE_NAME`, `SESSION_COOKIE_SECURE`, and `SESSION_COOKIE_SAME_SITE` control the browser session cookie. Local HTTP development uses `SESSION`, `false`, and `Lax`; production uses `__Host-HOMIES_SESSION`, `true`, and `Lax` when frontend and API are same-site.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_AUTH`, and `SMTP_STARTTLS` configure the mail provider used for verification codes.
- `MAIL_FROM` must be a sender address authorized by that mail provider. `APP_BASE_URL` is included in verification mail and should be the deployed public web URL.
- `ADMIN_CONTACT_EMAIL` is the administrator contact shown to users who cannot sign in and the reply-to address in account-suspension notices.

The local database and two limited accounts are created with `db/bootstrap-local.sql`. The runtime account has data read/write privileges only. The Flyway account can change this database's schema. Hibernate validates the schema; Flyway owns schema changes. Do not change `ddl-auto` to `create` or `update`.

Run the bootstrap SQL once on a fresh local MySQL server. It creates two random passwords and displays them in the MySQL client. Save each password in a password manager, then put them in the matching fields of your local `.env` file. Do not paste passwords into chat or commit the `.env` file.

## Health endpoint

Once the database and application credentials are configured, the application health endpoint is available at `http://localhost:8080/actuator/health`.

## Public property API

- `GET /api/v1/properties?page=0&size=20` returns a paginated list of properties that are both live and approved.
- `GET /api/v1/properties?city=Bengaluru` filters the list by city, case-insensitively.
- `GET /api/v1/properties/{slug}` returns one live, approved property or `404` if it is not publicly available.
- Public and owner property responses include ordered `images` and persisted `amenities`. Owners provide HTTPS photo URLs; direct uploads and managed object storage are not implemented yet.

Page numbers start at zero. Page size must be between 1 and 50. New databases have no listings, so an empty `content` array is expected until owners create, submit, and receive approval for listings.

## Authentication API

- `GET /api/v1/auth/csrf` initializes CSRF protection and returns the header name and token for the next state-changing request.
- `POST /api/v1/auth/register` accepts `name`, `email`, `username`, `phone`, `password`, and `role` (`student` or `owner`). Email and username are unique; admin registration is not public. It creates a pending account and emails a six-digit code that expires after ten minutes. The code is stored as a BCrypt hash, limited to five failed attempts, and can be resent after a 60-second cooldown.
- `POST /api/v1/auth/verify-email` accepts `email` and `otp`; only verified accounts can sign in.
- `POST /api/v1/auth/resend-verification-otp` accepts `email` and responds generically to avoid revealing whether an address has an account.
- `POST /api/v1/auth/forgot-password` accepts `email` and always responds generically; active accounts receive a six-digit code valid for ten minutes, with a 60-second resend cooldown. Flyway `V8` creates the hashed reset-code table.
- `POST /api/v1/auth/reset-password` accepts `email`, `otp`, and `newPassword`; codes are BCrypt-hashed and limited to five failed attempts. Success changes the password and deletes that user's Spring Session JDBC sessions.
- Login is limited to 10 attempts per identifier and client address per 15 minutes; email verification and password reset to 10 attempts per address per 15 minutes; OTP resends and reset-code requests to five per address per hour; and registration to 20 requests per client address per hour. Flyway `V7` stores hashed rate-limit keys in MySQL, shared across API instances. Expired entries are removed daily.
- `POST /api/v1/auth/login` accepts `identifier` (email or username) and `password`, returns the account profile, and establishes a server-side session stored in MySQL through Spring Session JDBC.
- `GET /api/v1/auth/me` returns the signed-in account profile.
- `PATCH /api/v1/auth/profile` updates the signed-in account's display name and phone number and returns the updated profile. Email and username are read-only; changing an email requires a dedicated verification flow.
- `POST /api/v1/auth/profile-picture` accepts a JPEG or PNG `file` upload up to 5 MB and stores its normalized image in MySQL. `GET /api/v1/auth/profile-picture` returns the signed-in account's image; profile responses include a versioned `profileImage` path when one has been uploaded.
- `POST /api/v1/auth/logout` invalidates the current session.

Keep the session cookie enabled in the browser and send the CSRF token in the header returned by `/csrf` for POST requests. Flyway `V6` creates the shared Spring Session JDBC tables, so sessions survive application restarts and work across multiple app instances. Local development uses `SESSION_COOKIE_NAME=SESSION` and `SESSION_COOKIE_SECURE=false`; production must use HTTPS, set `SESSION_COOKIE_SECURE=true`, and set `SESSION_COOKIE_NAME=__Host-HOMIES_SESSION`. The production cookie uses `Path=/`, no `Domain`, `HttpOnly`, and `SameSite=Lax`. For a genuinely cross-site frontend/API deployment, use `SameSite=None` only with HTTPS and explicit credentialed CORS origins, while retaining CSRF protection. Passwords and verification codes are stored as BCrypt hashes. Configure and verify a production SMTP sender before enabling public registration.

## Production launch checklist

- Use managed MySQL 8.4 with TLS in transit, private network access, automated encrypted backups, and a tested restore procedure. Keep the runtime account limited to data operations and the migration account limited to schema deployment; do not run the app as MySQL `root`.
- Store production database, SMTP, admin-contact, and cookie settings in the hosting provider's secret manager. Never reuse local `.env` credentials. Deploy migrations as a controlled release step and test them against a production-like database snapshot before launch.
- Set `SESSION_COOKIE_SECURE=true`, `SESSION_COOKIE_NAME=__Host-HOMIES_SESSION`, and a same-site deployment behind HTTPS. Keep CSRF enabled. The API currently has no permissive CORS policy; if the UI is hosted cross-site, implement and test an exact origin allowlist before deployment.
- Keep the API private behind a trusted reverse proxy; configure it to remove client-supplied `Forwarded`/`X-Forwarded-*` headers and set authoritative values. The auth limiter uses the resolved client address, which is only trustworthy with that proxy boundary.
- Configure a verified production email sender and domain authentication (SPF, DKIM, DMARC). Test registration, OTP expiration/resend, delivery failures, and bounced-mail monitoring.
- Before opening public registration, add end-to-end integration tests against MySQL for Flyway and authentication/session behavior, and arrange dependency/image scanning and operational alerting.
- Inventory workflows still intentionally lacking backend persistence: managed listing photo uploads/object storage, admin reporting, notifications, bookings/occupancy, rent ledger, and payment-provider integration. Do not enable or advertise these flows until their API, schema, authorization, retention, and failure handling are implemented and tested.
- Decide retention and privacy policies for identity/contact data, uploaded profile photos, applications, and logs. Define user deletion/export and incident-response procedures before accepting real customer data.

## Student applications

Flyway migration `V3` adds application records; it does not insert sample data. An authenticated student can:

- `POST /api/v1/student/applications/properties/{propertyId}` with `moveInDate` (`YYYY-MM-DD`), `roomPreference`, and `message` to apply to a live, approved property with available beds.
- `GET /api/v1/student/applications?page=0&size=20` to list their own applications.
- `POST /api/v1/student/applications/{applicationId}/withdraw` to withdraw an application while it is submitted or under review.

An authenticated owner can:

- `GET /api/v1/owner/applications?page=0&size=20` to list applications only for properties they own.
- `PATCH /api/v1/owner/applications/{applicationId}/status` with `{"status":"REVIEWING"}`, `{"status":"ACCEPTED"}`, or `{"status":"DECLINED"}` to update a submitted application. A reviewing application can be accepted or declined. Final statuses cannot be reopened.

Students can submit one application per property. Applications share the student's registered name, email, and phone with that property's owner. Submission is not a booking and does not reserve a bed. State-changing requests require the CSRF token.

## Property enquiries and messaging

Flyway `V10` creates one conversation thread per student and listing, with separately persisted messages. Enquiries are not applications or bookings. Authenticated students can:

- `POST /api/v1/student/enquiries/properties/{propertyId}` with `{"message":"..."}` to start a conversation or send another message to the existing thread for that listing.
- `GET /api/v1/student/enquiries?page=0&size=20` to list their conversations.
- `GET /api/v1/student/enquiries/{enquiryId}/messages` and `POST /api/v1/student/enquiries/{enquiryId}/messages` to read or reply.

An authenticated owner can list their own listing conversations at `GET /api/v1/owner/enquiries?page=0&size=20`, then read and reply through `/api/v1/owner/enquiries/{enquiryId}/messages`. Messages are limited to 2,000 characters; page sizes are limited to 1–50. Conversation access is checked against the signed-in student or the property's owner. Requests that create messages require CSRF protection. The initial enquiry can only be opened for a live, approved property.

## Student saved homes

Flyway `V9` creates a student/property join table with cascading foreign keys and a unique composite key. Authenticated students can:

- `GET /api/v1/student/saved-properties?page=0&size=20` to list their saved properties, newest saved first. Pagination uses the same 1–50 size limit as public listings.
- `POST /api/v1/student/saved-properties/{propertyId}` to save a currently live, approved listing. Repeating the request is safe and does not create duplicates.
- `DELETE /api/v1/student/saved-properties/{propertyId}` to remove a saved listing; removing an already-absent item is safe.

The API never accepts a student ID from the client; it derives the account from the authenticated session. Unpublished or no-longer-approved properties are omitted from the list and cannot be newly saved. State-changing requests require CSRF protection.

## Property moderation

- Owners create and edit their own draft listings through `/api/v1/owner/properties`; requests may include up to 10 HTTPS `images` URLs and 30 unique `amenities`. These are saved transactionally in the existing `property_images`, `amenities`, and `property_amenities` tables. `POST /api/v1/owner/properties/{propertyId}/submit` sends a draft to moderation.
- Admins can inspect the paginated queue at `GET /api/v1/admin/properties/review-queue?page=0&size=20`.
- `PATCH /api/v1/admin/properties/{propertyId}/review` accepts `{"decision":"APPROVE"}` to publish a pending property or `{"decision":"REQUEST_CHANGES","note":"..."}` to return it to the owner as a draft.
- Review decisions are restricted to pending listings. Owners can see the moderation status and note in their property response. Flyway `V5` adds the review note column.

## Admin user directory

- `GET /api/v1/admin/users?page=0&size=20` returns paginated account summaries for the admin dashboard.
- Optional `search` matches display name, username, or email. Optional `role` accepts `STUDENT`, `OWNER`, or `ADMIN`; optional `status` accepts `PENDING`, `ACTIVE`, or `SUSPENDED`.
- The response includes contact/profile fields, account timestamps, and timed suspension expiry, but never password hashes, verification codes, session identifiers, or profile image bytes. The `/api/v1/admin/**` security rule restricts these endpoints to admins.
- `PATCH /api/v1/admin/users/{id}/suspension` requires a future `suspendedUntil` instant and an admin reason. It changes the account to `SUSPENDED`, revokes its existing sessions, writes an audit event, and emails the user with the suspension end time and a reply-to administrator contact. Expired suspensions are automatically lifted on login and refreshed in the admin directory.
- `PATCH /api/v1/admin/users/{id}/suspension/lift` requires a reason, restores an actively suspended account, and records the action.
- `DELETE /api/v1/admin/users/{id}` permanently removes the account after requiring the exact username and a reason. It revokes sessions and deletes the user's profile, verification/reset records, saved homes, applications, enquiries/messages, and owned listings (including other users' applications to those listings). Image URLs may refer to external hosts; deleting their database rows does not remove files from those hosts.
- Admins cannot suspend or delete themselves or other administrator accounts. A minimal audit row (admin ID, deleted target's numeric ID, action, reason, and time) intentionally remains after deletion; define and enforce a retention period before launch. Account controls are not a substitute for a user-facing privacy/export/deletion policy.
- Set `ADMIN_CONTACT_EMAIL` to a monitored address in every environment. It is included in generic failed-login guidance without revealing whether a specific account exists.
