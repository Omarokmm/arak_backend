# Case Assignment API Documentation

## POST /api/cases/assign

Assigns, reassigns, or unassigns multiple cases to users based on their departments.

### Request Body

#### 1. Basic Assignment (Default)
```json
{
    "caseIds": [
        "68a4fbe0efb31538773a5016",
        "68a600d3efb31538773a5943"
    ],
    "assignments": [
        {
            "department": "CadCam",
            "userId": "664a0952bce9fab06c37d529"
        },
        {
            "department": "Fitting",
            "userId": "664a244cbce9fab06c37d5e9"
        }
    ],
    "assignedBy": "664a2e1c128e34251ee29a10",
    "assignedByName": "Yusef Karzoon",
    "assignedAt": "2025-09-18T16:51:11.199Z",
    "action": "assign"
}
```

#### 2. Reassignment (Change User)
```json
{
    "caseIds": [
        "68a4fbe0efb31538773a5016"
    ],
    "assignments": [
        {
            "department": "CadCam",
            "userId": "664a0952bce9fab06c37d529"
        }
    ],
    "assignedBy": "664a2e1c128e34251ee29a10",
    "assignedByName": "Yusef Karzoon",
    "action": "reassign"
}
```

#### 3. Unassignment (Remove Assignment)
```json
{
    "caseIds": [
        "68a4fbe0efb31538773a5016"
    ],
    "assignments": [
        {
            "department": "CadCam",
            "userId": null
        }
    ],
    "assignedBy": "664a2e1c128e34251ee29a10",
    "assignedByName": "Yusef Karzoon",
    "action": "unassign"
}
```

### Request Parameters

- `caseIds` (array, required): Array of case IDs to be assigned
- `assignments` (array, required): Array of assignment objects
  - `department` (string, required): Department name (e.g., "CadCam", "Fitting", "Caramic")
  - `userId` (string, required for assign/reassign, null for unassign): User ID to assign cases to
- `assignedBy` (string, required): ID of the user making the assignment
- `assignedByName` (string, required): Name of the user making the assignment
- `assignedAt` (string, optional): ISO date string for assignment time (defaults to current time)
- `action` (string, optional): Action type - "assign" (default), "reassign", or "unassign"

### Response

#### Success Response (200 OK)

```json
{
    "success": true,
    "message": "Cases assigned successfully",
    "results": [
        {
            "department": "CadCam",
            "userId": "664a0952bce9fab06c37d529",
            "casesAssigned": 7,
            "caseUpdateResult": 7,
            "userUpdated": true
        },
        {
            "department": "Fitting",
            "userId": "664a244cbce9fab06c37d5e9",
            "casesAssigned": 7,
            "caseUpdateResult": 7,
            "userUpdated": true
        },
        {
            "department": "Caramic",
            "userId": "664a1159bce9fab06c37d564",
            "casesAssigned": 7,
            "caseUpdateResult": 7,
            "userUpdated": true
        }
    ],
    "totalCasesAssigned": 7,
    "totalAssignments": 3
}
```

#### Error Responses

- `400 Bad Request`: Invalid request data
- `404 Not Found`: Cases or users not found

### What the API Does

1. **Validates Input**: Checks that all case IDs and user IDs are valid MongoDB ObjectIds
2. **Verifies Existence**: Ensures all cases and users exist in the database
3. **Captures Previous State**: Records current assignment state before making changes
4. **Handles Actions**:
   - **Assign**: Sets department flags to true and adds cases to user's assignedCases array
   - **Reassign**: Removes previous assignments, then assigns to new user
   - **Unassign**: Removes assignments from users and sets department flags to false
5. **Updates Cases**: Sets/unsets department-specific assignment flags (isAssignedCadCam, isAssignedFitting, isAssignedCeramic)
6. **Updates Users**: Adds/removes assigned cases from each user's `assignedCases` array
7. **Comprehensive Logging**: Records full action details in case logs and assignment history
8. **Tracks Assignment**: Records who assigned/unassigned the cases and when

### Database Changes

#### Case Model Updates
- **Assign/Reassign**: Sets department-specific assignment flags to true:
  - `isAssignedCadCam: true` for CadCam department assignments
  - `isAssignedFitting: true` for Fitting department assignments  
  - `isAssignedCeramic: true` for Ceramic department assignments
- **Unassign**: Sets department-specific assignment flags to false:
  - `isAssignedCadCam: false` for CadCam department unassignments
  - `isAssignedFitting: false` for Fitting department unassignments  
  - `isAssignedCeramic: false` for Ceramic department unassignments
- **Logging**: Adds detailed log entries to `logs` array with:
  - Action type (assign/reassign/unassign)
  - Previous and new assignment states
  - Department flags changes
  - User information and timestamps
- **Assignment History**: Adds entries to `assignmentHistory` array with:
  - Complete assignment change history
  - Previous and new assignments
  - Performed by information
  - Department flags changes

#### User Model Updates
- **Assign/Reassign**: Adds cases to `assignedCases` array with assignment details
- **Unassign**: Removes cases from `assignedCases` array for specified department

### Log Structure

#### Case Logs Entry
```json
{
  "action": "assign|reassign|unassign",
  "department": "CadCam|Fitting|Ceramic",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "performedBy": {
    "id": "user_id",
    "name": "User Name"
  },
  "previousState": {
    "departmentFlags": {
      "case_id": {
        "isAssignedCadCam": true,
        "isAssignedFitting": false,
        "isAssignedCeramic": false
      }
    },
    "assignedUsers": [
      {
        "userId": "user_id",
        "userName": "User Name",
        "assignments": [...]
      }
    ]
  },
  "newState": {
    "departmentFlags": {
      "isAssignedCadCam": true
    },
    "assignedUsers": [
      {
        "userId": "new_user_id",
        "userName": "New User Name",
        "assignments": [...]
      }
    ]
  },
  "caseIds": ["case_id_1", "case_id_2"]
}
```

#### Assignment History Entry
```json
{
  "action": "assign|reassign|unassign",
  "department": "CadCam|Fitting|Ceramic",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "performedBy": {
    "id": "user_id",
    "name": "User Name"
  },
  "previousAssignment": [
    {
      "userId": "old_user_id",
      "userName": "Old User Name",
      "assignments": [...]
    }
  ],
  "newAssignment": [
    {
      "userId": "new_user_id",
      "userName": "New User Name",
      "department": "CadCam",
      "assignedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "departmentFlagsChanged": {
    "isAssignedCadCam": true
  }
}
```

### Example Usage

#### 1. Basic Assignment
```bash
curl -X POST http://localhost:3000/api/cases/assign \
  -H "Content-Type: application/json" \
  -d '{
    "caseIds": ["68a4fbe0efb31538773a5016", "68a600d3efb31538773a5943"],
    "assignments": [
      {
        "department": "CadCam",
        "userId": "664a0952bce9fab06c37d529"
      }
    ],
    "assignedBy": "664a2e1c128e34251ee29a10",
    "assignedByName": "Yusef Karzoon",
    "action": "assign"
  }'
```

#### 2. Reassignment (Change User)
```bash
curl -X POST http://localhost:3000/api/cases/assign \
  -H "Content-Type: application/json" \
  -d '{
    "caseIds": ["68a4fbe0efb31538773a5016"],
    "assignments": [
      {
        "department": "CadCam",
        "userId": "664a0952bce9fab06c37d529"
      }
    ],
    "assignedBy": "664a2e1c128e34251ee29a10",
    "assignedByName": "Yusef Karzoon",
    "action": "reassign"
  }'
```

#### 3. Unassignment (Remove Assignment)
```bash
curl -X POST http://localhost:3000/api/cases/assign \
  -H "Content-Type: application/json" \
  -d '{
    "caseIds": ["68a4fbe0efb31538773a5016"],
    "assignments": [
      {
        "department": "CadCam",
        "userId": null
      }
    ],
    "assignedBy": "664a2e1c128e34251ee29a10",
    "assignedByName": "Yusef Karzoon",
    "action": "unassign"
  }'
```
