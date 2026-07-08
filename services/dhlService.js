const axios = require('axios');

// DHL API Configuration
const DHL_CONFIG = {
    apiKey: process.env.DHL_API_KEY || 'ZhrPkhw6CVplFaJMZYJA1Azy4LwLF7pR',
    apiSecret: process.env.DHL_API_SECRET || 'oZwrZ23eGcHOCjZI',
    trackingApiUrl: process.env.DHL_TRACKING_API_URL || 'https://api-eu.dhl.com/track/shipments'
};

/**
 * Track a shipment using DHL Tracking API
 * @param {string} trackingNumber - The DHL tracking number
 * @param {string} service - Service type (optional)
 * @param {string} requesterCountryCode - Requester country code (optional)
 * @param {string} originCountryCode - Origin country code (optional)
 * @returns {Promise<object>} Tracking information
 */
async function trackShipment(trackingNumber, service = null, requesterCountryCode = null, originCountryCode = null) {
    if (!trackingNumber) {
        throw new Error('Tracking number is required');
    }

    try {
        console.log(`Tracking DHL shipment: ${trackingNumber}`);

        // Build query parameters
        const params = {
            trackingNumber: trackingNumber
        };

        // Add optional parameters if provided
        if (service) params.service = service;
        if (requesterCountryCode) params.requesterCountryCode = requesterCountryCode;
        if (originCountryCode) params.originCountryCode = originCountryCode;

        const response = await axios.get(DHL_CONFIG.trackingApiUrl, {
            params: params,
            headers: {
                'DHL-API-Key': DHL_CONFIG.apiKey
            }
        });

        console.log('DHL tracking data retrieved successfully');
        return formatTrackingResponse(response.data);

    } catch (error) {
        console.error('Error tracking DHL shipment:', error.response ? error.response.data : error.message);

        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (status === 404) {
                throw new Error('Tracking number not found');
            } else if (status === 401 || status === 403) {
                throw new Error('Authentication failed. Invalid DHL API key.');
            } else if (status === 400) {
                throw new Error(errorData.detail || 'Invalid tracking request');
            } else {
                throw new Error(errorData.detail || 'Failed to track shipment');
            }
        }

        throw new Error('Failed to connect to DHL tracking service');
    }
}

/**
 * Format date to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return null;

    try {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        return dateString;
    }
}

/**
 * Format the DHL tracking response to a more user-friendly structure
 * @param {object} data - Raw DHL API response
 * @returns {object} Formatted tracking data
 */
function formatTrackingResponse(data) {
    try {
        const shipments = data.shipments;

        if (!shipments || shipments.length === 0) {
            return {
                success: false,
                message: 'No tracking information available'
            };
        }

        const shipment = shipments[0];
        const events = shipment.events || [];
        const latestEvent = events.length > 0 ? events[0] : null;

        return {
            success: true,
            carrier: 'DHL',
            trackingNumber: shipment.id,
            service: {
                type: 'DHL',
                code: shipment.service || 'DHL Express',
                description: shipment.details?.product?.productName || 'DHL Express Worldwide',
                remarks: latestEvent?.description || 'Tracking information available'
            },
            status: {
                code: latestEvent?.statusCode,
                description: latestEvent?.description,
                timestamp: latestEvent?.timestamp,
                formattedDate: formatDate(latestEvent?.timestamp),
                remarks: latestEvent?.description
            },
            origin: {
                address: shipment.origin?.address,
                serviceArea: shipment.origin?.serviceArea
            },
            destination: {
                address: shipment.destination?.address,
                serviceArea: shipment.destination?.serviceArea
            },
            estimatedDelivery: {
                raw: shipment.estimatedTimeOfDelivery,
                formatted: formatDate(shipment.estimatedTimeOfDelivery)
            },
            actualDelivery: {
                raw: shipment.details?.proofOfDelivery?.timestamp,
                formatted: formatDate(shipment.details?.proofOfDelivery?.timestamp),
                signedBy: shipment.details?.proofOfDelivery?.signatureUrl ? 'Signature available' : null
            },
            events: events.map(event => ({
                timestamp: event.timestamp,
                formattedDate: formatDate(event.timestamp),
                location: {
                    address: event.location?.address,
                    city: event.location?.address?.addressLocality,
                    country: event.location?.address?.countryCode
                },
                status: {
                    code: event.statusCode,
                    description: event.description,
                    remarks: event.description
                }
            })),
            totalEvents: events.length
        };

    } catch (error) {
        console.error('Error formatting DHL tracking response:', error);
        return {
            success: false,
            message: 'Error formatting tracking data',
            rawData: data
        };
    }
}

module.exports = {
    trackShipment,
    formatTrackingResponse
};
