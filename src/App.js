import { useState } from 'react';
import './App.css'; 

function Square({ value, onSquareClick }) {
  const colorClass = value === 'X' ? 'x-text' : 'o-text';
  return (
    <button className={`square ${colorClass}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `¡Ganador: ${winner === 'X' ? 'P1' : 'P2'}! 🏆`;
  } else if (!squares.includes(null)) {
    status = '¡Empate! 🤝';
  } else {
    // Texto corto adentro
    status = 'Turno de: ' + (xIsNext ? 'P1' : 'P2');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="main-container">
      <h1 className="game-title">TIC TAC TOE</h1>
      
      <div className="game-layout">
        {/* PANEL LATERAL DE JUGADORES */}
        <div className="players-panel">
          <h3>Jugadores</h3>
          <div className={`player-card ${xIsNext ? 'active' : ''}`}>
             <span className="p-label">P1:</span> <span className="x-text">X</span>
          </div>
          <div className={`player-card ${!xIsNext ? 'active' : ''}`}>
             <span className="p-label">P2:</span> <span className="o-text">O</span>
          </div>
        </div>

        {/* TABLERO CENTRAL */}
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          <button className="reset-btn" onClick={resetGame}>
            Volver a jugar 🔄
          </button>
        </div>

        {/* PANEL DE HISTORIAL */}
        <div className="game-info">
          <h3>Historial</h3>
          <ol>
            {history.map((_, move) => (
              <li key={move}>
                <button className="history-btn" onClick={() => setCurrentMove(move)}>
                  {move > 0 ? `Mov. #${move}` : 'Inicio'}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}