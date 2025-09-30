# LMS Enhanced - Learning Management System

A comprehensive Learning Management System built with Spring Boot backend and React frontend, featuring user authentication, course management, assessments, and progress tracking.

## 🚀 Features

### Authentication & Security
- **Secure User Registration & Login** with BCrypt password encryption
- **JWT Token-based Authentication** for secure API access
- **Input Validation** with comprehensive error handling
- **Password Security** with minimum length requirements

### Course Management
- **Course Catalog** with detailed course information
- **Course Enrollment** and unenrollment functionality
- **Progress Tracking** for enrolled courses
- **Course Assessments** with automated scoring

### User Management
- **User Profiles** with personal information management
- **Dashboard** for tracking learning progress
- **Certificate Generation** upon course completion
- **Feedback System** for course reviews

### Technical Features
- **Responsive Design** for mobile and desktop
- **Real-time Updates** with React state management
- **RESTful API** with comprehensive endpoints
- **Database Integration** with H2 (development) and MySQL (production)
- **Comprehensive Testing** with unit and integration tests

## 🛠️ Technology Stack

### Backend
- **Spring Boot 3.x** - Main framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations
- **H2 Database** - Development database
- **MySQL** - Production database
- **Maven** - Dependency management
- **JUnit 5** - Testing framework

### Frontend
- **React 18** - Frontend framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling
- **FontAwesome** - Icons

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Node.js 16** or higher
- **npm** or **yarn**
- **Maven 3.6** or higher
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/LMS-Enhanced.git
cd LMS-Enhanced
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies and run the application:

```bash
# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

#### Backend Configuration

The application uses H2 in-memory database by default. To access the H2 console:

1. Navigate to `http://localhost:8080/h2-console`
2. Use the following connection settings:
   - **JDBC URL**: `jdbc:h2:mem:testdb`
   - **Username**: `sa`
   - **Password**: (leave empty)

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies and start the development server:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on `http://localhost:3000`

## 🔧 Configuration

### Database Configuration

#### Development (H2)
The application is configured to use H2 in-memory database for development. No additional setup required.

#### Production (MySQL)
To use MySQL in production, update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/lms_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
```

### Security Configuration

The application uses BCrypt for password encryption and JWT for authentication. Security settings can be modified in `SecurityConfig.java`.

## 🧪 Testing

### Backend Tests

Run all backend tests:

```bash
cd backend
mvn test
```

### Test Coverage

The application includes:
- **Unit Tests** for service classes
- **Integration Tests** for REST API endpoints
- **Validation Tests** for input validation

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | User login |
| GET | `/api/users/details` | Get user details |

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/{id}` | Get course by ID |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course |

### Learning Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/learning/{userId}` | Get user's enrolled courses |
| POST | `/api/learning` | Enroll in a course |
| DELETE | `/api/learning/{id}` | Unenroll from course |

## 🎯 Usage

### For Students

1. **Register** a new account or **login** with existing credentials
2. **Browse** available courses in the catalog
3. **Enroll** in courses of interest
4. **Track progress** through the dashboard
5. **Take assessments** to test knowledge
6. **Receive certificates** upon completion

### For Administrators

1. **Manage courses** through the admin dashboard
2. **View user enrollments** and progress
3. **Add new courses** and assessments
4. **Monitor system usage** and feedback

## 🔒 Security Features

- **Password Encryption** using BCrypt
- **Input Validation** on both frontend and backend
- **SQL Injection Protection** through JPA
- **XSS Protection** with proper input sanitization
- **CORS Configuration** for secure cross-origin requests

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `application.properties`
   - Frontend: Set `PORT=3001 npm start`

2. **Database Connection Issues**
   - Verify H2 console settings
   - Check MySQL connection if using production database

3. **CORS Issues**
   - Verify CORS configuration in `SecurityConfig.java`
   - Check frontend API base URL

### Logs

- Backend logs: Check console output or `logs/` directory
- Frontend logs: Check browser developer console

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Spring Boot community for excellent documentation
- React community for comprehensive guides
- All contributors who helped improve this project

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/LMS-Enhanced/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainers

---

**Happy Learning! 🎓**