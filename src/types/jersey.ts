export interface JerseyColors {
  body: string;        // Color for the jersey body
  sleeves: string;     // Color for the sleeves
  collar: string;      // Color for the collar
  numberColor: string; // Color for the jersey number
}

export interface NumberTransform {
  position: [number, number, number];
  rotation: number;  // Single rotation value for Z-axis
  scale: number;     // Single uniform scale value
}

export interface JerseyCustomization {
  colors: JerseyColors;
  number: string;
  transform: NumberTransform;
} 