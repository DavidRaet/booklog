# Comprehensive Test Implementation Plan
## Priority 4.3: Improve Test Coverage

**Created:** December 24, 2025  
**Target:** >80% Backend Coverage | >60% Frontend Coverage  
**Status:** Ready for Implementation

---

## Table of Contents
- [Backend Tests](#backend-tests)
  - [Unit Tests](#backend-unit-tests)
  - [Integration Tests](#backend-integration-tests)
  - [Edge Cases & Error Handling](#backend-edge-cases)
- [Frontend Tests](#frontend-tests)
  - [Component Tests](#frontend-component-tests)
  - [Context/Hook Tests](#frontend-context-tests)
  - [Service Tests](#frontend-service-tests)
  - [Page Tests](#frontend-page-tests)

---

## Backend Tests

### Backend Unit Tests

#### 1. **server/tests/unit/authService.test.js**

**What to Test:**
- `signup()` method success case
- `signup()` method when email already exists
- `login()` method with valid credentials
- `login()` method with invalid email
- `login()` method with invalid password
- Token generation on successful operations

**Why This Matters:**
- AuthService contains critical business logic for user authentication
- Ensures proper error handling and status codes
- Validates that tokens are generated correctly
- Tests service layer independently from HTTP routes

**Specific Instructions:**
- Mock `userQueries` functions using `vi.mock()`
- Mock `jwtUtils.generateToken()` to return a predictable token
- Test that proper error objects are thrown with correct `statusCode` properties
- Verify that returned objects contain `token` and `user` properties
- Test case: signup with existing email should throw error with statusCode 409
- Test case: login with non-existent email should throw error with statusCode 401
- Test case: login with wrong password should throw error with statusCode 401

**Example Test Structure:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../../services/authService.js';
import * as userQueries from '../../db/userQueries.js';
import * as jwtUtils from '../../utils/jwt.js';

vi.mock('../../db/userQueries.js');
vi.mock('../../utils/jwt.js');

describe('AuthService', () => {
  let authService;
  
  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });
  
  // Tests here...
});
```

---

#### 2. **server/tests/unit/bookService.test.js**

**What to Test:**
- `getBooksByUser()` returns array of books
- `getBookById()` with valid ownership
- `getBookById()` with non-existent book (404 error)
- `getBookById()` with unauthorized access (403 error)
- `createBook()` success case
- `updateBook()` with valid ownership
- `updateBook()` with unauthorized access
- `deleteBook()` with valid ownership
- `deleteBook()` with unauthorized access
- `verifyBookOwnership()` method edge cases

**Why This Matters:**
- BookService handles critical business logic and authorization
- Ensures proper ownership verification before CRUD operations
- Tests that correct HTTP status codes are thrown
- Validates service layer independently from routes

**Specific Instructions:**
- Mock `bookQueries` functions using `vi.mock()`
- Test ownership verification logic thoroughly (this is a security concern)
- Verify that 404 errors are thrown when book doesn't exist
- Verify that 403 errors are thrown when user doesn't own the book
- Test that `getBookById()` is called internally by update/delete methods
- Mock book objects with realistic data structure

**Edge Cases to Test:**
```javascript
// Book exists but belongs to different user
// Book ID is invalid (non-numeric, negative, etc.)
// User ID is undefined or null
// Empty book data
```

---

#### 3. **server/tests/unit/logger.test.js**

**What to Test:**
- Logger exports a valid Winston logger instance
- Logger has correct log level based on environment
- Logger can log info, warn, error messages
- Logger format is appropriate for environment (JSON for prod, simple for dev)
- Test mode logger is silent

**Why This Matters:**
- Ensures logging abstraction works correctly
- Validates environment-specific configuration
- Tests that logs are properly structured

**Specific Instructions:**
- Set `process.env.NODE_ENV` to different values (test, development, production)
- Verify logger methods exist (info, warn, error, debug)
- Check that logger level matches environment expectations
- Mock console output to verify log messages are emitted

---

#### 4. **server/tests/unit/middleware/auth.test.js**

**What to Test:**
- `authenticateToken()` with valid token
- `authenticateToken()` with missing token
- `authenticateToken()` with invalid token format
- `authenticateToken()` with expired token
- `authenticateToken()` with malformed Authorization header
- Verify `req.userId` is set correctly

**Why This Matters:**
- Auth middleware is the gatekeeper for protected routes
- Ensures unauthorized users cannot access protected resources
- Tests critical security layer

**Specific Instructions:**
- Mock `verifyToken()` from jwt utils
- Create mock request/response/next objects
- Test that correct status codes are returned (401 for missing, 403 for invalid)
- Verify `next()` is called only when token is valid
- Test header parsing edge cases (no 'Bearer' prefix, multiple spaces, etc.)

**Example Test:**
```javascript
it('should return 401 when no token is provided', () => {
  const req = { headers: {} };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  };
  const next = vi.fn();
  
  authenticateToken(req, res, next);
  
  expect(res.status).toHaveBeenCalledWith(401);
  expect(next).not.toHaveBeenCalled();
});
```

---

#### 5. **server/tests/unit/middleware/errorHandler.test.js**

**What to Test:**
- Error handler with custom error (has statusCode)
- Error handler with generic error (no statusCode)
- Error handler logs errors correctly
- Error handler returns correct JSON structure
- Different error status codes (400, 401, 403, 404, 500)

**Why This Matters:**
- Central error handling is critical for consistent API responses
- Ensures errors are logged properly for debugging
- Validates error response structure

**Specific Instructions:**
- Mock the logger
- Create mock error objects with different properties
- Verify `res.status()` and `res.json()` are called with correct values
- Test that logger.error() is called with error details
- Verify default status code is 500 for errors without statusCode

---

#### 6. **server/tests/unit/db/bookQueries.test.js**

**What to Test:**
- `getAllBooks()` returns array
- `getBookById()` with valid ID
- `getBookById()` with non-existent ID
- `getBooksByUserId()` filters by user correctly
- `createBook()` creates with all fields
- `updateBook()` updates specified fields
- `deleteBook()` removes book
- `deleteBook()` with non-existent ID

**Why This Matters:**
- Data access layer is the foundation of the application
- Ensures database operations work correctly
- Tests ORM (Sequelize) integration

**Specific Instructions:**
- Mock Sequelize models using `vi.mock()`
- Test both success and failure cases
- Verify correct Sequelize methods are called (findAll, findByPk, create, update, destroy)
- Test that correct parameters are passed to Sequelize
- Mock return values to match expected structure

---

#### 7. **server/tests/unit/db/userQueries.test.js**

**What to Test:**
- `createUser()` hashes password correctly
- `createUser()` creates user with all fields
- `getUserByEmail()` finds existing user
- `getUserByEmail()` returns null for non-existent user
- `getUserById()` finds user by ID
- `confirmPassword()` with correct password
- `confirmPassword()` with incorrect password
- `confirmPassword()` with null/undefined values

**Why This Matters:**
- User queries handle sensitive operations (password hashing, authentication)
- Ensures passwords are never stored in plain text
- Tests critical security functions

**Specific Instructions:**
- Mock bcrypt methods
- Mock Sequelize User model
- Verify bcrypt.hash() is called with correct salt rounds
- Verify bcrypt.compare() is called for password verification
- Test edge cases (empty passwords, null values, very long passwords)

---

### Backend Integration Tests

#### 8. **server/tests/integration/auth.test.js** (Enhancement)

**Current Coverage:**
- ✅ POST /api/auth/signup - success case
- ✅ POST /api/auth/signup - invalid input
- ✅ POST /api/auth/login - valid credentials
- ✅ POST /api/auth/login - invalid credentials

**Additional Tests Needed:**
- POST /api/auth/signup - duplicate email (409 error)
- POST /api/auth/signup - missing required fields
- POST /api/auth/signup - invalid email format
- POST /api/auth/signup - password too short/weak
- POST /api/auth/login - non-existent user
- POST /api/auth/login - missing email
- POST /api/auth/login - missing password
- POST /api/auth/login - SQL injection attempts
- POST /api/auth/login - XSS attempts in username
- Verify tokens are valid JWT format
- Verify user objects don't include password_hash

**Why This Matters:**
- Auth routes are the entry point to the application
- Critical for security testing
- Ensures validation schemas work correctly
- Tests end-to-end authentication flow

**Specific Instructions:**
- Add test for duplicate email registration
- Test all Zod validation edge cases
- Verify response structure matches expected format
- Test that password_hash is never returned in responses
- Add cleanup in afterEach to remove test users

---

#### 9. **server/tests/integration/books.test.js** (Enhancement)

**Current Coverage:**
- ✅ GET /api/books - authenticated user
- ✅ GET /api/books - no token (401)
- ✅ POST /api/books - create book

**Additional Tests Needed:**
- GET /api/books - invalid token (403)
- GET /api/books - expired token
- GET /api/books/:id - get single book
- GET /api/books/:id - book not found (404)
- GET /api/books/:id - unauthorized access (403)
- POST /api/books - missing required fields
- POST /api/books - invalid rating (outside 0-5 range)
- POST /api/books - invalid data types
- POST /api/books - XSS attempts in title/review
- PUT /api/books/:id - update own book
- PUT /api/books/:id - update someone else's book (403)
- PUT /api/books/:id - non-existent book (404)
- PUT /api/books/:id - invalid update data
- DELETE /api/books/:id - delete own book
- DELETE /api/books/:id - delete someone else's book (403)
- DELETE /api/books/:id - non-existent book (404)
- DELETE /api/books/:id - no auth token (401)

**Why This Matters:**
- Books are the core feature of the application
- Tests authorization (users can only access their own books)
- Validates CRUD operations end-to-end
- Ensures security boundaries are enforced

**Specific Instructions:**
- Create two test users to test authorization
- Test that user A cannot access/modify user B's books
- Verify all Zod validation rules
- Test cascading deletes (if implemented)
- Add comprehensive cleanup in afterAll

---

#### 10. **server/tests/integration/health.test.js** (New)

**What to Test:**
- GET /health - returns 200 when healthy
- GET /health - returns correct response structure
- GET /health - database check passes
- GET /health - returns 503 when database is down
- GET /health - includes uptime and timestamp
- GET /health - includes database latency

**Why This Matters:**
- Health endpoint is critical for production monitoring
- Load balancers depend on this endpoint
- Ensures database connectivity checks work

**Specific Instructions:**
- Mock database connection for failure case
- Verify response structure matches documented format
- Test that endpoint doesn't require authentication
- Verify latency is a reasonable number (< 1000ms typically)
- Test both healthy and unhealthy scenarios

**Example Test:**
```javascript
it('should return 503 when database is unreachable', async () => {
  // Mock database failure
  vi.spyOn(sequelize, 'authenticate').mockRejectedValue(new Error('Connection refused'));
  
  const res = await request(app).get('/health');
  
  expect(res.status).toBe(503);
  expect(res.body.status).toBe('unhealthy');
  expect(res.body.checks.database.status).toBe('unhealthy');
});
```

---

### Backend Edge Cases

#### 11. **server/tests/edge-cases/validation.test.js** (New)

**What to Test:**
- Very long strings (title, author, review > 1000 chars)
- Special characters in all fields
- Unicode characters (emoji, Chinese, Arabic, etc.)
- SQL injection attempts in all string fields
- XSS payload attempts
- Null bytes in strings
- Rating edge values (0, 5, 0.1, 4.9, negative, > 5)
- Email with multiple @ symbols
- Email without domain
- Very long passwords (> 1000 chars)

**Why This Matters:**
- Real-world data is messy and unpredictable
- Security testing for injection attacks
- Ensures validation is robust
- Prevents database errors from malformed data

**Specific Instructions:**
- Test against all Zod schemas (BookSchema, LoginSchema, SignUpSchema)
- Use known attack vectors from OWASP
- Test boundary values for all numeric fields
- Test character encoding issues
- Document expected behavior for each edge case

---

#### 12. **server/tests/edge-cases/concurrency.test.js** (New)

**What to Test:**
- Two users creating books simultaneously
- User updating book while another user tries to delete it
- Multiple login attempts at same time
- Race condition in token verification
- Simultaneous requests to same endpoint

**Why This Matters:**
- Production systems handle concurrent requests
- Tests for race conditions and database locking
- Ensures data integrity under load

**Specific Instructions:**
- Use Promise.all() to send concurrent requests
- Test with different users to avoid conflicts
- Verify database consistency after concurrent operations
- Check for deadlocks or timeout errors
- May require testing with actual database (not mocked)

---

## Frontend Tests

### Frontend Component Tests

#### 13. **frontend/src/components/BookCard.test.jsx** (New)

**What to Test:**
- Renders book information correctly (title, author, genre, rating, review)
- Handles missing/undefined book data gracefully
- Edit button calls onEdit with book object
- Delete button calls onDelete with book ID
- Card click navigates to book details page
- Edit/delete buttons stop event propagation
- Star rating displays correctly
- Genre badge displays correctly
- Review is truncated if too long
- Edit/delete buttons show on hover

**Why This Matters:**
- BookCard is displayed repeatedly in the grid
- Tests user interaction handlers
- Ensures graceful handling of incomplete data
- Validates navigation behavior

**Specific Instructions:**
- Mock `useNavigate` from react-router-dom
- Mock Lucide icons (Edit2, Trash2, Star, BookOpen)
- Test with various book states (complete data, missing fields, null values)
- Use `fireEvent` for click events
- Use `userEvent` for realistic user interactions
- Verify `e.stopPropagation()` works for edit/delete buttons

**Example Test:**
```javascript
it('should call onEdit when edit button is clicked', () => {
  const mockOnEdit = vi.fn();
  const book = { id: 1, title: 'Test', author: 'Author' };
  
  render(<BookCard book={book} onEdit={mockOnEdit} onDelete={vi.fn()} />);
  
  const editButton = screen.getByTitle('Edit');
  fireEvent.click(editButton);
  
  expect(mockOnEdit).toHaveBeenCalledWith(book);
});
```

---

#### 14. **frontend/src/components/BookGrid.test.jsx** (New)

**What to Test:**
- Renders list of books correctly
- Empty state displays when no books
- Maps over books array and renders BookCard for each
- Passes onEdit and onDelete props to each card
- Empty state shows correct message and icon
- Grid layout classes are applied
- Animation delays are applied correctly

**Why This Matters:**
- BookGrid is the main view for displaying book collection
- Tests list rendering and empty states
- Ensures props are passed correctly to child components

**Specific Instructions:**
- Mock BookCard component
- Test with empty array, single book, multiple books
- Verify empty state message content
- Check that all books in array are rendered
- Verify onEdit and onDelete are passed through

---

#### 15. **frontend/src/components/BookDetails.test.jsx** (New)

**What to Test:**
- Renders all book details (title, author, genre, rating, review)
- Edit button calls onEdit handler
- Delete button calls onDelete handler
- Close button calls onClose handler
- Full review text is displayed (not truncated)
- Rating stars display correctly
- Handles missing optional fields gracefully

**Why This Matters:**
- Book details page shows complete book information
- Tests all interaction handlers
- Ensures layout and styling work correctly

**Specific Instructions:**
- Mock Lucide icons
- Test with complete and incomplete book data
- Verify all buttons have correct handlers
- Test that full review is visible (unlike card which truncates)

---

#### 16. **frontend/src/components/BookDetailsPage.test.jsx** (New)

**What to Test:**
- Fetches book data on mount
- Displays loading state initially
- Shows book details after successful fetch
- Navigates to home on fetch error
- Edit button opens modal and navigates home
- Delete button shows confirmation dialog
- Delete only proceeds if user confirms
- Navigate to home after successful delete
- Handles non-existent book ID

**Why This Matters:**
- Tests full page component with data fetching
- Ensures proper error handling and user feedback
- Tests navigation flow

**Specific Instructions:**
- Mock `useParams` to return test book ID
- Mock `useNavigate` from react-router-dom
- Mock `bookService.getBookById()`
- Mock `window.confirm()` for delete confirmation
- Test loading, success, and error states
- Use `waitFor` for async operations

---

#### 17. **frontend/src/components/Button.test.jsx** (New)

**What to Test:**
- Renders children correctly
- onClick handler is called when clicked
- Disabled button doesn't trigger onClick
- Disabled prop adds correct class/attribute
- Different variants render with correct classes
- Type attribute is applied correctly
- Custom className is merged with default classes

**Why This Matters:**
- Button is reused throughout the application
- Tests accessibility (disabled state)
- Ensures variant styling works

**Specific Instructions:**
- Test with different props combinations
- Verify disabled buttons can't be clicked
- Check that className merging works
- Test all button variants

---

#### 18. **frontend/src/components/Input.test.jsx** (New)

**What to Test:**
- Renders label correctly
- Input value updates on change
- onChange handler receives correct value
- Placeholder text displays
- Type attribute works (text, email, password, number)
- Required attribute is applied
- Disabled state prevents input
- Error state shows error message (if implemented)
- Accessible label-input association

**Why This Matters:**
- Input is reused in all forms
- Tests form accessibility
- Ensures controlled component behavior

**Specific Instructions:**
- Test with different input types
- Use userEvent for typing simulation
- Verify label is associated with input (for attribute)
- Test required and disabled states

---

#### 19. **frontend/src/components/Header.test.jsx** (New)

**What to Test:**
- Renders user information when authenticated
- Shows login/signup links when not authenticated
- Logout button calls logout handler
- Add Book button calls correct handler
- Username displays correctly
- Navigation works correctly

**Why This Matters:**
- Header is visible on every page
- Tests authentication state display
- Ensures navigation and actions work

**Specific Instructions:**
- Mock AuthContext with different states (logged in, logged out)
- Mock navigation handlers
- Test conditional rendering based on auth state

---

#### 20. **frontend/src/components/LoadingState.test.jsx** (New)

**What to Test:**
- Renders loading spinner/animation
- Displays loading message
- Has correct styling/classes
- Accessible to screen readers

**Why This Matters:**
- Provides user feedback during async operations
- Tests loading UX
- Ensures accessibility

**Specific Instructions:**
- Verify component renders without errors
- Check for loading indicator element
- Test with different message props (if supported)

---

#### 21. **frontend/src/components/ErrorState.test.jsx** (New)

**What to Test:**
- Displays error message correctly
- Shows error icon
- Retry button calls retry handler (if exists)
- Has appropriate styling for errors
- Handles different error types

**Why This Matters:**
- Error states are critical for UX
- Ensures users know when something went wrong
- Tests error recovery flow

**Specific Instructions:**
- Test with different error messages
- Verify retry functionality if implemented
- Check that error is prominently displayed

---

#### 22. **frontend/src/components/ProtectedRoute.test.jsx** (New)

**What to Test:**
- Renders children when authenticated
- Redirects to login when not authenticated
- Shows loading state while checking auth
- Passes through all props correctly

**Why This Matters:**
- ProtectedRoute is critical for security
- Prevents unauthorized access to protected pages
- Tests authentication flow

**Specific Instructions:**
- Mock AuthContext with different states
- Mock Navigate component from react-router-dom
- Test all three states: loading, authenticated, unauthenticated
- Verify redirect path is correct

---

#### 23. **frontend/src/components/SearchFilter/SearchBar.test.jsx** (New)

**What to Test:**
- Renders search input
- Search value updates on input change
- Calls search handler with correct value
- Debounces search input (if implemented)
- Clear button clears search
- Placeholder text displays

**Why This Matters:**
- Search is key feature for book discovery
- Tests real-time filtering
- Ensures responsive UX

**Specific Instructions:**
- Use userEvent for typing
- Test debouncing behavior with vi.useFakeTimers()
- Verify onChange handler is called

---

#### 24. **frontend/src/components/SearchFilter/GenreFilter.test.jsx** (New)

**What to Test:**
- Renders genre options
- Selected genre is highlighted
- Clicking genre calls onChange handler
- All option shows all books
- Multiple genres can be displayed
- Accessible dropdown/buttons

**Why This Matters:**
- Genre filtering is core functionality
- Tests selection UI
- Ensures filter state management

**Specific Instructions:**
- Mock genre list
- Test selection changes
- Verify correct genre value is passed to handler

---

#### 25. **frontend/src/components/SearchFilter/RatingFilter.test.jsx** (New)

**What to Test:**
- Renders rating options (0-5 stars)
- Selected rating is highlighted
- Clicking rating calls onChange handler
- Visual star representation is correct
- Can clear rating filter

**Why This Matters:**
- Rating filter helps users find top books
- Tests numeric filtering UI
- Ensures star visualization works

**Specific Instructions:**
- Test all rating values (0, 1, 2, 3, 4, 5)
- Verify star icons render correctly
- Test rating selection changes

---

#### 26. **frontend/src/components/SearchFilter/SearchFilterBar.test.jsx** (New)

**What to Test:**
- Integrates SearchBar, GenreFilter, RatingFilter
- All filters work together
- Filters can be cleared
- Props are passed to child components correctly
- Layout renders properly

**Why This Matters:**
- Composite component that orchestrates filtering
- Tests component integration
- Ensures filters work in combination

**Specific Instructions:**
- Mock child filter components
- Verify props are passed through
- Test combined filtering logic if in this component

---

### Frontend Context Tests

#### 27. **frontend/src/context/AuthContext.test.jsx** (New)

**What to Test:**
- AuthProvider wraps children correctly
- Login sets user and token
- Logout clears user and token
- Token persists in localStorage
- Token is loaded from localStorage on mount
- User state updates correctly
- isAuthenticated computed correctly

**Why This Matters:**
- AuthContext manages global auth state
- Tests localStorage integration
- Ensures auth state persists across page reloads

**Specific Instructions:**
- Create a test wrapper component
- Mock localStorage (getItem, setItem, removeItem)
- Test login/logout flows
- Verify context values are updated
- Test initial load from localStorage

**Example Test:**
```javascript
it('should load token from localStorage on mount', () => {
  localStorage.setItem('token', 'test-token');
  
  const { result } = renderHook(() => useAuth(), {
    wrapper: AuthProvider
  });
  
  expect(result.current.token).toBe('test-token');
});
```

---

#### 28. **frontend/src/context/BookContext.test.jsx** (New)

**What to Test:**
- BookProvider wraps children correctly
- Books state initializes as empty array
- addBook adds book to state
- updateBook modifies correct book
- deleteBook removes book from state
- Loading state toggles correctly
- Error state is set on failures

**Why This Matters:**
- BookContext manages book collection state
- Tests state management logic
- Ensures CRUD operations update state correctly

**Specific Instructions:**
- Use renderHook from @testing-library/react
- Test all CRUD operations
- Verify state updates are immutable
- Test loading and error states

---

#### 29. **frontend/src/hooks/useAuth.test.js** (New)

**What to Test:**
- Hook returns AuthContext values
- Throws error when used outside AuthProvider
- Returns all expected properties (user, token, login, logout, isAuthenticated)

**Why This Matters:**
- Custom hook provides auth context
- Tests hook usage patterns
- Ensures error handling for misuse

**Specific Instructions:**
- Use renderHook utility
- Test inside and outside AuthProvider
- Verify all return values exist

---

### Frontend Service Tests

#### 30. **frontend/src/services/authService.test.js** (New)

**What to Test:**
- signup() makes POST request to /auth/signup
- signup() sends correct body data
- signup() returns token and user
- signup() throws error on failure
- login() makes POST request to /auth/login
- login() sends correct credentials
- login() returns token and user
- login() throws error on 401
- verifyToken() includes Authorization header
- verifyToken() throws error on invalid token
- All methods use correct API base URL

**Why This Matters:**
- Auth service is the bridge to backend
- Tests API integration
- Ensures error handling works correctly

**Specific Instructions:**
- Mock global `fetch` function
- Mock responses for success and failure cases
- Verify correct URLs are called
- Verify request headers and body
- Test error handling for network failures

**Example Test:**
```javascript
it('should make POST request to signup endpoint', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ token: 'abc', user: { id: 1 } })
  });
  
  await authService.signup('user', 'email@test.com', 'password');
  
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/auth/signup'),
    expect.objectContaining({ method: 'POST' })
  );
});
```

---

#### 31. **frontend/src/services/bookService.test.js** (New)

**What to Test:**
- getAllBooks() makes GET request
- getAllBooks() includes auth token in headers
- getBookById() requests correct endpoint with ID
- createBook() makes POST with book data
- createBook() includes auth token
- updateBook() makes PUT request
- updateBook() includes book ID in URL
- deleteBook() makes DELETE request
- All methods throw errors on failure
- Token is retrieved from localStorage
- All methods use correct API base URL

**Why This Matters:**
- Book service handles all book API calls
- Tests CRUD operations
- Ensures authentication headers are sent

**Specific Instructions:**
- Mock global `fetch`
- Mock localStorage.getItem('token')
- Test all CRUD methods
- Verify correct HTTP methods and URLs
- Test error handling
- Verify Authorization header is included

---

### Frontend Page Tests

#### 32. **frontend/src/pages/Login.test.jsx** (New)

**What to Test:**
- Renders login form
- Email and password inputs work
- Form submission calls authService.login()
- Successful login calls context login() and navigates
- Error displays when login fails
- Loading state disables form during submission
- Link to signup page works
- Form validation (required fields)

**Why This Matters:**
- Login is entry point to app
- Tests complete authentication flow
- Ensures error handling and UX

**Specific Instructions:**
- Mock useAuth hook
- Mock useNavigate
- Mock authService.login()
- Use userEvent for form interaction
- Test both success and failure scenarios
- Verify navigation happens on success

---

#### 33. **frontend/src/pages/Signup.test.jsx** (New)

**What to Test:**
- Renders signup form
- Username, email, password inputs work
- Form submission calls authService.signup()
- Successful signup calls context login() and navigates
- Error displays when signup fails
- Loading state disables form during submission
- Link to login page works
- Password confirmation match validation (if implemented)
- Form validation (required fields, email format)

**Why This Matters:**
- Signup creates new users
- Tests registration flow
- Ensures validation works

**Specific Instructions:**
- Mock useAuth hook
- Mock useNavigate
- Mock authService.signup()
- Use userEvent for form interaction
- Test validation errors
- Test successful and failed signup

---

#### 34. **frontend/src/App.test.jsx** (New)

**What to Test:**
- App renders without crashing
- Routing works (all routes defined)
- Protected routes require authentication
- Public routes accessible without auth
- 404 page works for invalid routes
- Context providers wrap app correctly

**Why This Matters:**
- App is the root component
- Tests overall application structure
- Ensures routing configuration works

**Specific Instructions:**
- Mock AuthContext
- Mock BookContext
- Use MemoryRouter for testing routes
- Test navigation to different routes
- Verify protected routes redirect when not authenticated

---

### Frontend Integration/E2E-Style Tests

#### 35. **frontend/src/integration/bookFlow.test.jsx** (New)

**What to Test:**
- Full flow: Login → View books → Add book → Book appears in grid
- Edit book → Changes reflect in UI
- Delete book → Book removed from grid
- Search/filter books → Correct books shown
- Logout → Redirected to login

**Why This Matters:**
- Tests complete user workflows
- Ensures all components work together
- Catches integration issues

**Specific Instructions:**
- Mock API calls
- Use userEvent for realistic interactions
- Test complete workflows from start to finish
- Verify state updates across components

---

## Testing Strategy Summary

### Coverage Goals

**Backend:**
- **Unit Tests:** 60 tests minimum
  - Services: 25 tests
  - Utils: 10 tests
  - Middleware: 15 tests
  - Data Access: 10 tests

- **Integration Tests:** 25 tests minimum
  - Auth routes: 10 tests
  - Book routes: 12 tests
  - Health endpoint: 3 tests

- **Edge Cases:** 15 tests minimum

**Frontend:**
- **Component Tests:** 60 tests minimum
  - Complex components: 30 tests
  - Simple components: 20 tests
  - Search/Filter: 10 tests

- **Context/Hooks:** 10 tests minimum

- **Services:** 15 tests minimum

- **Pages:** 15 tests minimum

### Priority Order

**High Priority (Implement First):**
1. Backend service layer tests (authService, bookService)
2. Backend middleware tests (auth, errorHandler)
3. Frontend component tests (BookCard, BookGrid, AddBookModal)
4. Frontend service tests (authService, bookService)
5. Backend integration tests (expanded coverage)

**Medium Priority:**
6. Frontend page tests (Login, Signup)
7. Frontend context tests
8. Backend edge case tests
9. Backend data access tests

**Low Priority (Nice to Have):**
10. Frontend integration flow tests
11. Performance tests
12. Accessibility tests

### Testing Best Practices

1. **AAA Pattern:** Arrange → Act → Assert
2. **One assertion per test:** Focus on single behavior
3. **Descriptive test names:** "should do X when Y"
4. **Mock external dependencies:** Isolate unit under test
5. **Test edge cases:** Null, undefined, empty, very large values
6. **Clean up after tests:** Use beforeEach/afterEach
7. **Don't test implementation details:** Test behavior, not internals
8. **Keep tests independent:** No shared state between tests
9. **Use test utilities:** @testing-library, userEvent for realistic interactions
10. **Aim for readability:** Tests are documentation

---

## Test Execution Commands

```bash
# Backend tests
cd server
npm test                          # Run all tests
npm test -- auth.test.js          # Run specific test file
npm test -- --coverage            # Generate coverage report
npm test -- --watch              # Watch mode

# Frontend tests
cd frontend
npm test                          # Run all tests
npm test -- BookCard             # Run specific test
npm test -- --coverage           # Generate coverage report
npm test -- --watch              # Watch mode
```

---

## Success Criteria

✅ **Backend:** Minimum 80% code coverage  
✅ **Frontend:** Minimum 60% code coverage  
✅ **All edge cases tested**  
✅ **All tests passing in CI/CD**  
✅ **No console errors in tests**  
✅ **Tests run in < 30 seconds**

---

**Document Status:** Ready for Implementation  
**Total Tests to Implement:** ~135 tests  
**Estimated Time:** 2-3 weeks for full implementation  
**Next Step:** Begin with high-priority service layer tests
