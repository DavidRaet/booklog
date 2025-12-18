<h1 align="center">Welcome to booklog 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/booklog" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/booklog.svg">
  </a>
  <a href="https://opensource.org/license/mit" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> BookLog is a full-stack web application that helps readers track, organize, and review their personal book collection. Built with a modern tech stack, it provides an intuitive interface for managing your reading journey with features like search, filtering, and detailed book reviews. This project is actively under development. 



> Anticipated features based on current implementation patterns include:
- Advanced Search: Full-text search across reviews and multi-criteria filtering
- Reading Status Tracking: Mark books as "to-read," "currently reading," or "completed"
- Reading Statistics: Visual analytics and insights into reading habits
- Book Collections/Shelves: Organize books into custom categories
- Social Features: Share reviews and discover books from other readers
- Reading Goals: Set and track annual reading targets
- Book Recommendations: Personalized suggestions based on reading history
- Import/Export: Bulk import from CSV or export your library
- Dark Mode: Theme toggle for comfortable reading in any lighting





# Installation Instructions 

## Prerequisites
Docker & Docker Compose (recommended), 
OR
Node.js 18+ and PostgreSQL 13+ (for manual setup)



## Option 1: Using Docker

### Clone the repository
```
git clone <repository-url>
cd booklog
```


### Create environment file
```
cp server/.env.example server/.env.prod
```
Make sure to edit server/.env.prod with your database credentials

### Start all services
```
docker-compose up --build
```

### Access the app
Frontend: http://localhost:5173
Backend API: http://localhost:3002


## Option 2: Manual Setup

### Create a database named 'booklog' (or your preferred name)
```
createdb booklog
```

### Set up Backend
```
cd server
```

### Install dependencies
```
npm install
```

### Create .env file
```
cp .env.example .env
```
Configure your env variables: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET

### Start the server
npm start
Server runs on http://localhost:3002

## Set up Frontend
```
cd frontend
```

### Install dependencies
```
npm install
```

### Start development server
```
npm run dev
```

Frontend runs on http://localhost:5173


## Environment Variables
Create .env with: 
```
DB_HOST=localhost         
DB_PORT=5432
DB_NAME=booklog
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
PORT=3002
```

## Testing 
### Frontend tests
```
cd frontend
```
```
npm test
```

### Backend tests
```
cd server
```
```
npm test
```



## Author

👤 **David Raet **

* Github: [@DavidRaet](https://github.com/DavidRaet)
* LinkedIn: [@DavidRaet](https://linkedin.com/in/DavidRaet)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2025 [David Raet ](https://github.com/DavidRaet).<br />
This project is [MIT](https://opensource.org/license/mit) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_