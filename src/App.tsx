import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Jersey from './components/Jersey';
import { JerseyColors, NumberTransform } from './types/jersey';
import { HexColorPicker } from 'react-colorful';

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
  overflow-x: visible;
  overflow-y: auto;
  z-index: 2;

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

const TabContainer = styled.div`
  margin-bottom: 24px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  background: ${props => props.active ? '#2196f3' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#1976d2' : '#e0e0e0'};
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
`;

const SectionTitle = styled.h2`
  color: #1a1a1a;
  font-size: 16px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorGroup = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);

  &:last-child {
    margin-bottom: 0;
  }
`;

const ColorGroupTitle = styled.h3`
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 500;
`;

const CurrentColor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 12px;

  span {
    flex: 1;
    font-size: 12px;
    color: #666;
    font-family: 'SF Mono', SFMono-Regular, ui-monospace, monospace;
  }

  div {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
  }
`;

const CustomColorSection = styled.div`
  position: relative;
  width: 100%;
`;

const ColorPickerPopup = styled.div<{ isOpen: boolean }>`
  position: fixed;
  margin-top: 4px;
  width: 220px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 12px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  z-index: 1000;
`;

const ColorPickerContainer = styled.div`
  .react-colorful {
    width: 100%;
    height: 120px;
    border-radius: 6px;
    
    .react-colorful__saturation {
      border-radius: 6px 6px 0 0;
    }
    
    .react-colorful__hue {
      height: 16px;
      border-radius: 0 0 6px 6px;
    }
    
    .react-colorful__pointer {
      width: 16px;
      height: 16px;
      border-width: 1px;
      border-color: white;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }
  }
`;

const HexInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  margin: 8px 0;
  border: 1px solid #eee;
  border-radius: 4px;
  font-family: 'SF Mono', SFMono-Regular, ui-monospace, monospace;
  font-size: 12px;
  text-align: center;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
  }
`;

const ColorPickerButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
`;

const ColorPickerButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${props => props.variant === 'primary' ? '#2196f3' : '#f5f5f5'};
  color: ${props => props.variant === 'primary' ? 'white' : '#666'};

  &:hover {
    background: ${props => props.variant === 'primary' ? '#1976d2' : '#e0e0e0'};
  }
`;

const ColorPickerTrigger = styled.button<{ color: string }>`
  width: 100%;
  height: 36px;
  border: none;
  border-radius: 6px;
  background-color: ${props => props.color};
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
    border-radius: 6px;
    pointer-events: none;
  }
`;

const NumberInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
    color: #666;
    font-size: 13px;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 16px;
    width: 80px;
    transition: all 0.15s ease;
    
    &:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
    }
  }
`;

const PresetSwatches = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
`;

const PresetSwatch = styled.button<{ color: string }>`
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.color};
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
  transition: all 0.15s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const presetColors = {
  jersey: ['#1a237e', '#d32f2f', '#1b5e20', '#000000', '#ffffff', '#ffd700'],
  text: ['#ffffff', '#000000', '#ffd700', '#c62828', '#1565c0', '#2e7d32']
};

const ColorPickerGroup = ({ 
    label, 
    color, 
    onChange,
    colorType = 'jersey'
  }: { 
    label: string; 
    color: string; 
    onChange: (color: string) => void;
    colorType?: 'jersey' | 'text';
  }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [tempColor, setTempColor] = useState(color);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setTempColor(color);
    }, [color]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isPickerOpen && 
            pickerRef.current && 
            !pickerRef.current.contains(event.target as Node) &&
            triggerRef.current &&
            !triggerRef.current.contains(event.target as Node)) {
          handleCancel();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isPickerOpen]);

    const handleOpen = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPopupPosition({
          top: rect.bottom + window.scrollY,
          left: Math.min(rect.left, window.innerWidth - 230)
        });
      }
      setIsPickerOpen(true);
      setTempColor(color);
    };

    const handleCancel = () => {
      setIsPickerOpen(false);
      setTempColor(color);
    };

    const handleConfirm = () => {
      onChange(tempColor);
      setIsPickerOpen(false);
    };

    return (
      <ColorGroup>
        <ColorGroupTitle>{label}</ColorGroupTitle>
        <PresetSwatches>
          {presetColors[colorType].map((presetColor) => (
            <PresetSwatch
              key={presetColor}
              color={presetColor}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </PresetSwatches>
        <CurrentColor>
          <span>{color}</span>
          <div style={{ backgroundColor: color }} />
        </CurrentColor>

        <CustomColorSection>
          <ColorPickerTrigger
            ref={triggerRef}
            color={color}
            onClick={handleOpen}
          />
          
          <ColorPickerPopup 
            ref={pickerRef}
            isOpen={isPickerOpen}
            style={{
              top: popupPosition.top,
              left: popupPosition.left
            }}
          >
            <ColorPickerContainer>
              <HexColorPicker color={tempColor} onChange={setTempColor} />
              <HexInput
                type="text"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                placeholder="#000000"
              />
              <ColorPickerButtons>
                <ColorPickerButton onClick={handleCancel}>
                  Cancel
                </ColorPickerButton>
                <ColorPickerButton variant="primary" onClick={handleConfirm}>
                  OK
                </ColorPickerButton>
              </ColorPickerButtons>
            </ColorPickerContainer>
          </ColorPickerPopup>
        </CustomColorSection>
      </ColorGroup>
    );
  };

type TabType = 'jersey' | 'text';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('jersey');
  const [jerseyColors, setJerseyColors] = useState<JerseyColors>({
    body: '#1a237e',
    sleeves: '#1a237e',
    collar: '#ffffff',
    numberColor: '#ffffff'
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

  return (
    <AppContainer>
      <CustomizationPanel>
        <Title>Jersey Customizer</Title>
        
        <TabContainer>
          <TabButtons>
            <TabButton 
              active={activeTab === 'jersey'} 
              onClick={() => setActiveTab('jersey')}
            >
              Jersey Colors
            </TabButton>
            <TabButton 
              active={activeTab === 'text'} 
              onClick={() => setActiveTab('text')}
            >
              Number & Position
            </TabButton>
          </TabButtons>

          {activeTab === 'jersey' && (
            <Section>
              <SectionTitle>Jersey Colors</SectionTitle>
              <ColorPickerGroup
                label="Body Color"
                color={jerseyColors.body}
                onChange={handleColorChange('body')}
                colorType="jersey"
              />
              <ColorPickerGroup
                label="Sleeves Color"
                color={jerseyColors.sleeves}
                onChange={handleColorChange('sleeves')}
                colorType="jersey"
              />
              <ColorPickerGroup
                label="Collar Color"
                color={jerseyColors.collar}
                onChange={handleColorChange('collar')}
                colorType="text"
              />
            </Section>
          )}

          {activeTab === 'text' && (
            <>
              <Section>
                <SectionTitle>Jersey Number</SectionTitle>
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

              <Section>
                <SectionTitle>Number Color</SectionTitle>
                <ColorPickerGroup
                  label="Number Color"
                  color={jerseyColors.numberColor}
                  onChange={handleColorChange('numberColor')}
                  colorType="text"
                />
              </Section>
            </>
          )}
        </TabContainer>
      </CustomizationPanel>

      <PreviewPanel>
        <Jersey
          colors={jerseyColors}
          number={number}
          transform={transform}
        />
      </PreviewPanel>
    </AppContainer>
  );
}

export default App;
