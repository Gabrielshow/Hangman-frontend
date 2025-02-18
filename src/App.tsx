import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [game, setGame] = useState({
        display: '',
        lives: 6,
        end_of_game: false
    });

    const [guess, setGuess] = useState('');

    useEffect(() => {
        // Start the game when the app loads
        axios.get('http://localhost:5000/start')
            .then(response => {
                setGame(response.data);
            });
    }, []);

    const handleGuess = async () => {
        if (guess.length === 1 && /^[a-zA-Z]$/.test(guess)) {
            const response = await axios.post('http://localhost:5000/guess', { letter: guess });
            setGame(response.data);
            setGuess('');
        } else {
            alert('Please enter a valid letter!');
        }
    };

    return (
        <div>
            <h1>Hangman Game</h1>
            <p>Word: {game.display}</p>
            <p>Lives left: {game.lives}</p>
            {game.end_of_game && <p>{game.message || 'Game Over!'}</p>}
            <input 
                type="text" 
                value={guess} 
                onChange={(e) => setGuess(e.target.value)} 
                maxLength="1"
            />
            <button onClick={handleGuess} disabled={game.end_of_game}>
                Guess
            </button>
        </div>
    );
};

export default App;
