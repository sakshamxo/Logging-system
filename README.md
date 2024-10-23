# Logging System with Role-Based Access Control

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Exporting Logs](#exporting-logs)
- [Contributing](#contributing)
- [License](#license)

## Introduction
This project is a logging system that implements role-based access control (RBAC) to manage user actions and maintain an audit trail. It allows users to perform various actions while logging their activities, enabling administrators to monitor and control access effectively.

## Features
- **Role-Based Access Control**: Different user roles with specific permissions.
- **CRUD Operations for Logs**: Create, Read, Update, and Delete log entries.
- **Soft Deletion**: Logs can be marked as deleted without being permanently removed.
- **Search Functionality**: Search logs by keywords (user ID, action type).
- **Pagination**: Efficiently display large sets of logs.
- **Export Logs**: Export logs in CSV or JSON format.
- **Responsive Design**: User-friendly interface accessible on various devices.

## Technologies Used
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Others**: json2csv for CSV export functionality

## Getting Started
To get started with this project locally, follow these steps:

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local instance or MongoDB Atlas)
- NPM or Yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/sakshamxo/logging-system.git
   cd logging-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables. Create a `.env` file in the root directory and add your MongoDB URI and any other necessary configuration:
   plaintext
  MONGODB_URI=mongodb+srv://msakshams24:eaBpG6ek5ifFlp3j@healthnifity.z2xeo.mongodb.net/?retryWrites=true&w=majority&appName=healthnifity
  JWT_SECRET=the_healthnifity


4. Start the development server:
   bash
   npm run dev
   # or
   yarn dev
 

5. Open your browser and go to `http://localhost:3000` to view the application.

## API Endpoints
- **GET /api/logs**: Retrieve logs (supports pagination, searching, and soft-deleted logs).
- **DELETE /api/logs/delete**: Delete a log entry by ID.
- **GET /api/logs/export**: Export logs in CSV or JSON format.

## Usage
1. Log in using a valid user account. 
2. Navigate to the logs section to view all user activities.
3. Use the search bar to filter logs based on user ID or action type.
4. Click on the "Delete" button to remove a log entry (soft delete).
5. Toggle to view deleted logs using the "Show Deleted Logs" button.
6. Export logs using the "Export to CSV" or "Export to JSON" buttons.

## Exporting Logs
You can export logs in two formats:
- **CSV**: Click on the "Export to CSV" button to download logs as a CSV file.
- **JSON**: Click on the "Export to JSON" button to download logs as a JSON file.

## Contributing
Contributions are welcome! If you have suggestions for improvements or features, please open an issue or submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

