export type EngineStatus = 'started' | 'stopped' | 'driving' | 'broken';

export type EngineResponse = {
  velocity: number;
  distance: number;
};

export type SwitchDriveModeResponse = {
  success: boolean;
};
