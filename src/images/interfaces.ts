export interface ImageState {
  all: Image[];
}

export interface Image {
  id: number;
  device_id: number;
  attachment_processed_at: Date | undefined;
  updated_at: Date;
  created_at: Date;
  attachment_url: string;
  meta: {
    x: number | undefined;
    y: number | undefined;
    z: number | undefined;
  };
}

/** Hue, Saturation, Value map. */
export interface HSV<T> {
  H: T;
  S: T;
  V: T;
}

/** A simple range object. */
export interface HiLo {
  hi: number;
  lo: number;
}

// api/regimens/sync
// {1: 57}

/** JSON document that gets sent to the weed detection python script as an WeedDetectorENV
 *  variable. */
export interface WeedDetectorENV {
  H: [number, number];
  S: [number, number];
  V: [number, number];
  blur: number;
  morph: number;
  iterations: number;
}

export interface DetectorState extends WeedDetectorENV {
  isEditing: boolean;
  deletionProgress: string;
  settingsMenuOpen: boolean;
}

export interface FarmbotPickerProps {
  h: [number, number];
  s: [number, number];
  v: [number, number];
  hsv: { h: number, s: number, v: number };
  hsl: { h: number, s: number, l: number };
}

export interface EnvSliderProps {
  name: keyof HSV<{}>;
  env: Partial<WeedDetectorENV>;
  onChange?: (key: keyof HSV<{}>, val: [number, number]) => void;
}

export interface EnvSliderState extends Partial<HiLo> {
  sliding: boolean;
}

export interface ImageFlipperProps {
  images: Image[];
}

export interface ImageFlipperState {
  currentInx: number;
  isLoaded: boolean;
}
