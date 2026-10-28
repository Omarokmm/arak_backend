const Shipment = require("../models/ShipmentModel");
const responsesStatus = require("../enum/responsesStatus");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const upsService = require("../services/upsService");
const dhlService = require("../services/dhlService");

// Get All Shipments
const getAllShipments = async (req, res) => {
  try {
    // Date 4 months ago
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const shipments = await Shipment.find({
      createdAt: { $gte: fourMonthsAgo }
    }).sort({ createdAt: -1 });

    // Format shipments with enhanced data
    const formattedShipments = shipments.map(shipment => {
      const shipmentObj = shipment.toObject();

      // Format estimated delivery date
      if (shipmentObj.estimatedDeliveryDate) {
        const date = new Date(shipmentObj.estimatedDeliveryDate);
        shipmentObj.formattedEstimatedDeliveryDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // Format sent date
      if (shipmentObj.sentDate) {
        const date = new Date(shipmentObj.sentDate);
        shipmentObj.formattedSentDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // Format delivery date if exists
      if (shipmentObj.deliveryDate) {
        const date = new Date(shipmentObj.deliveryDate);
        shipmentObj.formattedDeliveryDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }

      // Add status color indicator for frontend
      // Hold status gets danger color, others get appropriate colors
      const statusLower = (shipmentObj.status || '').toLowerCase();
      if (statusLower.includes('hold')) {
        shipmentObj.statusColor = 'danger'; // Red/danger color for hold
        shipmentObj.statusPriority = 'high';
      } else if (statusLower.includes('delivered')) {
        shipmentObj.statusColor = 'success'; // Green for delivered
        shipmentObj.statusPriority = 'low';
      } else if (statusLower.includes('on the way') || statusLower.includes('transit')) {
        shipmentObj.statusColor = 'info'; // Blue for in transit
        shipmentObj.statusPriority = 'medium';
      } else {
        shipmentObj.statusColor = 'default'; // Default color
        shipmentObj.statusPriority = 'medium';
      }

      return shipmentObj;
    });

    res.status(responsesStatus.OK).json(formattedShipments);
  } catch (error) {
    res.status(responsesStatus.NotFound).json({ error: "Not Found" });
  }
};


// Get shipment By Id
const getShipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffShipment = await Shipment.findById(id);
    if (!buffShipment) {
      res.status(responsesStatus.NotFound).json({ error: "No Such Shipment!" });
    }
    res.status(responsesStatus.OK).json(buffShipment);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Create new shipment
const createShipment = async (req, res) => {
  const {
    courierCompany,
    shippingName,
    trackingNumber,
    shipmentType,
    sentDate,
    estimatedDeliveryDate,
    deliveryDate,
    dentistObj,
    status,
    casesIds,
    remarks,
    notes,
    logs,
  } = req.body;
  // add shipment to db
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: "Error",
        errors: errors.array(),
      });
    }
    const isExistShipment = await Shipment.findOne({ trackingNumber })
    if (isExistShipment) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        msg: "TrackingNumber is Exist",
      });
    }
    const newShipment = await Shipment.create({
      courierCompany,
      shippingName,
      trackingNumber,
      shipmentType,
      sentDate,
      estimatedDeliveryDate,
      deliveryDate,
      dentistObj,
      status,
      casesIds,
      remarks,
      notes,
      logs,
    });
    res.status(responsesStatus.OK).json({
      success: true,
      msg: "Added Shipment Successfully",
      data: newShipment,
    });
  } catch (error) {
    return res
      .status(responsesStatus.BadRequest)
      .json({ error: error.message });
  }
};
// Delete shipment
const deleteShipment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffShipment = await Shipment.findByIdAndDelete({ _id: id });
    if (!buffShipment) {
      return res
        .status(responsesStatus.NotFound)
        .json({ error: "No Such Shipment!" });
    }
    res.status(responsesStatus.OK).json(buffShipment);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};
// Update shipment
const updateShipment = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(responsesStatus.NotFound).json({ error: "Invalid ID" });
    }
    const buffShipment = await Shipment.findByIdAndUpdate({ _id: id }, { ...req.body });
    if (!buffShipment) {
      return res
        .status(responsesStatus.BadRequest)
        .json({ error: "Not Found!" });
    }
    res.status(responsesStatus.OK).json(buffShipment);
  } catch (error) {
    res.status(responsesStatus.BadRequest).json({ error: error.message });
  }
};

// Track shipment with UPS
const trackShipmentWithUPS = async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    if (!trackingNumber) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        error: "Tracking number is required"
      });
    }

    // Optional query parameters
    const locale = req.query.locale || 'en_US';
    const returnSignature = req.query.returnSignature || 'false';

    console.log(`Tracking UPS shipment: ${trackingNumber}`);

    // Call UPS service to get tracking information
    const trackingData = await upsService.trackShipment(trackingNumber, locale, returnSignature);

    res.status(responsesStatus.OK).json({
      success: true,
      data: trackingData
    });

  } catch (error) {
    console.error('Error in trackShipmentWithUPS:', error.message);

    // Determine appropriate status code based on error
    let statusCode = responsesStatus.BadRequest;
    if (error.message.includes('not found')) {
      statusCode = responsesStatus.NotFound;
    } else if (error.message.includes('Authentication failed')) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

// Track shipment with multiple carriers (DHL or UPS)
const trackShipment = async (req, res) => {
  const { trackingNumber, carrier } = req.params;

  try {
    if (!trackingNumber) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        error: "Tracking number is required"
      });
    }

    if (!carrier) {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        error: "Carrier is required (DHL or UPS)"
      });
    }

    // Normalize carrier name to uppercase
    const carrierName = carrier.toUpperCase();

    console.log(`Tracking ${carrierName} shipment: ${trackingNumber}`);

    let trackingData;

    // Route to appropriate carrier service
    if (carrierName === 'UPS') {
      // Optional query parameters for UPS
      const locale = req.query.locale || 'en_US';
      const returnSignature = req.query.returnSignature || 'false';

      trackingData = await upsService.trackShipment(trackingNumber, locale, returnSignature);

    } else if (carrierName === 'DHL') {
      // Optional query parameters for DHL
      const service = req.query.service || null;
      const requesterCountryCode = req.query.requesterCountryCode || null;
      const originCountryCode = req.query.originCountryCode || null;

      trackingData = await dhlService.trackShipment(
        trackingNumber,
        service,
        requesterCountryCode,
        originCountryCode
      );

    } else {
      return res.status(responsesStatus.BadRequest).json({
        success: false,
        error: `Unsupported carrier: ${carrier}. Supported carriers are: DHL, UPS`
      });
    }

    res.status(responsesStatus.OK).json({
      success: true,
      carrier: carrierName,
      data: trackingData
    });

  } catch (error) {
    console.error(`Error in trackShipment (${carrier}):`, error.message);

    // Determine appropriate status code based on error
    let statusCode = responsesStatus.BadRequest;
    if (error.message.includes('not found')) {
      statusCode = responsesStatus.NotFound;
    } else if (error.message.includes('Authentication failed') || error.message.includes('Invalid DHL API key')) {
      statusCode = 401;
    }

    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllShipments,
  getShipmentById,
  createShipment,
  deleteShipment,
  updateShipment,
  trackShipmentWithUPS,
  trackShipment,
};
