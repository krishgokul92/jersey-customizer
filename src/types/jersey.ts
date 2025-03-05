export interface JerseyColors {
  body: string;        // Color for the jersey body
  sleeves: string;     // Color for the sleeves
  collar: string;      // Color for the collar
  numberColor: string; // Color for the jersey number
  nameColor: string;   // Color for the player name
}

export interface TextTransform {
  position: [number, number, number];
  rotation: number;  // Single rotation value for Y-axis
  scale: number;     // Single uniform scale value
}

export interface JerseyText {
  content: string;
  transform: TextTransform;
  isBack: boolean;  // Whether to show on back of jersey
}

export interface JerseyCustomization {
  colors: JerseyColors;
  number: string;
  numberTransform: TextTransform;
  name: JerseyText;
} 