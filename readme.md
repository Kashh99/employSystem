# COMP3123 - Assignment 1: RESTful API with Node.js, Express, and MongoDB

This project is a backend application that implements RESTful APIs using Node.js, Express, and MongoDB. The assignment focuses on designing and building APIs for user and employee management, with CRUD operations for both entities.

## Objectives
1. Understand RESTful API design principles.
2. Implement CRUD operations using the provided API endpoints.
3. Test the API endpoints to ensure they return the correct response codes and data.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Libraries**: Mongoose, bcrypt (for password hashing)
- **Version Control**: Git and GitHub

## API Endpoints

### User Management
1. **POST** `/api/v1/user/signup`  
   - Description: Allow users to create new accounts.
   - Response Code: `201 Created`
   
2. **POST** `/api/v1/user/login`  
   - Description: Allow users to log in to the system.
   - Response Code: `200 OK`

### Employee Management
3. **GET** `/api/v1/emp/employees`  
   - Description: Retrieve the list of all employees.
   - Response Code: `200 OK`
   
4. **POST** `/api/v1/emp/employees`  
   - Description: Create a new employee.
   - Response Code: `201 Created`
   
5. **GET** `/api/v1/emp/employees/:eid`  
   - Description: Get details of a specific employee by ID.
   - Response Code: `200 OK`
   
6. **PUT** `/api/v1/emp/employees/:eid`  
   - Description: Update an employee’s details by ID.
   - Response Code: `200 OK`
   
7. **DELETE** `/api/v1/emp/employees?eid=xxx`  
   - Description: Delete an employee by ID.
   - Response Code: `204 No Content`

## Sample User
{
    "username": "jane_smith",
    "email": "jane.smith@example.com",
    "password": "$2b$10$EIXD4/ujq0cZNOF4REOXn.5k1O6vClocO.CZG8OdfF2A4W5I/Jk0m", // hashed password for "password123"
    "created_at": "2024-01-11T11:30:00Z",
    "updated_at": "2024-01-11T11:30:00Z"
  },
## Sample Employee

 {
    "first_name": "Bob",
    "last_name": "Smith",
    "email": "bob.smith@example.com",
    "position": "Project Manager",
    "salary": 90000,
    "date_of_joining": "2023-03-15",
    "department": "Management",
    "created_at": "2024-01-02T10:00:00Z",
    "updated_at": "2024-01-02T10:00:00Z"
  },