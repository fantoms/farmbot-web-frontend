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
};

export interface DetectorState extends WeedDetectorENV {
  isEditing: boolean;
};
