import { useState } from "react";

type SquareProps = {
  value: string | number | null;
  onSquareClick: () => void;
  isWinningSquare: boolean;
};

function Square({ value, onSquareClick, isWinningSquare }: SquareProps) {
  return (
    <button
      className={`square ${isWinningSquare ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: Array<number> | Array<string>) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }
  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else if (move === currentMove) {
      description = "You are at move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move == currentMove ? (
          description
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}{" "}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({
  xIsNext,
  squares,
  onPlay,
}: {
  xIsNext: boolean;
  squares: Array<number> | Array<string>;
  onPlay: (nextSquares: Array<number> | Array<string>) => void;
}) {
  const winner = calculateWinner(squares);
  console.log("winner: ", winner);
  const winningLine = winner?.line ?? [];
  const isDraw = squares.every(Boolean) && !winner?.winner;

  const status = winner
    ? "Winner: " + winner.winner
    : isDraw
    ? "Draw! No winner."
    : "Next player: " + (xIsNext ? "X" : "O");

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const boardRows = [0, 1, 2].map((row) => (
    <div key={row} className="board-row">
      {[0, 1, 2].map((col) => {
        const index = row * 3 + col;
        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinningSquare={winningLine.includes(index)}
          />
        );
      })}
    </div>
  ));
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}
function calculateWinner(squares: Array<number> | Array<string>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
