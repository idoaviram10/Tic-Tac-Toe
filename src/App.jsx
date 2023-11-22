import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./winning-combination";

const PLAYERS = {
	X: "Player 1",
	O: "Player 2",
};

const INITIAL_GAME_BOARD = [
	[null, null, null],
	[null, null, null],
	[null, null, null],
];

function deriveActivePlayer(gameTurns) {
	// Function to determine the active player based on game turns.
	let currentPlayer = "X";

	if (gameTurns.length > 0 && gameTurns[0].player === "X") {
		currentPlayer = "O";
	}

	return currentPlayer;
}

function deriveGameBoard(gameTurns) {
	// Function to update the game board based on game turns.
	let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

	for (const turn of gameTurns) {
		const { square, player } = turn;
		const { row, col } = square;

		gameBoard[row][col] = player;
	}

	return gameBoard;
}

function deriveWinner(gameBoard, players) {
	// Function to check for a winner based on the game board state.
	let winner;

	for (const combination of WINNING_COMBINATIONS) {
		const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
		const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
		const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

		if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) {
			winner = players[firstSquareSymbol];
		}
	}

	return winner;
}

function App() {
	const [players, setPlayers] = useState(PLAYERS);
	const [gameTurns, setGameTurns] = useState([]);

	const activePlayer = deriveActivePlayer(gameTurns);
	const gameBoard = deriveGameBoard(gameTurns);
	const winner = deriveWinner(gameBoard, players);
	const hasDraw = gameTurns.length === 9 && !winner;

	function handleSelectSquare(rowIndex, colIndex) {
		// Handles the event when a square on the board is selected.
		setGameTurns((prevTurns) => {
			const activePlayer = deriveActivePlayer(prevTurns);
			let currentPlayer = "X";

			if (prevTurns.length > 0 && prevTurns[0].player === "X") {
				currentPlayer = "O";
			}

			const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...prevTurns];

			return updatedTurns;
		});
	}

	function handleRematch() {
		// Resets the game turns for a new match.
		setGameTurns([]);
	}

	function handlePlayerNameChange(symbol, newName) {
		// Updates player names based on user input.
		setPlayers((prevPlayers) => {
			return {
				...prevPlayers,
				[symbol]: newName,
			};
		});
	}

	return (
		// Main component rendering the game UI.
		<main>
			<div id="game-container">
				<ol id="players" className="highlight-player">
					<Player initialName={PLAYERS.X} symbol="X" isActive={activePlayer === "X"} onChangeName={handlePlayerNameChange} />
					<Player initialName={PLAYERS.O} symbol="O" isActive={activePlayer === "O"} onChangeName={handlePlayerNameChange} />
				</ol>
				{(winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch} />}
				<GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
			</div>
			<Log turns={gameTurns} />
		</main>
	);
}

export default App;
