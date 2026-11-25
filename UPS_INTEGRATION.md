# UPS Tracking Integration Documentation

## Overview

This document describes the UPS tracking integration implemented in the Arak Backend system. The integration uses OAuth2 Client Credentials flow for authentication and the UPS Tracking API to retrieve shipment tracking information.

## Features

- ✅ OAuth2 authentication with token caching
- ✅ UPS Tracking API integration
- ✅ Automatic token refresh
- ✅ Comprehensive error handling
- ✅ Formatted tracking response

## API Endpoint

### Track Shipment with UPS

**Endpoint:** `GET /api/shipments/track/ups/:trackingNumber`

**Description:** Retrieves tracking information for a UPS shipment using the tracking number.

**Parameters:**
- `trackingNumber` (path parameter, required): The UPS tracking number to track
- `locale` (query parameter, optional): Language locale (default: `en_US`)
- `returnSignature` (query parameter, optional): Whether to return signature image (default: `false`)

**Example Request:**
```bash
GET http://localhost:3000/api/shipments/track/ups/1Z999AA10123456784
```

**Example Request with Query Parameters:**
```bash
GET http://localhost:3000/api/shipments/track/ups/1Z999AA10123456784?locale=en_US&returnSignature=false
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "trackingNumber": "1Z999AA10123456784",
    "status": {
      "code": "011",
      "description": "Delivered",
      "statusType": "D"
    },
    "delivery": {
      "date": "20240115",
      "type": "Actual"
    },
    "package": {
      "weight": {
        "unitOfMeasurement": "LBS",
        "weight": "5.00"
      },
      "trackingNumber": "1Z999AA10123456784"
    },
    "service": {
      "code": "001",
      "description": "UPS Next Day Air"
    },
    "shipper": {
      "address": {
        "city": "New York",
        "stateProvince": "NY",
        "countryCode": "US"
      }
    },
    "receiver": {
      "address": {
        "city": "Los Angeles",
        "stateProvince": "CA",
        "countryCode": "US"
      }
    },
    "activities": [
      {
        "location": {
          "city": "Los Angeles",
          "stateProvince": "CA",
          "countryCode": "US"
        },
        "status": {
          "code": "011",
          "description": "Delivered",
          "type": "D"
        },
        "date": "20240115",
        "time": "143000"
      }
    ]
  }
}
```

**Error Responses:**

**400 Bad Request** - Missing or invalid tracking number:
```json
{
  "success": false,
  "error": "Tracking number is required"
}
```

**404 Not Found** - Tracking number not found:
```json
{
  "success": false,
  "error": "Tracking number not found"
}
```

**401 Unauthorized** - Authentication failed:
```json
{
  "success": false,
  "error": "Authentication failed. Please try again."
}
```

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
# UPS OAuth2 Client Credentials
UPS_CLIENT_ID=your_client_id_here
UPS_CLIENT_SECRET=your_client_secret_here

# UPS API URLs (CIE for testing)
UPS_TOKEN_URL=https://wwwcie.ups.com/security/v1/oauth/token
UPS_TRACKING_API_URL=https://wwwcie.ups.com/api/track/v1/details

# Optional: UPS Access License Number
UPS_ACCESS_LICENSE_NUMBER=your_license_number_here
```

**For Production:** Update the URLs to:
```env
UPS_TOKEN_URL=https://onlinetools.ups.com/security/v1/oauth/token
UPS_TRACKING_API_URL=https://onlinetools.ups.com/api/track/v1/details
```

### Getting UPS Credentials

1. Go to [UPS Developer Portal](https://developer.ups.com/)
2. Create an account or sign in
3. Create a new application
4. Get your Client ID and Client Secret from the application dashboard
5. Copy the credentials to your `.env` file

## Architecture

### Files Modified/Created

1. **`services/upsService.js`** (NEW)
   - OAuth2 token management with caching
   - UPS Tracking API integration
   - Response formatting

2. **`controllers/ShipmentController.js`** (MODIFIED)
   - Added `trackShipmentWithUPS` function
   - Integrated with UPS service

3. **`routes/shipmentRoutes.js`** (MODIFIED)
   - Added route: `GET /track/ups/:trackingNumber`

4. **`.env.example`** (NEW)
   - Environment variable template

## Token Management

The implementation includes intelligent token caching:

- Tokens are cached in memory after first retrieval
- Cached tokens are reused until expiration
- Automatic refresh when token expires
- 60-second safety margin before expiration

This minimizes API calls and improves performance.

## Error Handling

The integration handles various error scenarios:

- **Missing tracking number**: Returns 400 Bad Request
- **Invalid tracking number**: Returns 404 Not Found
- **Authentication failures**: Returns 401 Unauthorized
- **Network errors**: Returns 400 Bad Request with error message
- **API errors**: Logs detailed error information

## Testing

### Using cURL

```bash
# Basic tracking request
curl http://localhost:3000/api/shipments/track/ups/1Z999AA10123456784

# With query parameters
curl "http://localhost:3000/api/shipments/track/ups/1Z999AA10123456784?locale=en_US&returnSignature=false"
```

### Using Postman

1. Create a new GET request
2. URL: `http://localhost:3000/api/shipments/track/ups/1Z999AA10123456784`
3. Send the request
4. View the formatted tracking response

### Test Tracking Numbers (UPS CIE Environment)

UPS provides test tracking numbers for the CIE environment. Check the [UPS Developer Portal](https://developer.ups.com/) for valid test tracking numbers.

## Troubleshooting

### "Failed to obtain UPS Access Token"

- Verify `UPS_CLIENT_ID` and `UPS_CLIENT_SECRET` are correct
- Check that you're using the correct `UPS_TOKEN_URL` for your environment
- Ensure your UPS Developer account is active

### "Tracking number not found"

- Verify the tracking number is valid
- Ensure you're using the correct environment (CIE vs Production)
- Check that the tracking number exists in the UPS system

### "Authentication failed"

- Token may have been invalidated
- Try clearing the token cache (restart the server)
- Verify credentials are still valid in UPS Developer Portal

## Future Enhancements

Potential improvements for the integration:

1. **Database Token Storage**: Store tokens in database for multi-instance deployments
2. **Webhook Integration**: Receive real-time tracking updates from UPS
3. **Batch Tracking**: Track multiple shipments in a single request
4. **Shipment Creation**: Integrate UPS Shipping API to create shipments
5. **Rate Calculation**: Add UPS Rating API for shipping cost estimates
6. **Address Validation**: Integrate UPS Address Validation API

## Support

For UPS API documentation and support:
- [UPS Developer Portal](https://developer.ups.com/)
- [UPS API Documentation](https://developer.ups.com/api/reference)
- [UPS API Support](https://developer.ups.com/support)
