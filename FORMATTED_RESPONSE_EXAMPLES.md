# Formatted Tracking Response Examples

This document shows examples of the formatted tracking responses from both DHL and UPS with improved date formatting, service information, and remarks.

## DHL Response Example

```json
{
  "success": true,
  "carrier": "DHL",
  "trackingNumber": "1234567890",
  "service": {
    "type": "DHL",
    "code": "express",
    "description": "DHL Express Worldwide",
    "remarks": "Shipment delivered"
  },
  "status": {
    "code": "delivered",
    "description": "Shipment delivered",
    "timestamp": "2026-01-10T14:30:00",
    "formattedDate": "Jan 10, 2026, 02:30 PM",
    "remarks": "Shipment delivered"
  },
  "origin": {
    "address": {
      "countryCode": "AE",
      "addressLocality": "Dubai"
    },
    "serviceArea": {
      "code": "DXB"
    }
  },
  "destination": {
    "address": {
      "countryCode": "AE",
      "addressLocality": "Abu Dhabi"
    },
    "serviceArea": {
      "code": "AUH"
    }
  },
  "estimatedDelivery": {
    "raw": "2026-01-10T15:00:00",
    "formatted": "Jan 10, 2026, 03:00 PM"
  },
  "actualDelivery": {
    "raw": "2026-01-10T14:30:00",
    "formatted": "Jan 10, 2026, 02:30 PM",
    "signedBy": null
  },
  "events": [
    {
      "timestamp": "2026-01-10T14:30:00",
      "formattedDate": "Jan 10, 2026, 02:30 PM",
      "location": {
        "address": {
          "countryCode": "AE",
          "addressLocality": "Abu Dhabi"
        },
        "city": "Abu Dhabi",
        "country": "AE"
      },
      "status": {
        "code": "delivered",
        "description": "Shipment delivered",
        "remarks": "Shipment delivered"
      }
    },
    {
      "timestamp": "2026-01-10T10:15:00",
      "formattedDate": "Jan 10, 2026, 10:15 AM",
      "location": {
        "address": {
          "countryCode": "AE",
          "addressLocality": "Abu Dhabi"
        },
        "city": "Abu Dhabi",
        "country": "AE"
      },
      "status": {
        "code": "transit",
        "description": "Shipment in transit",
        "remarks": "Shipment in transit"
      }
    }
  ],
  "totalEvents": 2
}
```

---

## UPS Response Example

```json
{
  "success": true,
  "carrier": "UPS",
  "trackingNumber": "1Z999AA10123456784",
  "service": {
    "type": "UPS",
    "code": "001",
    "description": "UPS Next Day Air",
    "remarks": "Delivered"
  },
  "status": {
    "code": "011",
    "description": "Delivered",
    "statusType": "D",
    "date": "20260110",
    "time": "143000",
    "formattedDate": "Jan 10, 2026, 02:30 PM",
    "remarks": "Delivered"
  },
  "delivery": {
    "date": "20260110",
    "type": "Actual",
    "formattedDate": "Jan 10, 2026"
  },
  "package": {
    "weight": {
      "unitOfMeasurement": "LBS",
      "weight": "5.00"
    },
    "trackingNumber": "1Z999AA10123456784"
  },
  "shipper": {
    "address": {
      "city": "New York",
      "stateProvince": "NY",
      "country": "US"
    },
    "city": "New York",
    "state": "NY",
    "country": "US"
  },
  "receiver": {
    "address": {
      "city": "Los Angeles",
      "stateProvince": "CA",
      "country": "US"
    },
    "city": "Los Angeles",
    "state": "CA",
    "country": "US"
  },
  "activities": [
    {
      "location": {
        "address": {
          "city": "Los Angeles",
          "stateProvince": "CA",
          "country": "US"
        },
        "city": "Los Angeles",
        "state": "CA",
        "country": "US"
      },
      "status": {
        "code": "011",
        "description": "Delivered",
        "type": "D",
        "remarks": "Delivered"
      },
      "date": "20260110",
      "time": "143000",
      "formattedDate": "Jan 10, 2026, 02:30 PM"
    },
    {
      "location": {
        "address": {
          "city": "Los Angeles",
          "stateProvince": "CA",
          "country": "US"
        },
        "city": "Los Angeles",
        "state": "CA",
        "country": "US"
      },
      "status": {
        "code": "OT",
        "description": "Out for Delivery",
        "type": "I",
        "remarks": "Out for Delivery"
      },
      "date": "20260110",
      "time": "083000",
      "formattedDate": "Jan 10, 2026, 08:30 AM"
    }
  ],
  "totalActivities": 2
}
```

---

## Key Improvements

### 1. Date Formatting
- **DHL**: ISO dates converted to readable format (e.g., "Jan 10, 2026, 02:30 PM")
- **UPS**: YYYYMMDD format converted to readable format (e.g., "Jan 10, 2026")
- Both include `formattedDate` field alongside raw date for flexibility

### 2. Service Information
Both responses now include a `service` object with:
- `type`: Carrier name (DHL or UPS)
- `code`: Service code
- `description`: Human-readable service description
- `remarks`: Current status description

### 3. Remarks/Descriptions
- Added `remarks` field to status objects
- Included in all event/activity entries
- Provides context for each tracking update

### 4. Structured Location Data
- City, state, and country extracted and provided separately
- Easier to display in UI
- Consistent format across both carriers

### 5. Event Counts
- `totalEvents` (DHL) and `totalActivities` (UPS)
- Quick reference for number of tracking updates

---

## Usage in Frontend

```javascript
// Example: Display formatted tracking data
function displayTracking(data) {
  console.log(`Carrier: ${data.carrier}`);
  console.log(`Tracking #: ${data.trackingNumber}`);
  console.log(`Service: ${data.service.description}`);
  console.log(`Status: ${data.status.remarks}`);
  console.log(`Date: ${data.status.formattedDate}`);
  
  // Display events
  data.events?.forEach(event => {
    console.log(`- ${event.formattedDate}: ${event.status.remarks}`);
  });
  
  // Or for UPS
  data.activities?.forEach(activity => {
    console.log(`- ${activity.formattedDate}: ${activity.status.remarks}`);
  });
}
```

---

## Benefits

✅ **User-Friendly Dates** - No need to parse dates in frontend  
✅ **Service Clarity** - Clear indication of carrier and service type  
✅ **Contextual Remarks** - Descriptive status messages  
✅ **Consistent Structure** - Similar format for both carriers  
✅ **Flexible Display** - Both raw and formatted data available  
