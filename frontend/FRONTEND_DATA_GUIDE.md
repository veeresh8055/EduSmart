# Frontend API, hooks, and stores

This document covers only `src/Api`, `src/hooks`, and `src/Store`.

## API layer — `src/Api`

API files make HTTP requests and return only `response.data`. They do not render UI or manage loading state. That is handled by React Query hooks.

### `client.js`

Creates the shared Axios client. Its base URL is `VITE_BASE_URL`; if that variable is absent it uses `http://localhost:5000/api`. `withCredentials: true` sends the backend's HTTP-only login cookie with every request. Set `VITE_BASE_URL` to the backend URL including `/api`, for example `http://localhost:5000/api`.

### `user.api.js`

| Function | Request data | Endpoint | Returned data |
| --- | --- | --- | --- |
| `registerApi(payload)` | `{ fullName, email, password }` | `POST /register` | Backend welcome message; cookie is set. |
| `loginApi(payload)` | `{ email, password }` | `POST /login` | Login/admin welcome message; cookie is set. |
| `getUser()` | none | `GET /getUser` | Current user object, including `admin` and `purchasedCourse`. |
| `logoutApi()` | none | `POST /logout` | Logout message; backend clears cookie. |

### `course.api.js`

| Function | Request data | Endpoint | Returned data |
| --- | --- | --- | --- |
| `createCourseApi(payload)` | `FormData`: title, description, amount, thumbnail | `POST /course/createCourse` | `{ message, newCourse }`. |
| `getCourseApi(search)` | Optional search text becomes `?search=` | `GET /course/getCourse` | `{ courses, count, ... }`. |
| `getSingleCourseApi(id)` | Course ID | `GET /course/getSingleCourse/:id` | One course with modules. |
| `getPurchaseCourseApi(courseId)` | Purchased course ID | `GET /course/purchasedCourse/:id` | Owned course with modules. |
| `getAllPurchaseCourseApi()` | none | `GET /course/getAllCoursePurchase` | User with populated `purchasedCourse`. |

### `module.api.js`

- `createModuleApi(payload)`: sends video `FormData` (`courseId`, `title`, `video`) to `POST /module/createModule`; returns the module.
- `getModuleApi(id)`: fetches one accessible module from `GET /module/getModule/:id`.
- `getCommentApi(id)`: fetches comments for an accessible module from `GET /module/comment/:id`; returns a comment array.

### `comment.api.js`

`createComment({ id, payload })` sends `payload` (normally `{ comment }`) to `POST /comment/createComment/:id`, where `id` is the module ID. It returns `{ message, populatedComment }`.

### `quiz.api.js`

- `getQuizApi(id)`: `GET /quiz/getQuiz/:id`, returns `{ success, quiz }` with populated questions.
- `createQuiz(payload)`: `POST /quiz/generateQuiz`, with `{ moduleId, content }`, returns a generation message.
- `checkQuizApi(id)`: `GET /quiz/checkQuiz/:moduleId`, returns `{ success, hasQuiz, quiz }` for the current learner.

### `purchase.api.js`

- `purchaseCourseApi(payload)`: `POST /payment/checkout`. The payload shape is `{ products: { _id, name, price, image } }`. Successful data includes the Stripe `url`.
- `checkOutSuccessApi(sessionId)`: `POST /payment/checkout-success` with `{ sessionId }`; returns the order confirmation.

### `Analytic.api.js`

- `getDataApi()`: `GET /analytic/getAnalytic`; returns the aggregate admin metrics.
- `dailyDataApi(startDate, endDate)`: `GET /analytic/getDailyData` with query parameters; returns a daily `{ date, enrollments, revenue }` array.

## React Query hooks — `src/hooks`

Queries fetch/cache server data. Mutations perform a write action. Each hook returns React Query state such as `data`, `isLoading`, `isPending`, `error`, and a `mutate(...)` function where applicable.

### `User.hook.js`

- `useRegisterHook()`: mutation using `registerApi`. On success shows a toast and navigates to `/`.
- `useLoginHook()`: mutation using `loginApi`. On success shows a toast and navigates to `/`; on failure shows the backend message.
- `useGetUserHook()`: cached query using `getUser`, key `['getUser']`, with retries disabled. `ProtectedRoutes` uses this to decide if the visitor is authenticated.
- `useLoggedOut()`: mutation using `logoutApi`; on success shows a toast and navigates to `/login`.

### `course.hook.js`

- `useCreateCouseHook()` (name contains the existing `Couse` spelling): mutation using `createCourseApi`; invalidates `['getCourse']` after creating a course.
- `useGetCourseHook(search)`: query key `['getCourse', search]`; gets the catalog/search results.
- `useGetSingleCourseHook(id)`: query key `['getSingleCourse', id]`; gets public course details.
- `useGetPurchaseCourse(courseId)`: query key `['getPurchaseCourse', courseId]`; gets the enrolled course.
- `useGetAllPurchaseCourse()`: query key `['getAllPurchaseCourse']`; gets the learner's library.

### `module.hook.js`

- `useCreateModule()`: mutation using `createModuleApi`; invalidates `['getSingleCourse']` to refresh module lists.
- `useGetModule(id)`: query key `['getModule', id]`; fetches one module.
- `useGetComment(id)`: query key `['getComment', id]`; fetches comments only when `id` is truthy (`enabled: !!id`).

### `comment.hook.js`

`useCreateComment()` is a mutation using `createComment`. On success it invalidates comment queries so the comments list refetches and shows a success toast.

### `quiz.hook.js`

- `useCreateQuiz()`: mutation using `createQuiz`; shows a toast and invalidates `['checkQuiz']`, causing the selected module's button to update from “Create Quiz” to “Take Quiz”.
- `useGetQuiz(id)`: query key `['getQuiz', id]`; loads quiz questions.
- `useCheckQuiz(id)`: query key `['checkQuiz', id]`; only runs with a module ID and tells the UI whether this learner already has a quiz for that module.

### `payment.hook.js`

- `usePayment()`: mutation using `purchaseCourseApi`. When the server returns `data.url`, it sets `window.location.href` to Stripe Checkout.
- `useCheckoutSuccess()`: mutation using `checkOutSuccessApi`; displays the confirmation message after Stripe redirects back.

### `analytic.hook.js`

- `useGetDataHook()`: query key `['getData']`; fetches admin totals.
- `useGetDailyData(startDate, endDate)`: query key `['dailyDataApi', startDate, endDate]`; fetches the selected date range's chart data.

## Zustand stores — `src/Store`

Stores hold small client-side state. They are not a source of truth for server data: React Query/API responses remain the source of truth.

### `user.store.jsx`

Exports `useUserStore`. Its state is:

- `user`: current user object, initially `null`.
- `setUser(userData)`: sets the current user after `/getUser` succeeds.
- `clearUser()`: resets user to `null`.

The store is configured with Zustand `devtools` under the name `UserStore`, so it can be inspected in development.

### `module.store.jsx`

Exports `useModuleStores`. Its state is:

- `module`: the course module currently selected by the learner, initially `null`.
- `setModule(moduleData)`: sets the selected module when a learner opens a module accordion item.
- `clearModule()`: clears the video/comments/quiz selection.

`SinglePurchasedCourse` reads this store to decide which video to play, which comments to fetch, and which module's quiz status to check. It is named `ModuleStore` in Zustand devtools.
