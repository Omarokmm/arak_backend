# Multi-Carrier Tracking Integration Documentation

## Overview

This document describes the multi-carrier tracking integration implemented in the Arak Backend system. The integration supports both **DHL** and **UPS** tracking through a unified API endpoint with carrier parameter selection.

## Supported Carriers

- ✅ **DHL** - DHL Express tracking via DHL API
- ✅ **UPS** - UPS tracking via OAuth2 and UPS Tracking API

## API Endpoints

### 1. Unified Multi-Carrier Tracking (Recommended)

**Endpoint:** `GET /api/shipments/track/:carrier/:trackingNumber`

**Description:** Track shipments from multiple carriers using a single endpoint.

**Parameters:**
- `carrier` (path parameter, required): Carrier name - `DHL` or `UPS` (case-insensitive)
- `trackingNumber` (path parameter, required): The tracking number to track

**Query Parameters:**

For **UPS**:
- `locale` (optional): Language locale (default: `en_US`)
- `returnSignature` (optional): Whether to return signature image (default: `false`)

For **DHL**:
- `service` (optional): Service type
- `requesterCountryCode` (optional): Requester country code
- `originCountryCode` (optional): Origin country code

---

### 2. Legacy UPS-Only Endpoint

**Endpoint:** `GET /api/shipments/track/ups/:trackingNumber`

**Description:** Track UPS shipments only (maintained for backward compatibility).

---

## Usage Examples

### Track DHL Shipment

```bash
GET http://localhost:5000/api/shipments/track/DHL/1234567890
```

**Example with cURL:**
```bash
curl http://localhost:5000/api/shipments/track/DHL/1234567890
```

**Example Response:**
```json
{
  "success": true,
  "carrier": "DHL",
  "data": {
    "shipments": [
      {
        "id": "1234567890",
        "service": "express",
        "origin": {
          "address": {
            "addressLocality": "Dubai"
          }
        },
        "destination": {
          "address": {
            "addressLocality": "Abu Dhabi"
          }
        },
        "status": {
          "timestamp": "2024-01-10T14:30:00",
          "statusCode": "delivered",
          "description": "Shipment delivered"
        },
        "events": [...]
      }
    ]
  }
}
```

---

### Track UPS Shipment

```bash
GET http://localhost:5000/api/shipments/track/UPS/1Z999AA10123456784
```

**Example with cURL:**
```bash
curl http://localhost:5000/api/shipments/track/UPS/1Z999AA10123456784
```

**Example Response:**
```json
{
  "success": true,
  "carrier": "UPS",
  "data": {
    "trackResponse": {
      "shipment": [
        {
          "inquiryNumber": "1Z999AA10123456784",
          "package": [...],
          "currentStatus": {
            "code": "011",
            "description": "Delivered"
          }
        }
      ]
    }
  }
}
```

---

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
# UPS Configuration
UPS_CLIENT_ID=3Onqcr67TalrnUVmZThBZGrO8L9n8xgH5RBTwnetl3CE5xyn
UPS_CLIENT_SECRET=PPWQJZ3rAGnKJZ81Ai90tDoAMAa5KWgdhVA5Wos3K2NY1FWEJKS7hfQPP7u9jnw1
UPS_TOKEN_URL=https://wwwcie.ups.com/security/v1/oauth/token
UPS_TRACKING_API_URL=https://wwwcie.ups.com/api/track/v1/details
UPS_TRACKING_PRODUCTION_API_URL=https://onlinetools.ups.com/api/track/v1/details

# DHL Configuration
DHL_API_KEY=ZhrPkhw6CVplFaJMZYJA1Azy4LwLF7pR
DHL_API_SECRET=oZwrZ23eGcHOCjZI
DHL_TRACKING_API_URL=https://api-eu.dhl.com/track/shipments
```

---

## Error Responses

### Missing Tracking Number
```json
{
  "success": false,
  "error": "Tracking number is required"
}
```

### Missing Carrier
```json
{
  "success": false,
  "error": "Carrier is required (DHL or UPS)"
}
```

### Unsupported Carrier
```json
{
  "success": false,
  "error": "Unsupported carrier: FEDEX. Supported carriers are: DHL, UPS"
}
```

### Tracking Number Not Found
```json
{
  "success": false,
  "error": "Tracking number not found"
}
```

### Authentication Failed
```json
{
  "success": false,
  "error": "Authentication failed. Invalid DHL API key."
}
```

---

## Architecture

### Files Created/Modified

**New Files:**
1. **`services/dhlService.js`** - DHL API integration
2. **`services/upsService.js`** - UPS API integration with OAuth2

**Modified Files:**
1. **`controllers/ShipmentController.js`**
   - Added `trackShipment()` - Unified multi-carrier tracking
   - Kept `trackShipmentWithUPS()` - Legacy UPS-only endpoint

2. **`routes/shipmentRoutes.js`**
   - Added `GET /track/:carrier/:trackingNumber` - New unified endpoint
   - Kept `GET /track/ups/:trackingNumber` - Legacy endpoint

3. **`.env.example`** - Added DHL credentials

---

## Carrier-Specific Details

### DHL Integration

**Authentication:** API Key-based (simpler than OAuth2)

**API Documentation:** [DHL Developer Portal](https://developer.dhl.com/)

**Features:**
- Real-time tracking status
- Event history
- Estimated delivery time
- Proof of delivery

**Query Parameters:**
- `service`: Filter by service type
- `requesterCountryCode`: Country code of requester
- `originCountryCode`: Origin country code

---

### UPS Integration

**Authentication:** OAuth2 Client Credentials flow with token caching

**API Documentation:** [UPS Developer Portal](https://developer.ups.com/)

**Features:**
- OAuth2 token caching (minimizes API calls)
- Automatic token refresh
- Detailed package information
- Signature retrieval option

**Query Parameters:**
- `locale`: Language preference (e.g., `en_US`, `es_ES`)
- `returnSignature`: Return signature image (`true`/`false`)

---

## Testing

### Test DHL Tracking

```bash
# Using cURL
curl http://localhost:5000/api/shipments/track/DHL/YOUR_DHL_TRACKING_NUMBER

# Using the test script
node test_tracking.js DHL YOUR_DHL_TRACKING_NUMBER
```

### Test UPS Tracking

```bash
# Using cURL
curl http://localhost:5000/api/shipments/track/UPS/YOUR_UPS_TRACKING_NUMBER

# Using the test script
node test_tracking.js UPS YOUR_UPS_TRACKING_NUMBER
```

---

## Integration with Frontend

### Example: React/JavaScript

```javascript
async function trackShipment(carrier, trackingNumber) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/shipments/track/${carrier}/${trackingNumber}`
    );
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Tracking data:', data.data);
      return data.data;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

// Usage
trackShipment('DHL', '1234567890');
trackShipment('UPS', '1Z999AA10123456784');
```

---

## Future Enhancements

Potential improvements:

1. **Add More Carriers**
   - FedEx
   - USPS
   - Aramex

2. **Webhook Support**
   - Real-time tracking updates
   - Delivery notifications

3. **Database Integration**
   - Store tracking history
   - Cache tracking results

4. **Batch Tracking**
   - Track multiple shipments in one request

5. **Rate Limiting**
   - Implement API rate limiting
   - Queue management for high volume

---

## Troubleshooting

### DHL Errors

**"Invalid DHL API key"**
- Verify `DHL_API_KEY` in `.env` file
- Check API key is active in DHL Developer Portal

**"Tracking number not found"**
- Verify tracking number format
- Ensure shipment exists in DHL system

### UPS Errors

**"Failed to obtain UPS Access Token"**
- Verify `UPS_CLIENT_ID` and `UPS_CLIENT_SECRET`
- Check credentials are valid in UPS Developer Portal

**"Authentication failed"**
- Token may be invalid
- Restart server to clear token cache

---

## Support Resources

- **DHL Developer Portal:** https://developer.dhl.com/
- **UPS Developer Portal:** https://developer.ups.com/
- **DHL API Documentation:** https://developer.dhl.com/api-reference/shipment-tracking
- **UPS API Documentation:** https://developer.ups.com/api/reference/tracking
