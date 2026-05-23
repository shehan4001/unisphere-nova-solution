# UniSphere Database Setup

## Database Management System
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)

## Technologies Used
- SQL Server Management Studio 20.2.37.0
- SQL Server Management Objects (SMO) 17.100.40.0
- Microsoft T-SQL Parser 17.2.3.1
- Microsoft Data SqlClient 5.1.5
- Microsoft .NET Framework 4.0.30319.42000

## Operating System
- Windows 11

## Database Name
UniSphereDB

## Setup Instructions

1. Open SQL Server Management Studio (SSMS)
2. Create a new database named `UniSphereDB`
3. Open the `schema.sql` file
4. Execute the SQL queries to create all relational tables

---

## Relational Tables Included
- Admins
- Students
- Events
- Clubs
- ClubRequests
- StudentPoints
- ClaimedTasks
- RewardActivities

---

## Features Supported
- Student Registration
- Club Management
- Event Management
- Reward System
- Club Join Requests
- Dashboard Analytics
- Relational Database Constraints

---

## SQL Server Engine Information

- Database Engine: Microsoft SQL Server 2025 (RTM)
- Engine Version: 17.0.1000.7
- Edition: SQL Server Express
- Database Environment: SQL Server Management Studio (SSMS)

## Running the UniSphere Web Application

### Start the Backend Server

1. Open a new terminal
2. Select the UniSphere project folder
3. Run the following commands:

```bash
cd src\server
node server.js
``` 
### Start the Frontend Application

1. Open another new terminal  
2. Select the UniSphere project folder  
3. Run the following command:

```bash
npm run dev
``` 
