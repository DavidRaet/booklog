# Booklog Codebase Assessment & Refactoring Roadmap

**Date:** December 21, 2025  
**Stack:** Node.js/Express (Backend), React/Vite (Frontend), PostgreSQL, Docker

---

## 📁 Current Repository Structure

```
booklog/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
├── docker-compose.yml                # Multi-container orchestration
├── README.md
├── CLAUDE.md                         # Refactoring spec document
├── .gitignore
│
├── server/                           # Backend (Express + Sequelize)
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── vitest.config.js
│   ├── index.js                      # ✅ App entrypoint (cleaned up)
│   ├── database.js                   # ⚠️ DB connection function (naming conflict)
│   ├── .env.example
│   ├── .dockerignore
│   ├── .gitignore
│   │
│   ├── config/
│   │   └── database.js               # ⚠️ Sequelize instance (naming conflict)
│   │
│   ├── db/                           # Data access layer
│   │   ├── bookQueries.js
│   │   └── userQueries.js            # ✅ Cleaned (removed unused import)
│   │
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   │
│   ├── models/                       # Sequelize ORM models
│   │   ├── index.js
│   │   ├── User.js
│   │   └── Book.js
│   │
│   ├── routes/                       # HTTP route handlers
│   │   ├── auth.js                   # Auth routes (signup, login, verify)
│   │   └── books.js                  # ✅ NEW: Book CRUD routes (extracted)
│   │
│   ├── schemas/                      # Zod validation schemas
│   │   ├── BookSchema.js
│   │   ├── LoginSchema.js
│   │   └── SignUpSchema.js
│   │
│   ├── utils/                        # Utility functions
│   │   ├── createRandomUser.js       # Test helper
│   │   ├── jwt.js                    # JWT generation/verification
│   │   └── verifyBookOwnership.js    # ⚠️ Business logic (should be service)
│   │
│   └── tests/
│       ├── integration/
│       │   ├── auth.test.js
│       │   └── books.test.js
│       └── unit/
│           └── jwt.test.js
│
└── frontend/                         # Frontend (React + Vite)
    ├── package.json
    ├── package-lock.json
    ├── Dockerfile
    ├── index.html
    ├── vite.config.js
    ├── vitest.config.js
    ├── eslint.config.js
    ├── tailwind.config.js
    ├── tailwind.config.cjs
    ├── postcss.config.js
    ├── postcss.config.cjs
    ├── README.md
    ├── .gitignore
    │
    └── src/
        ├── main.jsx                  # App entry point
        ├── App.jsx                   # Main app component
        ├── App.css
        ├── index.css
        │
        ├── components/
        │   ├── AddBookModal.jsx
        │   ├── AddBookModal.test.jsx
        │   ├── BookCard.jsx
        │   ├── BookDetails.jsx
        │   ├── BookDetailsPage.jsx
        │   ├── BookGrid.jsx
        │   ├── Button.jsx
        │   ├── ErrorState.jsx
        │   ├── Header.jsx
        │   ├── Input.jsx
        │   ├── LoadingState.jsx
        │   ├── ProtectedRoute.jsx
        │   └── SearchFilter/
        │       ├── GenreFilter.jsx
        │       ├── RatingFilter.jsx
        │       ├── SearchBar.jsx
        │       └── SearchFilterBar.jsx
        │
        ├── context/
        │   └── AuthContext.jsx        # ✅ Consolidated (removed MyAuthContext)
        │
        ├── hooks/
        │   └── useAuth.js             # ✅ Updated import path
        │
        ├── pages/
        │   ├── Login.jsx
        │   └── Signup.jsx
        │
        └── services/
            ├── authService.js         # API calls for authentication
            └── bookService.js         # API calls for books
```

---

## 🐛 Code Smells Identified

### **Critical**

| # | Smell | Location | Impact |
|---|-------|----------|--------|
| 1 | **Naming conflict: `database.js` appears twice** | `server/database.js` (connectDB function) vs `server/config/database.js` (Sequelize instance) | **High** – Confusing for developers; unclear import paths |
| 2 | **Missing central configuration file** | Hardcoded values in `server/index.js`, `frontend/src/services/*.js` | **High** – Violates DRY; difficult to change ports/URLs across environments |
| 3 | **Business logic in utils/** | `server/utils/verifyBookOwnership.js` | **Medium** – Utils should be pure helpers; this is domain logic |
| 4 | **No error handling middleware** | Routes handle errors individually | **Medium** – Duplicate error handling code; inconsistent error responses |
| 5 | **No service layer** | Routes directly call DB queries | **Medium** – Violates separation of concerns; hard to test business logic |

### **Moderate**

| # | Smell | Location | Impact |
|---|-------|----------|--------|
| 6 | **Hardcoded API URLs** | `frontend/src/services/authService.js`, `bookService.js` | **Medium** – Not environment-aware |
| 7 | **Duplicate Tailwind/PostCSS configs** | `.js` and `.cjs` versions of same config | **Low** – Confusing; only one is used |
| 8 | **Inconsistent import from `pool` vs Sequelize** | Tests import `pool` from `database.js` but code uses Sequelize | **Medium** – Tests reference wrong DB abstraction |
| 9 | **No logging abstraction** | `console.log()` and `console.error()` scattered everywhere | **Medium** – Hard to control log levels in production |
| 10 | **State management in App.jsx** | All book state lives in `App.jsx` | **Medium** – Component will grow; consider Context or state library |

### **Minor**

| # | Smell | Location | Impact |
|---|-------|----------|--------|
| 11 | **Test import paths will break if structure changes** | `tests/integration/*.test.js` | **Low** – Brittle imports like `../../index.js` |
| 12 | **No API versioning** | Routes at `/api/books` instead of `/api/v1/books` | **Low** – Hard to evolve API without breaking clients |
| 13 | **Missing health check endpoint** | No `/health` or `/ping` route | **Low** – Can't verify server is up without hitting auth routes |
| 14 | **No request validation middleware** | Validation happens inside route handlers | **Low** – Could be DRYer with middleware |
| 15 | **createRandomUser utility in production code** | `server/utils/createRandomUser.js` | **Low** – Should be in `tests/` folder |

---

## 🎯 Recommended Structural Improvements (Priority Ranked)

### **Priority 1: Critical Architectural Issues**

#### **1.1 Resolve `database.js` Naming Conflict**
- **Why it matters:** Two files with the same name cause confusion. Developers must remember which `database.js` to import.
- **What to change:**
  - Rename `server/database.js` → `server/db/connect.js`
  - Update imports in `server/index.js` and tests
- **Risk:** Low (simple rename)
- **Files affected:** `server/database.js`, `server/index.js`, `server/tests/integration/*.test.js`

```diff
# Before
server/database.js              # connectDB function
server/config/database.js       # sequelize instance

# After
server/db/connect.js            # connectDB function
server/config/database.js       # sequelize instance (unchanged)
```

---

#### **1.2 Create Central Configuration Module**
- **Why it matters:** Hardcoded ports/URLs violate DRY and make multi-environment deployment hard.
- **What to change:**
  - Create `server/config/env.js` to centralize environment variables
  - Create `frontend/src/config/api.js` for API base URL
- **Risk:** Low (no behavior change)
- **Files affected:** New files + updates to `server/index.js`, `frontend/src/services/*.js`

**server/config/env.js:**
```javascript
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    url: process.env.POSTGRES_URL
  }
};
```

**frontend/src/config/api.js:**
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";
```

---

#### **1.3 Add Global Error Handling Middleware**
- **Why it matters:** Routes currently duplicate error handling. Centralize for consistency.
- **What to change:**
  - Create `server/middleware/errorHandler.js`
  - Add as last middleware in `server/index.js`
  - Throw errors in routes/services instead of catching individually
- **Risk:** Medium (changes error flow)
- **Files affected:** New `middleware/errorHandler.js`, `server/index.js`, all route files

**server/middleware/errorHandler.js:**
```javascript
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

### **Priority 2: Service Layer & Business Logic**

#### **2.1 Extract Service Layer**
- **Why it matters:** Routes should handle HTTP concerns only. Business logic should live in services.
- **What to change:**
  - Create `server/services/bookService.js`
  - Create `server/services/authService.js`
  - Move `verifyBookOwnership` logic into `bookService`
  - Routes become thin wrappers
- **Risk:** Medium (significant restructure)
- **Files affected:** New `services/` folder, `routes/*.js`, delete `utils/verifyBookOwnership.js`

**Example: server/services/bookService.js**
```javascript
import * as bookQueries from '../db/bookQueries.js';

export class BookService {
  async getBooksByUserId(userId) {
    return await bookQueries.getBooksByUserId(userId);
  }

  async getBookById(bookId, userId) {
    const book = await bookQueries.getBookById(bookId);
    
    if (!book) {
      const error = new Error('Book not found');
      error.statusCode = 404;
      throw error;
    }

    if (book.user_id !== userId) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }

    return book;
  }

  async createBook(bookData) {
    return await bookQueries.createBook(bookData);
  }

  async updateBook(bookId, userId, bookData) {
    await this.getBookById(bookId, userId); // verify ownership
    return await bookQueries.updateBook(bookId, bookData);
  }

  async deleteBook(bookId, userId) {
    await this.getBookById(bookId, userId); // verify ownership
    await bookQueries.deleteBook(bookId);
  }
}

export const bookService = new BookService();
```

---

#### **2.2 Move Test Utilities to Tests Folder**
- **Why it matters:** `createRandomUser.js` is test-specific; shouldn't be in production `utils/`
- **What to change:**
  - Move `server/utils/createRandomUser.js` → `server/tests/helpers/createRandomUser.js`
  - Update test imports
- **Risk:** Low
- **Files affected:** `server/utils/createRandomUser.js`, `server/tests/integration/*.test.js`

---

### **Priority 3: Frontend Architecture**

#### **3.1 Extract Book State to Context**
- **Why it matters:** `App.jsx` is becoming a God component with all book state/logic
- **What to change:**
  - Create `frontend/src/context/BookContext.jsx`
  - Move book state, CRUD operations to context
  - `App.jsx` becomes routing + layout only
- **Risk:** Medium (significant refactor)
- **Files affected:** New `context/BookContext.jsx`, `App.jsx`, components consuming book state

---

#### **3.2 Consolidate Config Files**
- **Why it matters:** Duplicate `.js` and `.cjs` Tailwind/PostCSS configs are confusing
- **What to change:**
  - Keep only `.js` versions (ESM-compatible)
  - Delete `.cjs` duplicates
- **Risk:** Low
- **Files affected:** `frontend/tailwind.config.cjs`, `frontend/postcss.config.cjs`

---

### **Priority 4: Testing & Observability**

#### **4.1 Add Logging Abstraction**
- **Why it matters:** `console.log()` everywhere makes it hard to control log levels in production
- **What to change:**
  - Add `winston` or `pino` logging library
  - Create `server/utils/logger.js` wrapper
  - Replace all `console.*` calls
- **Risk:** Low (additive change)
- **Files affected:** All server files using `console.*`

**server/utils/logger.js:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

export default logger;
```

---

#### **4.2 Add Health Check Endpoint**
- **Why it matters:** Load balancers and monitoring tools need a simple endpoint to verify server is running
- **What to change:**
  - Add `GET /health` route
  - Check DB connection + return status
- **Risk:** Low
- **Files affected:** `server/index.js` or new `server/routes/health.js`

**server/routes/health.js:**
```javascript
import express from 'express';
import sequelize from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected'
      }
    });
  }
});

export default router;
```

---

#### **4.3 Improve Test Coverage**
- **Why it matters:** Frontend has minimal tests; backend has good coverage but could add edge cases
- **What to change:**
  - Add component tests for critical UI (BookGrid, AddBookModal)
  - Add service layer tests when services are created
  - Test error handling paths
- **Risk:** Low (tests are additive)
- **Files affected:** New test files in `frontend/src/components/`, `server/tests/unit/`

---

### **Priority 5: Security & Production Readiness**

#### **5.1 Add Rate Limiting**
- **Why it matters:** Prevent abuse of auth endpoints (brute force attacks)
- **What to change:**
  - Add `express-rate-limit` middleware
  - Apply to `/api/auth` routes
- **Risk:** Low
- **Dependencies:** `express-rate-limit` (new)

**Implementation:**
```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

app.use('/api/auth/login', authLimiter);
```

---

#### **5.2 Add Request Validation Middleware**
- **Why it matters:** Centralize validation instead of validating in each route handler
- **What to change:**
  - Create `server/middleware/validate.js`
  - Wrap Zod schemas into Express middleware
  - Apply to routes
- **Risk:** Low

**server/middleware/validate.js:**
```javascript
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.issues
      });
    }
    
    req.validatedData = result.data;
    next();
  };
};
```

---

#### **5.3 Add API Versioning**
- **Why it matters:** Allows breaking changes without affecting existing clients
- **What to change:**
  - Prefix routes with `/api/v1`
  - Update frontend API calls
- **Risk:** Low (breaking change for clients, but simple to implement)
- **Files affected:** `server/index.js`, `server/routes/*.js`, `frontend/src/services/*.js`

```javascript
// server/index.js
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', booksRoutes);
```

---

#### **5.4 Add Security Headers**
- **Why it matters:** Protect against common web vulnerabilities
- **What to change:**
  - Add `helmet` middleware
  - Configure CSP, HSTS, etc.
- **Risk:** Low
- **Dependencies:** `helmet` (new)

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
```

---

## 🔮 Future Necessary Updates

### **Phase 1: Immediate (Next 1-2 Sprints)**

1. **Resolve database.js naming conflict** ✅ (Critical)
2. **Create central configuration** ✅ (Critical)
3. **Add error handling middleware** ✅ (Critical)
4. **Extract service layer** ✅ (High priority)
5. **Add health check endpoint** (Quick win)

### **Phase 2: Short-term (Next Quarter)**

6. **Add logging abstraction** (Observability)
7. **Extract frontend state to Context** (Maintainability)
8. **Add rate limiting** (Security)
9. **Add request validation middleware** (DRY)
10. **Move test utilities to tests folder** (Organization)
11. **Remove duplicate config files** (Cleanup)

### **Phase 3: Medium-term (Next 6 Months)**

12. **Add API versioning** (Future-proofing)
13. **Add security headers (helmet)** (Security hardening)
14. **Improve test coverage** (Quality)
15. **Add comprehensive error codes** (API consistency)
16. **Add API documentation (Swagger/OpenAPI)** (Developer experience)
17. **Add database migrations tooling** (Deployment safety)

### **Phase 4: Long-term (Ongoing)**

18. **Consider migration to TypeScript** (Type safety)
19. **Add performance monitoring (APM)** (Production readiness)
20. **Add automated DB backups** (Disaster recovery)
21. **Consider replacing state management** (If app grows significantly)
22. **Add E2E tests (Playwright/Cypress)** (Quality assurance)
23. **Add feature flags** (Gradual rollouts)

---

## 📊 Refactoring Scores

| Category | Score | Notes |
|----------|-------|-------|
| **Structure** | 6/10 | Good folder organization, but missing service layer and has naming conflicts |
| **Separation of Concerns** | 5/10 | Routes do too much; business logic mixed with HTTP handling |
| **Consistency** | 7/10 | Generally consistent patterns, but some inconsistencies (e.g., two database.js files) |
| **Testability** | 6/10 | Tests exist but hard to test business logic when it's in routes |
| **Security Hygiene** | 7/10 | Auth exists, validation exists, but missing rate limiting and security headers |
| **DX/Documentation** | 6/10 | README exists, but no API docs, unclear project setup |

**Overall Maturity:** **6.2/10** – Solid foundation but needs architectural improvements before scaling

---

## 🎯 Success Metrics

### **Code Quality Metrics**
- [ ] Zero ESLint warnings
- [ ] >80% test coverage (backend)
- [ ] >60% test coverage (frontend)
- [ ] All tests passing in CI/CD
- [ ] No console.* in production code (use logger)

### **Architecture Metrics**
- [ ] Service layer exists and is used by all routes
- [ ] No business logic in routes or utils
- [ ] Centralized error handling (one place)
- [ ] Centralized configuration (one place)
- [ ] Clear separation: routes → services → data access

### **Security Metrics**
- [ ] Rate limiting on auth endpoints
- [ ] Helmet security headers enabled
- [ ] All inputs validated with Zod
- [ ] No secrets in code (all in .env)
- [ ] HTTPS enforced in production

### **Production Readiness Metrics**
- [ ] Health check endpoint exists
- [ ] Structured logging in place
- [ ] Docker containers build successfully
- [ ] Database migrations automated
- [ ] API versioning implemented

---

## 📚 Recommended Resources

### **Architecture Patterns**
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Architecture in Node.js](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

### **Security**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### **Testing**
- [Testing Node.js Applications](https://github.com/testjavascript/nodejs-integration-tests-best-practices)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🚀 Implementation Strategy

### **Recommended Approach**

1. **Start with non-breaking changes** (Priority 1.1, 1.2)
2. **Add infrastructure before refactoring** (logging, error handling)
3. **Refactor one domain at a time** (e.g., books first, then auth)
4. **Keep tests passing after each change**
5. **Review with team before merging large architectural changes**

### **Branch Strategy**

```
main
  ├── feat/config-centralization      (P1.2)
  ├── feat/error-middleware           (P1.3)
  ├── feat/service-layer              (P2.1)
  └── feat/health-endpoint            (P4.2)
```

### **Rollout Plan**

- **Week 1-2:** Priority 1 items (critical fixes)
- **Week 3-4:** Priority 2 items (service layer)
- **Week 5-6:** Priority 3 items (frontend improvements)
- **Week 7+:** Priority 4-5 items (production hardening)

---

**Last Updated:** December 21, 2025  
**Document Owner:** David Raet
**Status:** 🟡 In Progress (Phase 1 Complete)
