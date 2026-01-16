const axios = require('axios');

// UPS API Configuration
const UPS_CONFIG = {
    clientId: process.env.UPS_CLIENT_ID || '3Onqcr67TalrnUVmZThBZGrO8L9n8xgH5RBTwnetl3CE5xyn',
    clientSecret: process.env.UPS_CLIENT_SECRET || 'PPWQJZ3rAGnKJZ81Ai90tDoAMAa5KWgdhVA5Wos3K2NY1FWEJKS7hfQPP7u9jnw1',
    tokenUrl: process.env.UPS_TOKEN_URL || 'https://wwwcie.ups.com/security/v1/oauth/token',
    trackingApiUrl: process.env.UPS_TRACKING_API_URL || 'https://wwwcie.ups.com/api/track/v1/details',
    trackingProductionApiUrl: process.env.UPS_TRACKING_PRODUCTION_API_URL || 'https://onlinetools.ups.com/api/track/v1/details',
    accessLicenseNumber: process.env.UPS_ACCESS_LICENSE_NUMBER || ''
};

// Token cache to avoid unnecessary API calls
let tokenCache = {
    accessToken: null,
    expiresAt: null
};

/**
 * Get UPS OAuth2 Access Token using Client Credentials flow
 * Implements token caching to minimize API calls
 * @returns {Promise<string>} Access token
 */
async function getUPSAccessToken() {
    // Check if we have a valid cached token
    if (tokenCache.accessToken && tokenCache.expiresAt && Date.now() < tokenCache.expiresAt) {
        console.log('Using cached UPS access token');
        return tokenCache.accessToken;
    }

    // Base64 encode the Client ID and Client Secret
    const credentials = Buffer.from(`${UPS_CONFIG.clientId}:${UPS_CONFIG.clientSecret}`).toString('base64');

    try {
        console.log('Fetching new UPS access token...');
        const response = await axios.post(
            UPS_CONFIG.tokenUrl,
            'grant_type=client_credentials',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                }
            }
        );

        const { access_token, expires_in } = response.data;

        // Cache the token with expiration time (subtract 60 seconds for safety margin)
        tokenCache.accessToken = access_token;
        tokenCache.expiresAt = Date.now() + ((expires_in - 60) * 1000);

        console.log('UPS Access Token obtained successfully');
        console.log(`Token expires in: ${expires_in} seconds`);

        return access_token;

    } catch (error) {
        console.error('Error fetching UPS access token:', error.response ? error.response.data : error.message);
        throw new Error('Failed to obtain UPS Access Token: ' + (error.response?.data?.error_description || error.message));
    }
}

/**
 * Track a shipment using UPS Tracking API
 * @param {string} trackingNumber - The UPS tracking number
 * @param {string} locale - Language locale (default: 'en_US')
 * @param {string} returnSignature - Whether to return signature image (default: 'false')
 * @returns {Promise<object>} Tracking information
 */
async function trackShipment(trackingNumber, locale = 'en_US', returnSignature = 'false') {
    if (!trackingNumber) {
        throw new Error('Tracking number is required');
    }

    try {
        // Get access token (will use cached token if available)
        const accessToken = await getUPSAccessToken();

        // Construct the tracking API URL with query parameters
        const trackingUrl = `${UPS_CONFIG.trackingProductionApiUrl}/${trackingNumber}`;

        console.log(`Tracking shipment: ${trackingNumber}`);

        const response = await axios.get(trackingUrl, {
            params: {
                locale: locale,
                returnSignature: returnSignature
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'transId': `track-${Date.now()}`, // Unique transaction ID
                'transactionSrc': 'ArakBackend'
            }
        });

        console.log('Tracking data retrieved successfully');
        return formatTrackingResponse(response.data);

    } catch (error) {
        console.error('Error tracking shipment:', error.response ? error.response.data : error.message);

        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (status === 404) {
                throw new Error('Tracking number not found');
            } else if (status === 401) {
                // Token might be invalid, clear cache and retry once
                tokenCache.accessToken = null;
                tokenCache.expiresAt = null;
                throw new Error('Authentication failed. Please try again.');
            } else {
                throw new Error(errorData.response?.errors?.[0]?.message || 'Failed to track shipment');
            }
        }

        throw new Error('Failed to connect to UPS tracking service');
    }
}

/**
 * Format date from UPS format (YYYYMMDD) to readable format
 * @param {string} dateString - UPS date string
 * @param {string} timeString - UPS time string (optional)
 * @returns {string} Formatted date
 */
function formatUPSDate(dateString, timeString = null) {
    if (!dateString) return null;

    try {
        // UPS date format: YYYYMMDD
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);

        let dateTimeString = `${year}-${month}-${day}`;

        // UPS time format: HHMMSS
        if (timeString && timeString.length >= 4) {
            const hour = timeString.substring(0, 2);
            const minute = timeString.substring(2, 4);
            dateTimeString += `T${hour}:${minute}:00`;
        }

        const date = new Date(dateTimeString);

        if (timeString) {
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    } catch (error) {
        return dateString;
    }
}

/**
 * Format the UPS tracking response to a more user-friendly structure
 * @param {object} data - Raw UPS API response
 * @returns {object} Formatted tracking data
 */
function formatTrackingResponse(data) {
    try {
        const trackResponse = data.trackResponse;
        const shipment = trackResponse?.shipment?.[0];

        if (!shipment) {
            return {
                success: false,
                message: 'No tracking information available'
            };
        }

        const pkg = shipment.package?.[0];
        const currentStatus = pkg?.currentStatus;
        const deliveryDate = pkg?.deliveryDate?.[0];
        const activity = pkg?.activity || [];
        const latestActivity = activity.length > 0 ? activity[0] : null;

        return {
            success: true,
            carrier: 'UPS',
            trackingNumber: shipment.inquiryNumber,
            service: {
                type: 'UPS',
                code: shipment.service?.code,
                description: shipment.service?.description || 'UPS Service',
                remarks: currentStatus?.description || 'Tracking information available'
            },
            status: {
                code: currentStatus?.code,
                description: currentStatus?.description,
                statusType: currentStatus?.type,
                date: latestActivity?.date,
                time: latestActivity?.time,
                formattedDate: formatUPSDate(latestActivity?.date, latestActivity?.time),
                remarks: currentStatus?.description
            },
            delivery: {
                date: deliveryDate?.date,
                type: deliveryDate?.type,
                formattedDate: formatUPSDate(deliveryDate?.date)
            },
            package: {
                weight: pkg?.packageWeight,
                dimensions: pkg?.dimensions,
                trackingNumber: pkg?.trackingNumber
            },
            shipper: {
                address: shipment.shipper?.address,
                city: shipment.shipper?.address?.city,
                state: shipment.shipper?.address?.stateProvince,
                country: shipment.shipper?.address?.country
            },
            receiver: {
                address: shipment.shipTo?.address,
                city: shipment.shipTo?.address?.city,
                state: shipment.shipTo?.address?.stateProvince,
                country: shipment.shipTo?.address?.country
            },
            activities: activity.map(act => ({
                location: {
                    address: act.location?.address,
                    city: act.location?.address?.city,
                    state: act.location?.address?.stateProvince,
                    country: act.location?.address?.country
                },
                status: {
                    code: act.status?.code,
                    description: act.status?.description,
                    type: act.status?.type,
                    remarks: act.status?.description
                },
                date: act.date,
                time: act.time,
                formattedDate: formatUPSDate(act.date, act.time)
            })),
            totalActivities: activity.length
        };

    } catch (error) {
        console.error('Error formatting tracking response:', error);
        return {
            success: false,
            message: 'Error formatting tracking data',
            rawData: data
        };
    }
}

/**
 * Clear the token cache (useful for testing or forcing token refresh)
 */
function clearTokenCache() {
    tokenCache.accessToken = null;
    tokenCache.expiresAt = null;
    console.log('UPS token cache cleared');
}

module.exports = {
    getUPSAccessToken,
    trackShipment,
    clearTokenCache
};
