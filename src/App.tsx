import React, { useState } from 'react';
import Jersey from './components/Jersey';
import ColorPicker from './components/UI/ColorPicker';
import Input from './components/UI/Input';
import { JerseyColors, TextTransform, JerseyText } from './types/jersey';
import styles from './styles/App.module.css';

type TabType = 'jersey' | 'number' | 'name';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('jersey');
  const [jerseyColors, setJerseyColors] = useState<JerseyColors>({
    body: '#1a237e',
    sleeves: '#1a237e',
    collar: '#ffffff',
    numberColor: '#ffffff',
    nameColor: '#ffffff',
  });

  const [number, setNumber] = useState<string>('23');
  const [numberTransform, setNumberTransform] = useState<TextTransform>({
    position: [0, 0.15, 0.01],
    rotation: 0,
    scale: 0.35
  });

  const [name, setName] = useState<JerseyText>({
    content: '',
    transform: {
      position: [0, 0.3, 0.01],
      rotation: 0,
      scale: 0.4
    },
    isBack: true
  });

  const handleColorChange = (colorKey: keyof JerseyColors) => (color: string) => {
    setJerseyColors((prev) => ({
      ...prev,
      [colorKey]: color,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
    setNumber(value);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.customizationPanel}>
        <h1 className={styles.title}>Customize Your Jersey</h1>
        
        <div className={styles.tabContainer}>
          <div className={styles.tabButtons}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'jersey' ? styles.active : ''}`}
              onClick={() => setActiveTab('jersey')}
            >
              Jersey Colors
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'number' ? styles.active : ''}`}
              onClick={() => setActiveTab('number')}
            >
              Number
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'name' ? styles.active : ''}`}
              onClick={() => setActiveTab('name')}
            >
              Name
            </button>
          </div>

          {activeTab === 'jersey' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Jersey Colors</h2>
              <ColorPicker
                label="Body Color"
                color={jerseyColors.body}
                onChange={handleColorChange('body')}
              />
              <ColorPicker
                label="Sleeves Color"
                color={jerseyColors.sleeves}
                onChange={handleColorChange('sleeves')}
              />
              <ColorPicker
                label="Collar Color"
                color={jerseyColors.collar}
                onChange={handleColorChange('collar')}
              />
            </div>
          )}

          {activeTab === 'number' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Number</h2>
              <Input
                type="text"
                label="Enter Number (0-99)"
                value={number}
                onChange={handleNumberChange}
                placeholder="Enter Number"
              />
              <ColorPicker
                label="Number Color"
                color={jerseyColors.numberColor}
                onChange={handleColorChange('numberColor')}
              />
              <Input
                type="range"
                label="Position X"
                value={numberTransform.position[0]}
                onChange={(e) =>
                  setNumberTransform((prev) => ({
                    ...prev,
                    position: [parseFloat(e.target.value), prev.position[1], prev.position[2]],
                  }))
                }
                min={-1}
                max={1}
                step={0.01}
              />
              <Input
                type="range"
                label="Position Y"
                value={numberTransform.position[1]}
                onChange={(e) =>
                  setNumberTransform((prev) => ({
                    ...prev,
                    position: [prev.position[0], parseFloat(e.target.value), prev.position[2]],
                  }))
                }
                min={-0.5}
                max={0.5}
                step={0.01}
              />
              <Input
                type="range"
                label="Rotation"
                value={numberTransform.rotation}
                onChange={(e) =>
                  setNumberTransform((prev) => ({
                    ...prev,
                    rotation: parseFloat(e.target.value),
                  }))
                }
                min={-180}
                max={180}
                step={1}
              />
              <Input
                type="range"
                label="Scale"
                value={numberTransform.scale}
                onChange={(e) =>
                  setNumberTransform((prev) => ({
                    ...prev,
                    scale: parseFloat(e.target.value),
                  }))
                }
                min={0.1}
                max={2}
                step={0.01}
              />
            </div>
          )}

          {activeTab === 'name' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Name</h2>
              <Input
                type="text"
                label="Enter Name"
                value={name.content}
                onChange={(e) =>
                  setName((prev) => ({
                    ...prev,
                    content: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="Enter Name"
              />
              <ColorPicker
                label="Name Color"
                color={jerseyColors.nameColor}
                onChange={handleColorChange('nameColor')}
              />
              <Input
                type="range"
                label="Position Y"
                value={name.transform.position[1]}
                onChange={(e) =>
                  setName((prev) => ({
                    ...prev,
                    transform: {
                      ...prev.transform,
                      position: [prev.transform.position[0], parseFloat(e.target.value), prev.transform.position[2]],
                    },
                  }))
                }
                min={-0.5}
                max={0.5}
                step={0.01}
              />
              <Input
                type="checkbox"
                label="Show on Back"
                value={name.isBack}
                onChange={(e) =>
                  setName((prev) => ({
                    ...prev,
                    isBack: e.target.checked,
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>

      <div className={styles.previewPanel}>
        <Jersey
          colors={jerseyColors}
          number={number}
          numberTransform={numberTransform}
          name={name}
        />
      </div>
    </div>
  );
}

export default App;
