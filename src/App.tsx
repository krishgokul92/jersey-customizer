import React, { useState } from 'react';
import styled from 'styled-components';
import Jersey from './components/Jersey';
import ColorPicker from './components/ColorPicker';
import { JerseyColors, NumberTransform } from './types/jersey';

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const CustomizationPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 380px;
  min-width: 380px;
  height: 100vh;
  padding: 32px;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  z-index: 2;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 3px;
    &:hover {
      background: #bbb;
    }
  }
`;

const PreviewPanel = styled.div`
  flex: 1;
  height: 100vh;
  position: relative;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
`;

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: 700;
  position: sticky;
  top: 0;
  background: white;
  padding: 0 0 20px 0;
  z-index: 1;
  border-bottom: 1px solid #f0f0f0;
`;

const Section = styled.div<{ noPadding?: boolean }>`
  background: white;
  border-radius: 12px;
  padding: ${props => props.noPadding ? '0' : '24px'};
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: #1a1a1a;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
`;

const ColorPickersContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
`;

const NumberInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    font-weight: 500;
    color: #666;
    font-size: 14px;
  }

  input {
    padding: 12px 16px;
    border: 2px solid #eee;
    border-radius: 8px;
    font-size: 18px;
    width: 100px;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }
  }
`;

const TransformControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input[type="range"] {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    background: #eee;
    border-radius: 3px;
    outline: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      background: #2196f3;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        transform: scale(1.1);
        box-shadow: 0 0 0 6px rgba(33, 150, 243, 0.1);
      }
    }
  }

  .value {
    font-size: 13px;
    color: #999;
    font-weight: 500;
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const ControlsHint = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.9;
  z-index: 1;
  backdrop-filter: blur(8px);
  display: flex;
  gap: 16px;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ColorPickerGroup = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }

  h3 {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    font-weight: 500;
  }
`;

const ColorSwatches = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 12px;
`;

const ColorSwatch = styled.button<{ color: string; isSelected: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  border: 2px solid ${props => props.isSelected ? '#2196f3' : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isSelected ? '0 0 0 2px rgba(33, 150, 243, 0.3)' : 'none'};

  &:hover {
    transform: scale(1.1);
  }
`;

const CustomColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="color"] {
    width: 40px;
    height: 40px;
    padding: 0;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: none;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 8px;
    }
  }

  input[type="text"] {
    flex: 1;
    padding: 8px 12px;
    border: 2px solid #eee;
    border-radius: 8px;
    font-family: monospace;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #2196f3;
    }
  }
`;

// Icons components
const NumberIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 7v13h2v-5h2v5h2V7h-2v6h-2V7H9Z"/>
  </svg>
);

const ColorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.61-.23-1.2-.64-1.67a.528.528 0 0 1-.13-.33c0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6c0-4.96-4.49-9-10-9zm5.5 11c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm-3-4c-.83 0-1.5-.67-1.5-1.5S13.67 6 14.5 6s1.5.67 1.5 1.5S15.33 9 14.5 9zM5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S7.33 13 6.5 13S5 12.33 5 11.5zm6-4c0 .83-.67 1.5-1.5 1.5S8 8.33 8 7.5S8.67 6 9.5 6s1.5.67 1.5 1.5z"/>
  </svg>
);

const TransformIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 18v-2H8V4h2L7 1L4 4h2v2H2v2h4v8c0 1.1.9 2 2 2h8v2h-2l3 3l3-3h-2v-2h4zM10 8h6v6h2V8c0-1.1-.9-2-2-2h-6v2z"/>
  </svg>
);

// Predefined color palettes
const colorPalettes = {
  main: ['#1a237e', '#d32f2f', '#1b5e20', '#000000', '#ffffff', '#ffd700'],
  accent: ['#ffffff', '#000000', '#ffd700', '#c62828', '#1565c0', '#2e7d32'],
};

function App() {
  const [jerseyColors, setJerseyColors] = useState<JerseyColors>({
    body: '#1a237e',      // Default blue for body
    sleeves: '#1a237e',   // Default blue for sleeves
    collar: '#ffffff',    // Default white for collar
    numberColor: '#ffffff', // Default white for numbers
    numberStroke: '#000000' // Default black for number stroke
  });

  const [number, setNumber] = useState('23');

  const [transform, setTransform] = useState<NumberTransform>({
    position: [0, 0.5, 1.8],
    rotation: 0,
    scale: 2
  });

  const handleColorChange = (colorKey: keyof JerseyColors) => (color: string) => {
    setJerseyColors(prev => ({
      ...prev,
      [colorKey]: color
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    setNumber(value);
  };

  const handleTransformChange = (
    type: 'position' | 'rotation' | 'scale',
    value: number,
    index?: number
  ) => {
    setTransform(prev => ({
      ...prev,
      [type]: type === 'position' 
        ? prev.position.map((v, i) => i === index ? value : v)
        : value
    }));
  };

  const ColorPickerSection = ({ 
    label, 
    color, 
    onChange, 
    palette = colorPalettes.main 
  }: { 
    label: string; 
    color: string; 
    onChange: (color: string) => void; 
    palette?: string[]; 
  }) => (
    <ColorPickerGroup>
      <h3>{label}</h3>
      <ColorSwatches>
        {palette.map((swatch) => (
          <ColorSwatch
            key={swatch}
            color={swatch}
            isSelected={color === swatch}
            onClick={() => onChange(swatch)}
          />
        ))}
      </ColorSwatches>
      <CustomColorInput>
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
        />
      </CustomColorInput>
    </ColorPickerGroup>
  );

  return (
    <AppContainer>
      <CustomizationPanel>
        <Title>Jersey Customizer</Title>
        
        <Section>
          <SectionTitle>
            <NumberIcon />
            Jersey Number
          </SectionTitle>
          <NumberInput>
            <label htmlFor="number">Enter Number (0-99)</label>
            <input
              id="number"
              type="text"
              value={number}
              onChange={handleNumberChange}
              placeholder="00"
              maxLength={2}
            />
          </NumberInput>
        </Section>

        <Section noPadding>
          <SectionTitle style={{ margin: '0 24px 20px' }}>
            <ColorIcon />
            Jersey Colors
          </SectionTitle>
          <ColorPickersContainer>
            <ColorPickerSection
              label="Body Color"
              color={jerseyColors.body}
              onChange={handleColorChange('body')}
            />
            <ColorPickerSection
              label="Sleeves Color"
              color={jerseyColors.sleeves}
              onChange={handleColorChange('sleeves')}
            />
            <ColorPickerSection
              label="Collar Color"
              color={jerseyColors.collar}
              onChange={handleColorChange('collar')}
              palette={colorPalettes.accent}
            />
            <ColorPickerSection
              label="Number Color"
              color={jerseyColors.numberColor}
              onChange={handleColorChange('numberColor')}
              palette={colorPalettes.accent}
            />
            <ColorPickerSection
              label="Number Outline"
              color={jerseyColors.numberStroke}
              onChange={handleColorChange('numberStroke')}
              palette={colorPalettes.accent}
            />
          </ColorPickersContainer>
        </Section>

        <Section>
          <SectionTitle>
            <TransformIcon />
            Number Transform
          </SectionTitle>
          
          {['x', 'y', 'z'].map((axis, index) => (
            <TransformControl key={`position-${axis}`}>
              <label>
                Position {axis.toUpperCase()}
                <span className="value">{transform.position[index].toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.1}
                value={transform.position[index]}
                onChange={(e) => handleTransformChange('position', parseFloat(e.target.value), index)}
              />
            </TransformControl>
          ))}

          <TransformControl>
            <label>
              Rotation
              <span className="value">{transform.rotation.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.1}
              value={transform.rotation}
              onChange={(e) => handleTransformChange('rotation', parseFloat(e.target.value))}
            />
          </TransformControl>

          <TransformControl>
            <label>
              Scale
              <span className="value">{transform.scale.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0.1}
              max={4}
              step={0.1}
              value={transform.scale}
              onChange={(e) => handleTransformChange('scale', parseFloat(e.target.value))}
            />
          </TransformControl>
        </Section>
      </CustomizationPanel>
      <PreviewPanel>
        <Jersey
          colors={jerseyColors}
          number={number}
          transform={transform}
        />
        <ControlsHint>
          <span>🖱️ Click and drag to rotate</span>
          <span>⚙️ Use controls to customize</span>
        </ControlsHint>
      </PreviewPanel>
    </AppContainer>
  );
}

export default App;
