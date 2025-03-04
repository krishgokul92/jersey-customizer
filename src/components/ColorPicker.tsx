import React, { useState, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';

interface ColorPickerProps {
  color: string;
  label: string;
  onChange: (color: string) => void;
}

const ColorPickerWrapper = styled.div`
  position: relative;
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ColorPickerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #666;
  font-size: 14px;
`;

const ColorPreview = styled.button<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #eee;
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  padding: 0;

  &:hover {
    transform: scale(1.05);
    border-color: #ddd;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
    border-radius: 6px;
  }
`;

const PopoverWrapper = styled.div`
  position: absolute;
  right: 24px;
  top: 100%;
  z-index: 10;
  margin-top: 8px;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.15));

  .sketch-picker {
    border-radius: 12px !important;
    box-shadow: none !important;
    border: 1px solid #eee !important;
    padding: 8px !important;
    background: white !important;
    width: 220px !important;
  }
`;

const ColorValue = styled.span`
  font-size: 13px;
  color: #999;
  font-family: 'SF Mono', 'Roboto Mono', monospace;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 72px;
  text-align: center;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
`;

const ColorPicker: React.FC<ColorPickerProps> = ({ color, label, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPicker(true);
  }, []);

  const handleClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPicker(false);
  }, []);

  const handleColorChange = useCallback((color: any) => {
    onChange(color.hex);
  }, [onChange]);

  return (
    <ColorPickerWrapper>
      <ColorPickerHeader>
        <Label>{label}</Label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ColorValue>{color.toUpperCase()}</ColorValue>
          <ColorPreview
            color={color}
            onClick={handleClick}
            aria-label={`Choose ${label.toLowerCase()}`}
          />
        </div>
      </ColorPickerHeader>
      
      {showPicker && (
        <>
          <Overlay onClick={handleClose} />
          <PopoverWrapper onClick={e => e.stopPropagation()}>
            <SketchPicker
              color={color}
              onChange={handleColorChange}
              disableAlpha={true}
              presetColors={[
                '#1a237e', '#ffffff', '#000000',
                '#D32F2F', '#C2185B', '#7B1FA2',
                '#303F9F', '#0288D1', '#00796B',
                '#388E3C', '#FBC02D', '#F57C00'
              ]}
            />
          </PopoverWrapper>
        </>
      )}
    </ColorPickerWrapper>
  );
};

export default ColorPicker; 