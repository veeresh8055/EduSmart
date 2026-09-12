# Backend controllers and middleware

The Express server mounts all routes below `/api`. A controller receives Express's `req` (request) and `res` (response). Route parameters are read from `req.params`, JSON/form fields from `req.body`, query-string values from `req.query`, uploaded files from `req.file`, and the authenticated user from `req.user`.

## Authentication middleware

### `protectRoute(req, res, next)` — `src/middleware/auth.middleware.js`

This is the authentication gate. It reads the `token` cookie, verifies it with `JWT_SECRET`, finds the matching user without their password, and saves that user as `req.user`. It then calls `next()` so the controller can run.

- No cookie, invalid/expired token, or deleted user: returns `401` with an authentication message.
- Unexpected server failure: returns `500`.
- Every controller that needs the current user (purchases, comments, quizzes, etc.) depends on this middleware running first.

### `adminRoute(req, res, next)` — `src/middleware/auth.middleware.js`

This is the authorization gate for staff actions. It expects `protectRoute` to have already set `req.user`, compares `req.user.email` with the configured `ADMIN` email, and calls `next()` only for that account.

- Non-admin users receive `403` with `Admin access required`.
- It protects course/module creation and analytics routes.

### `upload` — `src/middleware/upload.js`

This is Multer configured with in-memory storage. `upload.single('thumbnail')` parses one multipart file named `thumbnail` and makes it available as `req.file` with a `buffer`. `createCourse` converts that buffer to base64 before uploading it to Cloudinary.

### `videoUpload` — `src/middleware/videoUpload.js`

This Multer/Cloudinary storage middleware uploads one multipart file named `video` directly to Cloudinary. It accepts `mp4`, `mov`, and `avi`, uses the `courseModule` folder, and limits files to `1024 * 1024 * 500` bytes (500 MB). After upload, `req.file.path` is the video URL and `req.file.filename` is Cloudinary's public ID.

## User controller — `src/controllers/user.controller.js`

### `Register`

Handles `POST /api/register`. It reads `{ fullName, email, password }` from `req.body`, validates that all are present, checks whether the email exists, hashes the password with bcrypt, and creates a `User`. It signs a JWT containing the new user's ID, stores it in an HTTP-only `token` cookie, and returns `201` with a welcome message. Missing fields or an existing email return `401`.

### `Login`

Handles `POST /api/login`. It reads `{ email, password }`, looks up the user, compares the password with the bcrypt hash, assigns `admin: true` when the email equals `ENV.ADMIN`, and sends a JWT cookie. Success returns `201` with a normal or admin welcome message. Invalid credentials return `401`.

### `getUser`

Handles `GET /api/getUser` after `protectRoute`. It gets the authenticated ID from `req.user._id`, loads that user, and returns the complete user object as JSON (`201`). The frontend uses it to determine the logged-in name, purchases, and admin role.

### `logout`

Handles `POST /api/logout`. It clears the `token` cookie and returns `201` with `User logged out`.

### `updateProfile`

Handles `POST /api/updateProfile` after `protectRoute` and `upload.single('profilePhoto')`. It optionally reads `fullName` and an uploaded profile image. An image buffer is uploaded to Cloudinary; then MongoDB is updated. It returns `200` with `{ success, message, user }`, excluding the password. A missing user returns `404`.

## Course controller — `src/controllers/course.controller.js`

### `createCourse`

Handles `POST /api/course/createCourse` after authentication, admin authorization, and thumbnail upload. It reads `{ title, description, amount }` plus `req.file`, uploads the thumbnail buffer to Cloudinary, and creates a `Course` with the creator ID in `userId`. On success it returns `201` with `{ message, newCourse }`. Missing fields return `401`; Cloudinary/database errors return `500`.

### `getCourse`

Handles `GET /api/course/getCourse` after authentication. With no `search` query it returns all courses: `{ success: true, courses, count }`. With `?search=...`, it asks Gemini for a matching course category, searches titles and descriptions using both the original term and inferred category, and returns the courses plus `searchTerm` and `aiCategory`. Search failures return `500`.

### `getSingleCourse`

Handles `GET /api/course/getSingleCourse/:id`. It reads `id` from `req.params`, loads that course, and populates `modules`. It returns the course document (`201`) or `401` if it does not exist. This is the course detail page before purchase.

### `getPurchasedCourse`

Handles `GET /api/course/purchasedCourse/:id`. It checks the requested course ID against `req.user.purchasedCourse`; admins also have access. A learner without access receives `403`. On success it populates modules and returns the course (`201`).

### `getAllPurchasedCourse`

Handles `GET /api/course/getAllCoursePurchase`. It loads the authenticated user and populates their `purchasedCourse` references. It returns the populated user object (`201`) so the frontend can render “Your Courses”.

## Module controller — `src/controllers/module.controller.js`

### `createModule`

Handles `POST /api/module/createModule` after admin auth and `videoUpload.single('video')`. It reads `{ courseId, title }` and the Cloudinary file. It creates a `Modules` record with the video URL/public ID, adds its ID to `Course.modules`, and returns the new module (`201`). Required data/file failures return `401`.

### `getSingleCourseModule`

Handles `GET /api/module/getModule/:id`. It loads the module by ID, checks the parent `courseId` is in the user's purchases (unless admin), and returns the module (`201`). Missing modules return `401`; denied access returns `403`.

### `getComment`

Handles `GET /api/module/comment/:id`. It loads one module and populates `comments`, including each comment's `userId` with `fullName` and `email`, newest first. It checks course access before returning the comments array (`201`). Missing modules return `404`; unauthorized users return `403`.

## Comment controller — `src/controllers/comment.controller.js`

### `createComment`

Handles `POST /api/comment/createComment/:id` after `protectRoute`. The route `id` is a module ID and `{ comment }` comes from the body. It validates the module/comment, confirms the learner owns the module's course, creates a `Comment` linked to the user and module, pushes its ID into `Modules.comments`, then returns `201` with `{ message: 'comment added', populatedComment }`. The returned comment includes the commenter's name and email.

## Quiz controller — `src/controllers/quiz.controller.js`

### `canAccessModule(user, moduleId)`

Internal helper, not an HTTP endpoint. It loads a module's `courseId` and returns `true` when the user is an admin or has bought that course. Quiz endpoints use it before exposing or generating quiz data.

### `checkQuiz`

Handles `GET /api/quiz/checkQuiz/:id`, where `id` is a module ID. After access validation, it finds a quiz for the current user and module. It returns `200` as `{ success: true, hasQuiz: Boolean, quiz: quiz | null }`.

### `generateQuiz`

Handles `POST /api/quiz/generateQuiz` with `{ moduleId, content }`. It rejects missing data or unauthorised course access, avoids creating a second populated quiz for the same user/module, creates a quiz, prompts Gemini for ten JSON multiple-choice questions, saves each `Questions` document, attaches their IDs to the quiz, and stores the quiz reference on the module. Success is `201` with `{ message: 'Quiz generated' }`.

### `getQuiz`

Handles `GET /api/quiz/getQuiz/:id`, where `id` is a quiz ID. It only finds a quiz whose `userId` is the signed-in user, populates questions, verifies course access, and returns `200` with `{ success: true, quiz }`. It returns `401` if no matching quiz exists and `403` when course access is denied.

## Payment controller — `src/controllers/payment.controller.js`

### `createCheckOutSession`

Handles `POST /api/payment/checkout` with `{ products }`. It expects `products` to contain `_id`, `name`, `image`, and `price`. It verifies the course and checks that no `Order` already exists for this user/course. It creates a Stripe Checkout Session with INR line items and metadata (`userId`, `courseId`, `coursePrice`). It returns `201` with `{ success: true, sessionId, url }`; the frontend redirects the browser to `url`.

### `checkoutSuccess`

Handles `POST /api/payment/checkout-success` with `{ sessionId }`. It prevents duplicate orders using `stripeSessionId`, retrieves the Stripe session, and only continues when payment status is `paid`. It creates an `Order`, pushes the course ID into `User.purchasedCourse`, and returns `201` with `{ message: 'payment succesfully', orderId }`. It returns `401` for missing IDs or failed payments.

## Analytics controller — `src/controllers/analytic.controller.js`

### `getAnalyitcsData`

Internal helper. It counts `User` and `Course` documents, then aggregates all orders to calculate the number of enrollments and total revenue. It returns `{ users, courses, totalEntrollments, totalRevenue }`.

### `getAnalyticsDataController`

Handles admin-only `GET /api/analytic/getAnalytic`. It calls `getAnalyitcsData` and returns its summary JSON with `201`.

### `dailyEnrollmentData(startDate, endDate)` and `getDatesInRange`

Internal helpers. They aggregate orders per UTC day between the supplied dates and fill in days with no order using zero enrollment/revenue values. The output is an array of `{ date: 'YYYY-MM-DD', enrollments, revenue }`.

### `getDailyAnalytcController`

Handles admin-only `GET /api/analytic/getDailyData?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`. It validates the dates, calls `dailyEnrollmentData`, and returns the daily array (`201`). Missing dates return `401`; invalid ranges return `400`.
