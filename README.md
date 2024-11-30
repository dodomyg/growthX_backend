GrowthX Backend API

This repository contains the backend API for GrowthX, a task management and assignment system. It supports user authentication, role-based access control for tasks assignments

Setup Instructions 📦
Prerequisites:

    Node.js (v14 or higher)
    MongoDB installed and running
    npm (Node Package Manager)

Installation Steps:

    Clone the repository:

git clone https://github.com/dodomyg/growthX_backend.git
cd growthX_backend

Install dependencies:

npm install

Set up environment variables: Create a .env file in the root directory and add the following variables:

MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret_key

Start the server:

    npm start

    The server will run on http://localhost:5000.

Environment Variables 🌐

Create a .env file in the root directory with the following keys:

    MONGO_URI: Connection string for MongoDB
    SECRET: Secret key for JWT token generation

 **Endpoints:**
    - **User Endpoints:**
        - `POST /register` - Register a new user.
        - `POST /login` - User login.
        - `POST /user/upload` - Upload an assignment.
        - `GET /user/admins`- fetch all admins
    - **Admin Endpoints:**
        - `POST /register` - Register a new admin.
        - `POST /login` - Admin login.
        - `GET /admin/assignments` - View assignments tagged to the admin.
        - `POST /admin/assignments/:id/accept` - Accept an assignment.
        - `POST /admin/assignments/:id/reject` - Reject an assignment.
