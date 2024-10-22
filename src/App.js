import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [character, setCharacter] = useState('');
  const [scenario, setScenario] = useState('');
  const [scene, setScene] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [finalMessage, setFinalMessage] = useState('');
  const [adventureLog, setAdventureLog] = useState([]);

  const startAdventure = async () => {
    try {
      const response = await axios.post('http://localhost:3001/start', { character });
      const { message, scene, optionA, optionB } = response.data;

      setScenario(message);
      setScene(scene);
      setOptionA(optionA);
      setOptionB(optionB);
      setAdventureLog([message, scene]);
    } catch (error) {
      console.error('Error starting adventure:', error);
    }
  };

  const makeChoice = async (choice) => {
    try {
      const response = await axios.post('http://localhost:3001/adventure', { choice });
      const { scene, optionA, optionB, finalMessage } = response.data;

      setScene(scene);
      setAdventureLog((prev) => [...prev, scene]);

      if (finalMessage) {
        setFinalMessage(finalMessage);
        setOptionA('');
        setOptionB('');
      } else {
        setOptionA(optionA);
        setOptionB(optionB);
      }
    } catch (error) {
      console.error('Error making choice:', error);
    }
  };

  return (
    <div className="App">
      <h1>Magical Forest Adventure</h1>

      {!character && (
        <div>
          <h2>Choose Your Character</h2>
          <button onClick={() => setCharacter('Elf')}>Elf</button>
          <button onClick={() => setCharacter('Fairy')}>Fairy</button>
          <button onClick={() => setCharacter('Troll')}>Troll</button>
          <button onClick={() => setCharacter('Talking Animal')}>Talking Animal</button>
        </div>
      )}

      {character && !scenario && (
        <button onClick={startAdventure}>Start Adventure</button>
      )}

      {scenario && (
        <div>
          <h2>{scenario}</h2>
          <p>{scene}</p>

          {!finalMessage ? (
            <div>
              {optionA && <button onClick={() => makeChoice('A')}>{optionA}</button>}
              {optionB && <button onClick={() => makeChoice('B')}>{optionB}</button>}
            </div>
          ) : (
            <div className="adventure-complete">
              <h2>Adventure Complete!</h2>
              <p>{finalMessage}</p>
            </div>
          )}
        </div>
      )}

      <div className="adventure-log">
        <h2>Adventure Log</h2>
        {adventureLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default App;
