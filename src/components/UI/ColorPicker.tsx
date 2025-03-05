import React from 'react';
import { HexColorPicker } from 'react-colorful';
import styles from '../../styles/UI.module.css';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <div className={styles.colorPicker}>
      <label>{label}</label>
      <HexColorPicker color={color} onChange={onChange} />
    </div>
  );
};

export default ColorPicker; 