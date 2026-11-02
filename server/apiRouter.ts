import express from 'express';
import { sensorStore } from './sensorStore';
import { handleCityPulseChat } from './geminiService';

export const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(express.text({ type: ['text/plain', 'application/x-www-form-urlencoded'] }));

// Health check
apiRouter.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    project: 'ECOSPHERE – Smart City Solutions',
    school: 'Blossoms Convent School',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    deviceAuthEnabled: Boolean(process.env.DEVICE_API_KEY)
  });
});

/**
 * Requirement 1: POST /api/sensor-data
 * Secure server-side endpoint to receive JSON readings from the NodeMCU ESP8266.
 * Supports optional device authentication via x-api-key or Authorization Bearer header.
 */
apiRouter.post('/sensor-data', (req, res) => {
  try {
    // Optional device authentication
    const expectedSecret = process.env.DEVICE_API_KEY;
    if (expectedSecret && expectedSecret.trim().length > 0) {
      const providedHeader = req.headers['x-api-key'] || req.headers['authorization'] || '';
      const token = typeof providedHeader === 'string' && providedHeader.startsWith('Bearer ')
        ? providedHeader.slice(7).trim()
        : providedHeader.toString().trim();

      if (token !== expectedSecret.trim()) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized: Invalid device authentication secret.'
        });
      }
    }

    let payload: Record<string, any> = {};

    if (typeof req.body === 'string') {
      try {
        payload = JSON.parse(req.body);
      } catch {
        // Raw serial string fallback (e.g., "WASTE,1,...")
        payload = { packet: req.body };
      }
    } else if (req.body && typeof req.body === 'object') {
      payload = req.body;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid body: Expected JSON object with sensor readings or "packet" string.'
      });
    }

    const result = sensorStore.ingestJsonReading(payload, 'NODEMCU');

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      subsystem: result.subsystem,
      subsystemStatus: sensorStore.getUnifiedTelemetry().subsystemStatus,
      latest: sensorStore.getLatestReadings()
    });
  } catch (err: unknown) {
    console.error('Error in /api/sensor-data:', err);
    res.status(500).json({ success: false, error: 'Internal server error processing sensor data', details: String(err) });
  }
});

/**
 * Requirement 2: GET /api/latest
 * Returns the latest sensor readings and individual online/offline status for waste, irrigation, and air quality.
 */
apiRouter.get('/latest', (_req, res) => {
  try {
    const latest = sensorStore.getLatestReadings();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(latest);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve latest telemetry readings', details: String(err) });
  }
});

// Backward-compatible alias for existing frontend dashboard
apiRouter.get('/sensors/telemetry', (_req, res) => {
  try {
    const telemetry = sensorStore.getUnifiedTelemetry();
    res.json(telemetry);
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve telemetry', details: String(err) });
  }
});

// Backward-compatible alias for existing raw serial packet endpoint
apiRouter.post('/sensors/packet', (req, res) => {
  try {
    let packetStr = '';

    if (typeof req.body === 'string') {
      packetStr = req.body;
    } else if (req.body && typeof req.body.packet === 'string') {
      packetStr = req.body.packet;
    } else if (req.body && req.body.raw) {
      packetStr = req.body.raw;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. Expected raw string or JSON { packet: "HEADER,1,..." }'
      });
    }

    const source = (req.headers['x-source'] === 'SIMULATOR' || req.query.source === 'simulator')
      ? 'SIMULATOR'
      : 'NODEMCU';

    const result = sensorStore.ingestRawPacket(packetStr, source);
    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json({
      success: true,
      message: result.message,
      telemetry: sensorStore.getUnifiedTelemetry()
    });
  } catch (err: unknown) {
    res.status(500).json({ success: false, error: 'Packet processing error', details: String(err) });
  }
});

// Simulate predefined conditions
apiRouter.post('/sensors/simulate', (req, res) => {
  try {
    const scenario = req.body?.scenario;
    if (!['nominal', 'dry_soil', 'bin_full', 'air_spike', 'disconnect', 'reset'].includes(scenario)) {
      return res.status(400).json({ error: 'Invalid scenario. Choose: nominal, dry_soil, bin_full, air_spike, disconnect, reset' });
    }
    sensorStore.runScenario(scenario);
    res.json({
      success: true,
      scenario,
      telemetry: sensorStore.getUnifiedTelemetry()
    });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Scenario execution failed', details: String(err) });
  }
});

// Update soil moisture threshold
apiRouter.post('/sensors/threshold', (req, res) => {
  try {
    const threshold = parseInt(req.body?.threshold, 10);
    if (isNaN(threshold) || threshold < 5 || threshold > 95) {
      return res.status(400).json({ error: 'Threshold must be a percentage between 5 and 95' });
    }
    sensorStore.setMoistureThreshold(threshold);
    res.json({
      success: true,
      threshold,
      telemetry: sensorStore.getUnifiedTelemetry()
    });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update threshold', details: String(err) });
  }
});

// CityPulse AI chat endpoint
apiRouter.post('/chat', async (req, res) => {
  try {
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Expected messages array in request body' });
    }

    const aiResponse = await handleCityPulseChat(messages);
    res.json(aiResponse);
  } catch (err: unknown) {
    res.status(500).json({
      error: 'CityPulse AI query failure',
      details: String(err)
    });
  }
});
