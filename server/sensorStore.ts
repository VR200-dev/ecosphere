import type {
  UnifiedTelemetry,
  WasteTelemetry,
  IrrigationTelemetry,
  AirTelemetry,
  SystemAlert,
  PacketLogEntry,
  AirPollutionLevel,
  WasteCategory,
  WasteBinStatus,
  SubsystemOnlineStatus
} from '../src/types/telemetry';

class SensorStore {
  private mode: 'HARDWARE' | 'SIMULATOR' = 'SIMULATOR';
  private lastHardwarePacketTime: number = 0;
  private isHardwareConnected: boolean = false;

  private lastWasteTime: number = 0;
  private lastIrrigationTime: number = 0;
  private lastAirTime: number = 0;

  private waste: WasteTelemetry = {
    dryCount: 38,
    organicCount: 52,
    totalCount: 90,
    lastCategory: 'ORGANIC',
    binStatus: 'NORMAL',
    irStatus: 'CLEAR',
    systemStatus: 'ONLINE',
    lastUpdated: new Date().toISOString()
  };

  private irrigation: IrrigationTelemetry = {
    rawSensor: 580,
    moisturePercent: 46,
    pumpStatus: 'OFF',
    thresholdPercent: 35,
    lastUpdated: new Date().toISOString()
  };

  private air: AirTelemetry = {
    pollutionRaw: 145,
    tempCelsius: 26.4,
    humidityPercent: 58,
    pollutionLevel: 'LOW',
    lastUpdated: new Date().toISOString()
  };

  private alerts: SystemAlert[] = [
    {
      id: 'alert-init',
      timestamp: new Date().toISOString(),
      level: 'info',
      subsystem: 'SYSTEM',
      message: 'ECOSPHERE central telemetry initialized. Ready for NodeMCU live hardware stream.'
    }
  ];

  private recentPackets: PacketLogEntry[] = [
    {
      id: 'pkt-1',
      timestamp: new Date().toISOString(),
      subsystem: 'WASTE',
      rawPacket: 'WASTE,1,38,52,90,ORGANIC,NORMAL,CLEAR,ONLINE',
      source: 'SIMULATOR'
    },
    {
      id: 'pkt-2',
      timestamp: new Date().toISOString(),
      subsystem: 'IRRIGATION',
      rawPacket: 'IRRIGATION,1,580,46,OFF',
      source: 'SIMULATOR'
    },
    {
      id: 'pkt-3',
      timestamp: new Date().toISOString(),
      subsystem: 'AIR',
      rawPacket: 'AIR,1,145,264,58,LOW',
      source: 'SIMULATOR'
    }
  ];

  // Ingest structured JSON or raw serial packet from NodeMCU ESP8266
  public ingestJsonReading(body: Record<string, any>, source: 'NODEMCU' | 'SIMULATOR' = 'NODEMCU'): { success: boolean; message: string; subsystem?: string } {
    if (!body || typeof body !== 'object') {
      return { success: false, message: 'Invalid JSON payload. Expected an object.' };
    }

    const now = Date.now();
    const timestamp = new Date().toISOString();

    if (source === 'NODEMCU') {
      this.mode = 'HARDWARE';
      this.isHardwareConnected = true;
      this.lastHardwarePacketTime = now;
    }

    // 1. Direct packet string wrapped in JSON
    if (typeof body.packet === 'string') {
      return this.ingestRawPacket(body.packet, source);
    }
    if (typeof body.raw === 'string') {
      return this.ingestRawPacket(body.raw, source);
    }

    // 2. Multi-subsystem batch JSON payload
    let anyHandled = false;
    if (body.waste && typeof body.waste === 'object') {
      this.handleWasteJson(body.waste, source, timestamp, now);
      anyHandled = true;
    }
    if (body.irrigation && typeof body.irrigation === 'object') {
      this.handleIrrigationJson(body.irrigation, source, timestamp, now);
      anyHandled = true;
    }
    if (body.air && typeof body.air === 'object') {
      this.handleAirJson(body.air, source, timestamp, now);
      anyHandled = true;
    }
    if (anyHandled) {
      return { success: true, message: 'Multi-subsystem JSON telemetry recorded successfully' };
    }

    // 3. Single subsystem identified by 'subsystem' or 'type' field
    const sub = (body.subsystem || body.type || '').toString().toUpperCase();

    if (sub === 'WASTE' || ('dryCount' in body) || ('dry' in body)) {
      this.handleWasteJson(body, source, timestamp, now);
      return { success: true, message: 'Waste telemetry updated via JSON', subsystem: 'WASTE' };
    }

    if (sub === 'IRRIGATION' || ('moisturePercent' in body) || ('moisture' in body)) {
      this.handleIrrigationJson(body, source, timestamp, now);
      return { success: true, message: 'Irrigation telemetry updated via JSON', subsystem: 'IRRIGATION' };
    }

    if (sub === 'AIR' || ('pollutionRaw' in body) || ('gas' in body)) {
      this.handleAirJson(body, source, timestamp, now);
      return { success: true, message: 'Air quality telemetry updated via JSON', subsystem: 'AIR' };
    }

    return { success: false, message: 'Unrecognized JSON structure. Specify "subsystem": "WASTE"|"IRRIGATION"|"AIR" or "packet": "..."' };
  }

  private handleWasteJson(data: Record<string, any>, source: 'NODEMCU' | 'SIMULATOR', timestamp: string, nowMs: number) {
    const dry = Number(data.dryCount ?? data.dry ?? this.waste.dryCount);
    const organic = Number(data.organicCount ?? data.organic ?? this.waste.organicCount);
    const total = Number(data.totalCount ?? data.total ?? (dry + organic));
    const lastCategory = ((data.lastCategory ?? data.category ?? this.waste.lastCategory) as string).toUpperCase() as WasteCategory;
    const binStatus = ((data.binStatus ?? data.status ?? this.waste.binStatus) as string).toUpperCase() as WasteBinStatus;
    const irStatus = (data.irStatus ?? data.ir ?? 'CLEAR').toString().toUpperCase() === 'DETECTED' ? 'DETECTED' : 'CLEAR';
    const systemStatus = (data.systemStatus ?? 'ONLINE').toString().toUpperCase() === 'STANDBY' ? 'STANDBY' : 'ONLINE';

    this.waste = {
      dryCount: dry,
      organicCount: organic,
      totalCount: total,
      lastCategory,
      binStatus,
      irStatus,
      systemStatus,
      lastUpdated: timestamp
    };

    this.lastWasteTime = nowMs;
    const packetStr = `WASTE,1,${dry},${organic},${total},${lastCategory},${binStatus},${irStatus},${systemStatus}`;
    this.logPacket('pkt-' + nowMs, timestamp, 'WASTE', packetStr, source);

    if (binStatus === 'FULL') {
      this.addAlert('critical', 'WASTE', 'Waste bin has reached full capacity. Emptying required.');
    } else if (binStatus === 'NEAR_FULL') {
      this.addAlert('warning', 'WASTE', 'Waste bin is nearing 85% capacity.');
    }
  }

  private handleIrrigationJson(data: Record<string, any>, source: 'NODEMCU' | 'SIMULATOR', timestamp: string, nowMs: number) {
    const rawSensor = Number(data.rawSensor ?? data.raw ?? this.irrigation.rawSensor);
    const moisturePercent = Math.min(100, Math.max(0, Number(data.moisturePercent ?? data.moisture ?? this.irrigation.moisturePercent)));
    const pumpStatus = (data.pumpStatus ?? data.pump ?? 'OFF').toString().toUpperCase() === 'ON' ? 'ON' : 'OFF';

    this.irrigation = {
      ...this.irrigation,
      rawSensor,
      moisturePercent,
      pumpStatus,
      lastUpdated: timestamp
    };

    this.lastIrrigationTime = nowMs;
    const packetStr = `IRRIGATION,1,${rawSensor},${moisturePercent},${pumpStatus}`;
    this.logPacket('pkt-' + nowMs, timestamp, 'IRRIGATION', packetStr, source);

    if (moisturePercent < this.irrigation.thresholdPercent) {
      this.addAlert('warning', 'IRRIGATION', `Soil moisture (${moisturePercent}%) dropped below threshold (${this.irrigation.thresholdPercent}%). Pump active: ${pumpStatus}`);
    }
  }

  private handleAirJson(data: Record<string, any>, source: 'NODEMCU' | 'SIMULATOR', timestamp: string, nowMs: number) {
    const pollutionRaw = Number(data.pollutionRaw ?? data.gas ?? this.air.pollutionRaw);

    let tempCelsius = this.air.tempCelsius;
    if ('tempCelsius' in data && data.tempCelsius !== null) {
      tempCelsius = Number(data.tempCelsius);
    } else if ('tempValue' in data) {
      const tv = Number(data.tempValue);
      tempCelsius = tv === -999 ? null : Number((tv / 10).toFixed(1));
    } else if ('temp' in data) {
      tempCelsius = Number(data.temp);
    }

    let humidityPercent = this.air.humidityPercent;
    if ('humidityPercent' in data && data.humidityPercent !== null) {
      humidityPercent = Number(data.humidityPercent);
    } else if ('humidityValue' in data) {
      const hv = Number(data.humidityValue);
      humidityPercent = hv === -1 ? null : hv;
    } else if ('humidity' in data) {
      humidityPercent = Number(data.humidity);
    }

    const pollutionLevel = ((data.pollutionLevel ?? data.level ?? this.air.pollutionLevel) as string).toUpperCase() as AirPollutionLevel;

    this.air = {
      pollutionRaw,
      tempCelsius,
      humidityPercent,
      pollutionLevel,
      lastUpdated: timestamp
    };

    this.lastAirTime = nowMs;
    const tempTenths = tempCelsius !== null ? Math.round(tempCelsius * 10) : -999;
    const humRaw = humidityPercent !== null ? humidityPercent : -1;
    const packetStr = `AIR,1,${pollutionRaw},${tempTenths},${humRaw},${pollutionLevel}`;
    this.logPacket('pkt-' + nowMs, timestamp, 'AIR', packetStr, source);

    if (pollutionLevel === 'ALERT' || pollutionLevel === 'HIGH') {
      this.addAlert('critical', 'AIR', `High environmental particulate / gas index detected: MQ-2 Raw ${pollutionRaw}. Project Level: ${pollutionLevel}`);
    }
  }

  // Parse raw serial packet format from NodeMCU ESP8266
  public ingestRawPacket(rawPacket: string, source: 'NODEMCU' | 'SIMULATOR' = 'NODEMCU'): { success: boolean; message: string } {
    const trimmed = rawPacket.trim();
    if (!trimmed) return { success: false, message: 'Empty packet' };

    const parts = trimmed.split(',').map(p => p.trim());
    const header = parts[0]?.toUpperCase();

    const now = Date.now();
    const timestamp = new Date().toISOString();
    const packetId = 'pkt-' + now + '-' + Math.random().toString(36).substring(2, 6);

    if (source === 'NODEMCU') {
      this.mode = 'HARDWARE';
      this.isHardwareConnected = true;
      this.lastHardwarePacketTime = now;
    }

    if (header === 'WASTE') {
      if (parts.length < 8) {
        return { success: false, message: 'Incomplete WASTE packet format. Expected: WASTE,1,dry,organic,total,lastCategory,binStatus,irStatus,systemStatus' };
      }
      const dry = parseInt(parts[2], 10) || 0;
      const organic = parseInt(parts[3], 10) || 0;
      const total = parseInt(parts[4], 10) || (dry + organic);
      const lastCat = (parts[5]?.toUpperCase() || 'NONE') as WasteCategory;
      const binSt = (parts[6]?.toUpperCase() || 'NORMAL') as WasteBinStatus;
      const irSt = (parts[7]?.toUpperCase() === 'DETECTED' ? 'DETECTED' : 'CLEAR');
      const sysSt = (parts[8]?.toUpperCase() === 'STANDBY' ? 'STANDBY' : 'ONLINE');

      this.waste = {
        dryCount: dry,
        organicCount: organic,
        totalCount: total,
        lastCategory: lastCat,
        binStatus: binSt,
        irStatus: irSt,
        systemStatus: sysSt,
        lastUpdated: timestamp
      };
      this.lastWasteTime = now;

      if (binSt === 'FULL') {
        this.addAlert('critical', 'WASTE', 'Waste bin has reached full capacity. Emptying required.');
      } else if (binSt === 'NEAR_FULL') {
        this.addAlert('warning', 'WASTE', 'Waste bin is nearing 85% capacity.');
      }

      this.logPacket(packetId, timestamp, 'WASTE', trimmed, source);
      return { success: true, message: 'WASTE telemetry updated successfully' };
    }

    if (header === 'IRRIGATION') {
      if (parts.length < 5) {
        return { success: false, message: 'Incomplete IRRIGATION packet format. Expected: IRRIGATION,1,raw,moisture,pumpStatus' };
      }
      const raw = parseInt(parts[2], 10) || 0;
      const moisture = Math.min(100, Math.max(0, parseInt(parts[3], 10) || 0));
      const pump = (parts[4]?.toUpperCase() === 'ON' ? 'ON' : 'OFF');

      this.irrigation = {
        ...this.irrigation,
        rawSensor: raw,
        moisturePercent: moisture,
        pumpStatus: pump,
        lastUpdated: timestamp
      };
      this.lastIrrigationTime = now;

      if (moisture < this.irrigation.thresholdPercent) {
        this.addAlert('warning', 'IRRIGATION', `Soil moisture (${moisture}%) dropped below threshold (${this.irrigation.thresholdPercent}%). Pump active: ${pump}`);
      }

      this.logPacket(packetId, timestamp, 'IRRIGATION', trimmed, source);
      return { success: true, message: 'IRRIGATION telemetry updated successfully' };
    }

    if (header === 'AIR') {
      if (parts.length < 6) {
        return { success: false, message: 'Incomplete AIR packet format. Expected: AIR,1,pollutionRaw,tempValue,humidityValue,pollutionLevel' };
      }
      const pollutionRaw = parseInt(parts[2], 10) || 0;
      const tempTenths = parseInt(parts[3], 10);
      const humRaw = parseInt(parts[4], 10);
      const level = (parts[5]?.toUpperCase() || 'LOW') as AirPollutionLevel;

      const tempCelsius = tempTenths === -999 ? null : Number((tempTenths / 10).toFixed(1));
      const humidityPercent = humRaw === -1 ? null : humRaw;

      this.air = {
        pollutionRaw,
        tempCelsius,
        humidityPercent,
        pollutionLevel: level,
        lastUpdated: timestamp
      };
      this.lastAirTime = now;

      if (level === 'ALERT' || level === 'HIGH') {
        this.addAlert('critical', 'AIR', `High environmental particulate / gas index detected: MQ-2 Raw ${pollutionRaw}. Project Level: ${level}`);
      }

      this.logPacket(packetId, timestamp, 'AIR', trimmed, source);
      return { success: true, message: 'AIR telemetry updated successfully' };
    }

    return { success: false, message: `Unknown subsystem packet header: ${header}` };
  }

  private logPacket(id: string, timestamp: string, subsystem: 'WASTE' | 'IRRIGATION' | 'AIR', rawPacket: string, source: 'NODEMCU' | 'SIMULATOR') {
    this.recentPackets.unshift({ id, timestamp, subsystem, rawPacket, source });
    if (this.recentPackets.length > 25) {
      this.recentPackets.pop();
    }
  }

  private addAlert(level: 'info' | 'warning' | 'critical', subsystem: 'WASTE' | 'IRRIGATION' | 'AIR' | 'SYSTEM', message: string) {
    this.alerts.unshift({
      id: 'alert-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
      level,
      subsystem,
      message
    });
    if (this.alerts.length > 20) {
      this.alerts.pop();
    }
  }

  public setMoistureThreshold(threshold: number) {
    this.irrigation.thresholdPercent = Math.min(100, Math.max(5, threshold));
    this.addAlert('info', 'IRRIGATION', `Irrigation moisture threshold updated to ${this.irrigation.thresholdPercent}%.`);
  }

  // Preset Scenario Simulator
  public runScenario(scenario: 'nominal' | 'dry_soil' | 'bin_full' | 'air_spike' | 'disconnect' | 'reset') {
    const now = new Date().toISOString();

    if (scenario === 'disconnect') {
      this.mode = 'HARDWARE';
      this.isHardwareConnected = false;
      this.lastHardwarePacketTime = 0;
      this.lastWasteTime = 0;
      this.lastIrrigationTime = 0;
      this.lastAirTime = 0;
      this.addAlert('warning', 'SYSTEM', 'Simulated hardware disconnection. Awaiting serial packets.');
      return;
    }

    this.mode = 'SIMULATOR';

    switch (scenario) {
      case 'nominal':
        this.ingestRawPacket('WASTE,1,42,58,100,ORGANIC,NORMAL,CLEAR,ONLINE', 'SIMULATOR');
        this.ingestRawPacket('IRRIGATION,1,560,48,OFF', 'SIMULATOR');
        this.ingestRawPacket('AIR,1,130,265,60,LOW', 'SIMULATOR');
        this.addAlert('info', 'SYSTEM', 'Scenario loaded: Nominal baseline smart city operations.');
        break;

      case 'dry_soil':
        this.ingestRawPacket('IRRIGATION,1,890,22,ON', 'SIMULATOR');
        this.addAlert('warning', 'IRRIGATION', 'Scenario: Soil moisture dropped to 22%. Submersible pump activated via relay.');
        break;

      case 'bin_full':
        this.ingestRawPacket('WASTE,1,78,92,170,DRY,FULL,DETECTED,ONLINE', 'SIMULATOR');
        this.addAlert('critical', 'WASTE', 'Scenario: Optical limit reached. Bin status FULL. Municipal collection alert dispatched.');
        break;

      case 'air_spike':
        this.ingestRawPacket('AIR,1,640,314,48,ALERT', 'SIMULATOR');
        this.addAlert('critical', 'AIR', 'Scenario: MQ-2 sensor spiked to 640. Smoke/exhaust levels elevated. Ventilation advised.');
        break;

      case 'reset':
        this.waste = {
          dryCount: 24,
          organicCount: 35,
          totalCount: 59,
          lastCategory: 'DRY',
          binStatus: 'NORMAL',
          irStatus: 'CLEAR',
          systemStatus: 'ONLINE',
          lastUpdated: now
        };
        this.irrigation = {
          rawSensor: 580,
          moisturePercent: 44,
          pumpStatus: 'OFF',
          thresholdPercent: 35,
          lastUpdated: now
        };
        this.air = {
          pollutionRaw: 140,
          tempCelsius: 25.8,
          humidityPercent: 55,
          pollutionLevel: 'LOW',
          lastUpdated: now
        };
        this.alerts = [
          {
            id: 'alert-' + Date.now(),
            timestamp: now,
            level: 'info',
            subsystem: 'SYSTEM',
            message: 'ECOSPHERE telemetry counters reset to default baseline.'
          }
        ];
        break;
    }
  }

  // Calculate individual subsystem online status
  private getSubsystemStatus(lastTime: number, now: number): SubsystemOnlineStatus {
    if (this.mode === 'SIMULATOR') {
      return 'ONLINE';
    }
    if (lastTime === 0) {
      return 'WAITING';
    }
    const elapsedSec = (now - lastTime) / 1000;
    return elapsedSec <= 15 ? 'ONLINE' : 'OFFLINE';
  }

  public getUnifiedTelemetry(): UnifiedTelemetry {
    const now = Date.now();
    let connectionStatus: UnifiedTelemetry['connectionStatus'] = 'DEMO';
    let isStale = false;

    const wasteStatus = this.getSubsystemStatus(this.lastWasteTime, now);
    const irrigationStatus = this.getSubsystemStatus(this.lastIrrigationTime, now);
    const airStatus = this.getSubsystemStatus(this.lastAirTime, now);

    if (this.mode === 'HARDWARE') {
      if (!this.isHardwareConnected || this.lastHardwarePacketTime === 0) {
        connectionStatus = 'DISCONNECTED'; // "Hardware Not Connected"
      } else {
        const elapsedSec = (now - this.lastHardwarePacketTime) / 1000;
        if (elapsedSec > 15) {
          connectionStatus = 'STALE'; // "Data Stale"
          isStale = true;
        } else {
          connectionStatus = 'LIVE'; // "LIVE SENSOR DATA"
        }
      }
    } else {
      connectionStatus = 'DEMO'; // "DEMONSTRATION VALUES"
    }

    const lastPacketTimestamp = this.recentPackets.length > 0 ? this.recentPackets[0].timestamp : null;

    return {
      connectionStatus,
      lastPacketTimestamp,
      mode: this.mode,
      isStale,
      subsystemStatus: {
        waste: wasteStatus,
        irrigation: irrigationStatus,
        air: airStatus
      },
      waste: {
        ...this.waste,
        onlineStatus: wasteStatus
      },
      irrigation: {
        ...this.irrigation,
        onlineStatus: irrigationStatus
      },
      air: {
        ...this.air,
        onlineStatus: airStatus
      },
      alerts: [...this.alerts],
      recentPackets: [...this.recentPackets]
    };
  }

  // For GET /api/latest
  public getLatestReadings(): Record<string, any> {
    const telemetry = this.getUnifiedTelemetry();
    return {
      status: 'success',
      connectionStatus: telemetry.connectionStatus,
      mode: telemetry.mode,
      isStale: telemetry.isStale,
      subsystemStatus: telemetry.subsystemStatus,
      lastPacketTimestamp: telemetry.lastPacketTimestamp,
      readings: {
        waste: {
          ...telemetry.waste,
          status: telemetry.subsystemStatus.waste
        },
        irrigation: {
          ...telemetry.irrigation,
          status: telemetry.subsystemStatus.irrigation
        },
        air: {
          ...telemetry.air,
          status: telemetry.subsystemStatus.air
        }
      },
      alerts: telemetry.alerts.slice(0, 5)
    };
  }
}

export const sensorStore = new SensorStore();
