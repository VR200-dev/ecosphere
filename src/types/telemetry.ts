export type ConnectionState = 'LIVE' | 'WAITING' | 'STALE' | 'DISCONNECTED' | 'DEMO';

export type SubsystemOnlineStatus = 'ONLINE' | 'OFFLINE' | 'WAITING';

export type WasteBinStatus = 'NORMAL' | 'NEAR_FULL' | 'FULL';
export type WasteCategory = 'DRY' | 'ORGANIC' | 'NONE';

export interface WasteTelemetry {
  dryCount: number;
  organicCount: number;
  totalCount: number;
  lastCategory: WasteCategory;
  binStatus: WasteBinStatus;
  irStatus: 'DETECTED' | 'CLEAR';
  systemStatus: 'ONLINE' | 'STANDBY';
  lastUpdated: string | null;
  onlineStatus?: SubsystemOnlineStatus;
}

export interface IrrigationTelemetry {
  rawSensor: number; // 0-1023 analog reading
  moisturePercent: number; // 0-100%
  pumpStatus: 'ON' | 'OFF';
  thresholdPercent: number; // e.g. 35%
  lastUpdated: string | null;
  onlineStatus?: SubsystemOnlineStatus;
}

export type AirPollutionLevel = 'CLEAN' | 'LOW' | 'MODERATE' | 'HIGH' | 'ALERT';

export interface AirTelemetry {
  pollutionRaw: number; // MQ-2 raw ADC (e.g. 100 - 800)
  tempCelsius: number | null; // Converted from tenths of deg C (e.g. 264 -> 26.4), null if -999
  humidityPercent: number | null; // % RH, null if -1
  pollutionLevel: AirPollutionLevel;
  lastUpdated: string | null;
  onlineStatus?: SubsystemOnlineStatus;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'critical';
  subsystem: 'WASTE' | 'IRRIGATION' | 'AIR' | 'SYSTEM';
  message: string;
}

export interface PacketLogEntry {
  id: string;
  timestamp: string;
  subsystem: 'WASTE' | 'IRRIGATION' | 'AIR';
  rawPacket: string;
  source: 'NODEMCU' | 'SIMULATOR';
}

export interface UnifiedTelemetry {
  connectionStatus: ConnectionState;
  lastPacketTimestamp: string | null;
  mode: 'HARDWARE' | 'SIMULATOR';
  isStale: boolean;
  subsystemStatus: {
    waste: SubsystemOnlineStatus;
    irrigation: SubsystemOnlineStatus;
    air: SubsystemOnlineStatus;
  };
  waste: WasteTelemetry;
  irrigation: IrrigationTelemetry;
  air: AirTelemetry;
  alerts: SystemAlert[];
  recentPackets: PacketLogEntry[];
}
