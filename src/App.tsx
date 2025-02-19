import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App: React.FC = () => {
    const [game, setGame] = useState({
        display: '',
        lives: 6,
        end_of_game: false,
        message: ''
    });

    const [guess, setGuess] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string>('');

    useEffect(() => {
        // Start the game when the app loads
        axios.get('http://localhost:5000/start')
            .then(response => {
                setGame(response.data);
            });
    }, []);

    const handleGuess = async () => {
        if (guess.length === 1 && /^[a-zA-Z]$/.test(guess)) {
            try {
                const response = await axios.post('http://localhost:5000/guess', { letter: guess });
                setGame(response.data);
                setGuess('');

                // Display win/loss message in a toast
                if (response.data.message) {
                    setToastMessage(response.data.message);
                }
            } catch (error) {
                console.error('Error during guess:', error);
            }
        } else {
            alert('Please enter a valid letter!');
        }
    };

    const handleNewGame = async () => {
        // Start a new game
        const response = await axios.get('http://localhost:5000/start');
        setGame(response.data);
        setToastMessage('');
    };

    return (
        <div className="game-container">
            <h1>Hangman Game</h1>

            <div className="game-info">
                <p>Word: {game.display}</p>
                <p>Lives left: {game.lives}</p>
                {game.end_of_game && <p>{game.message || 'Game Over!'}</p>}
            </div>

            <div className="guess-section">
                <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    maxLength={1}
                    disabled={game.end_of_game}
                    className="guess-input"
                />
                <button onClick={handleGuess} disabled={game.end_of_game} className="guess-button">
                    Guess
                </button>
            </div>

            <div className="new-game">
                <button onClick={handleNewGame} className="new-game-button">
                    New Game
                </button>
            </div>

            {toastMessage && (
                <div className="toast-message">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default App;
