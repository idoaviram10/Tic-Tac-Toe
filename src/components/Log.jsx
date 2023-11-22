export default function Log({ turns }) {
	// Component to display the log of game turns.
	return (
		<ol id="log">
			{turns.map((turn) => (
				<li key={`${turn.square.row}${turn.square.col}`}>
					{turn.player} selected {turn.square.row},{turn.square.col}
				</li>
			))}
		</ol>
	);
}
