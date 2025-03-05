import React from 'react';
import styles from '../../styles/UI.module.css';

interface InputProps {
  label: string;
  type: 'text' | 'range' | 'checkbox';
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  min,
  max,
  step,
  placeholder
}) => {
  return (
    <div className={styles.inputGroup}>
      <label>
        {label}
        <input
          type={type}
          value={type === 'checkbox' ? undefined : value as string | number}
          checked={type === 'checkbox' ? value as boolean : undefined}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};

export default Input; 