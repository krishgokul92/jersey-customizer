export interface JerseyColors {
  main: string;
  secondary: string;
  numberColor: string;
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