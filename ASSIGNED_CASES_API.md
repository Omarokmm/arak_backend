# Assigned Cases API Documentation

This document describes the API endpoints for retrieving assigned cases by user and department.

## Overview

The assigned cases functionality allows you to retrieve cases that have been assigned to specific users, either for a specific department or across all departments.

## API Endpoints

### 1. Get Assigned Cases by User and Department

**Endpoint:** `GET /api/cases/assigned/user/:userId/department/:department`

**Description:** Retrieves cases assigned to a specific user for a specific department.

**Parameters:**
- `userId` (string, required): User ID (MongoDB ObjectId)
- `department` (string, required): Department name (cadcam, fitting, ceramic)

**Example:** `GET /api/cases/assigned/user/664a0952bce9fab06c37d529/department/cadcam`

**Response:**
```json
{
  "success": true,
  "message": "Assigned cases for user John Doe in cadcam department",
  "data": {
    "user": {
      "id": "664a0952bce9fab06c37d529",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "department": "cadcam",
    "assignedCases": [
      {
        "_id": "case_id_1",
        "caseNumber": "12345",
        "patientName": "Patient Name",
        "caseType": "Crown",
        "dateIn": "2024-01-01T00:00:00.000Z",
        "dateOut": "2024-01-15T00:00:00.000Z",
        "dentistObj": {
          "id": "dentist_id",
          "name": "Dr. Smith",
          "phone": "123-456-7890"
        },
        "phone": "123-456-7890",
        "address": "123 Main St",
        "gender": "Male",
        "age": "35",
        "patientPhone": "123-456-7890",
        "shadeCase": {
          "shade": "A2",
          "stumpShade": "A3",
          "gingShade": "A1"
        },
        "occlusalStaining": "Light",
        "texture": "Smooth",
        "translucency": "Medium",
        "jobDescription": "Crown restoration",
        "teethNumbers": ["14", "15"],
        "naturalOfWorks": ["Crown"],
        "isInvoice": true,
        "isEmail": true,
        "isPhoto": true,
        "isHold": false,
        "isApprove": false,
        "isUrgent": false,
        "isStudy": false,
        "isRedo": false,
        "oldCaseIds": [],
        "redoReason": null,
        "photos": [],
        "deadline": "2024-01-15T00:00:00.000Z",
        "dateReceived": "2024-01-01T00:00:00.000Z",
        "dateReceivedInEmail": "2024-01-01T00:00:00.000Z",
        "notes": [],
        "cadCam": {
          "namePhase": "Design",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false
          },
          "obj": {}
        },
        "fitting": {
          "namePhase": "Fitting",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false
          },
          "obj": {}
        },
        "plaster": {
          "namePhase": "Plaster",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false,
            "obj": {}
          },
          "obj": {}
        },
        "ceramic": {
          "namePhase": "Ceramic",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false
          },
          "obj": {}
        },
        "designing": {
          "namePhase": "Designing",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false
          },
          "obj": {}
        },
        "qualityControl": {
          "namePhase": "Quality Control",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false
          }
        },
        "delivering": {
          "namePhase": "Delivering",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false
          },
          "obj": {}
        },
        "receptionPacking": {
          "namePhase": "Reception Packing",
          "actions": [],
          "status": {
            "isStart": true,
            "isPause": false,
            "isEnd": false,
            "obj": {}
          },
          "obj": {}
        },
        "logs": [],
        "historyHolding": [],
        "historyApproving": [],
        "historyUrgent": [],
        "assignmentHistory": [],
        "isAssignedCadCam": true,
        "isAssignedFitting": false,
        "isAssignedCeramic": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "assignmentInfo": {
          "department": "CadCam",
          "assignedAt": "2024-01-01T00:00:00.000Z",
          "assignedBy": "manager_id",
          "assignedByName": "Manager Name"
        }
      }
    ],
    "count": 1
  }
}
```

### 2. Get All Assigned Cases by User

**Endpoint:** `GET /api/cases/assigned/user/:userId`

**Description:** Retrieves all cases assigned to a specific user across all departments.

**Parameters:**
- `userId` (string, required): User ID (MongoDB ObjectId)

**Example:** `GET /api/cases/assigned/user/664a0952bce9fab06c37d529`

**Response:**
```json
{
  "success": true,
  "message": "All assigned cases for user John Doe",
  "data": {
    "user": {
      "id": "664a0952bce9fab06c37d529",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "totalAssignedCases": 3,
    "casesByDepartment": {
      "cadcam": [
        {
          "_id": "case_id_1",
          "caseNumber": "12345",
          "patientName": "Patient Name",
          "assignmentInfo": {
            "department": "CadCam",
            "assignedAt": "2024-01-01T00:00:00.000Z",
            "assignedBy": "manager_id",
            "assignedByName": "Manager Name"
          }
        }
      ],
      "fitting": [
        {
          "_id": "case_id_2",
          "caseNumber": "12346",
          "patientName": "Patient Name 2",
          "assignmentInfo": {
            "department": "Fitting",
            "assignedAt": "2024-01-02T00:00:00.000Z",
            "assignedBy": "manager_id",
            "assignedByName": "Manager Name"
          }
        }
      ],
      "ceramic": [
        {
          "_id": "case_id_3",
          "caseNumber": "12347",
          "patientName": "Patient Name 3",
          "assignmentInfo": {
            "department": "Ceramic",
            "assignedAt": "2024-01-03T00:00:00.000Z",
            "assignedBy": "manager_id",
            "assignedByName": "Manager Name"
          }
        }
      ]
    },
    "allCases": [
      // All assigned cases with complete details
    ]
  }
}
```

## Use Cases and Scenarios

### Scenario 1: Get User's CadCam Cases
```bash
# Get all CadCam cases assigned to a specific user
curl -X GET http://localhost:3000/api/cases/assigned/user/664a0952bce9fab06c37d529/department/cadcam
```

### Scenario 2: Get User's Fitting Cases
```bash
# Get all Fitting cases assigned to a specific user
curl -X GET http://localhost:3000/api/cases/assigned/user/664a0952bce9fab06c37d529/department/fitting
```

### Scenario 3: Get User's Ceramic Cases
```bash
# Get all Ceramic cases assigned to a specific user
curl -X GET http://localhost:3000/api/cases/assigned/user/664a0952bce9fab06c37d529/department/ceramic
```

### Scenario 4: Get All User's Assigned Cases
```bash
# Get all cases assigned to a user across all departments
curl -X GET http://localhost:3000/api/cases/assigned/user/664a0952bce9fab06c37d529
```

### Scenario 5: Dashboard Integration
```bash
# Get user's workload for dashboard display
curl -X GET http://localhost:3000/api/cases/assigned/user/664a0952bce9fab06c37d529
# Response includes casesByDepartment for easy dashboard integration
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid user ID"
}
```

```json
{
  "error": "Invalid department. Valid departments: cadcam, fitting, ceramic"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch assigned cases",
  "details": "Error message details"
}
```

## Key Features

1. **Complete Case Information**: Returns full case details including all phases and status
2. **Assignment Information**: Includes assignment details (who assigned, when, department)
3. **Department Filtering**: Filter cases by specific department
4. **User Validation**: Validates user existence before querying
5. **Sorted Results**: Cases sorted by assignment date (newest first)
6. **Grouped Results**: All user cases endpoint groups cases by department
7. **Comprehensive Data**: Includes logs, history, and assignment tracking

## Integration with Assignment System

These endpoints work seamlessly with the assignment system:

1. **After Assignment**: Use these endpoints to verify assignments
2. **User Dashboard**: Display user's assigned cases
3. **Workload Management**: Track user workload across departments
4. **Reporting**: Generate reports on user assignments
5. **Audit Trail**: Access assignment history and logs

## Best Practices

1. **User Validation**: Always validate user ID before making requests
2. **Department Names**: Use lowercase department names (cadcam, fitting, ceramic)
3. **Error Handling**: Handle 404 errors for non-existent users
4. **Performance**: Consider pagination for users with many assigned cases
5. **Caching**: Consider caching results for frequently accessed data
