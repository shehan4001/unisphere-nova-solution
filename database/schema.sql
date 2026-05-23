USE UniSphereDB;
GO


SELECT * FROM Admins;

SELECT * FROM Students;

SELECT * FROM Events;

SELECT * FROM Clubs;

SELECT * FROM ClubRequests;

SELECT * FROM StudentPoints;

SELECT * FROM ClaimedTasks;

SELECT * FROM RewardActivities;





INSERT INTO Admins (FullName, Email, ContactNumber, Password, CustomID, Role)
VALUES ('Super Admin', 'admin@unisphere.com', '+94 71 234 5678', 'admin123', 'AD-0001', 'Admin');


INSERT INTO Admins (FullName, Email, ContactNumber, Password, CustomID, Role)
VALUES ('Admin', 'admin2@unisphere.com', '+94 77 123 4567', 'admin456', 'AD-0002', 'Admin');
GO



CREATE LOGIN unisphere_user WITH PASSWORD = 'User@123', CHECK_POLICY = OFF;
CREATE USER unisphere_user FOR LOGIN unisphere_user;
ALTER ROLE db_owner ADD MEMBER unisphere_user;
GO


DELETE FROM Events 
WHERE EventID = 1;


DROP TABLE IF EXISTS ClubRequests;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Clubs;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS StudentPoints;
DROP TABLE IF EXISTS ClaimedTasks;
DROP TABLE IF EXISTS RewardActivities;
GO


CREATE TABLE Admins (
    AdminID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    ContactNumber NVARCHAR(15), 
    Password NVARCHAR(255) NOT NULL,
    CustomID NVARCHAR(20) UNIQUE NOT NULL, 
    Role NVARCHAR(20) DEFAULT 'Admin',
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    CustomID NVARCHAR(20) UNIQUE NOT NULL, 
    FullName NVARCHAR(150) NOT NULL,
    Faculty NVARCHAR(100),
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'Student',
    CreatedAt DATETIME DEFAULT GETDATE()
);



CREATE TABLE Events (
    EventID INT PRIMARY KEY IDENTITY(1,1),

    AdminID INT NOT NULL,

    EventTitle NVARCHAR(255) NOT NULL,

    EventDate DATE NOT NULL,

    EventTime TIME NOT NULL,

    Category NVARCHAR(100) NOT NULL,

    Location NVARCHAR(255) NOT NULL,

    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Events_Admins
    FOREIGN KEY (AdminID)
    REFERENCES Admins(AdminID)
);

CREATE TABLE Clubs (
    ClubID INT PRIMARY KEY IDENTITY(1,1),

    AdminID INT NOT NULL,

    Name NVARCHAR(255) NOT NULL,

    Category NVARCHAR(100),

    Description NVARCHAR(MAX),

    ImagePath NVARCHAR(MAX),

    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Clubs_Admins
    FOREIGN KEY (AdminID)
    REFERENCES Admins(AdminID)
);



CREATE TABLE ClubRequests (
    RequestID INT PRIMARY KEY IDENTITY(1,1),

    StudentID INT NOT NULL,

    ClubID INT NOT NULL,

    Status NVARCHAR(50) DEFAULT 'Pending',

    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_ClubRequests_Students
    FOREIGN KEY (StudentID)
    REFERENCES Students(StudentID),

    CONSTRAINT FK_ClubRequests_Clubs
    FOREIGN KEY (ClubID)
    REFERENCES Clubs(ClubID)
);

CREATE TABLE StudentPoints (
    PointID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL UNIQUE,
    Points INT DEFAULT 0,
    UpdatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

CREATE TABLE ClaimedTasks (
    ClaimID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    TaskID NVARCHAR(100) NOT NULL,
    PointsEarned INT NOT NULL,
    ClaimedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);

CREATE TABLE RewardActivities (
    ActivityID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT NOT NULL,
    ActivityTitle NVARCHAR(150) NOT NULL,
    PointsChanged INT NOT NULL,
    ActivityType NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (StudentID) REFERENCES Students(StudentID)
);
