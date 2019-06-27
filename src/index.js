import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style ={props.hightlight ? {"background":"#00ff00"}:{}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} index={i} key={i} hightlight={this.props.winner && this.props.winner.includes(i)}
            onClick={() => this.props.onClick(i)} />
    }
    render() {
        const numberOfSquare = 3;
        const rows = [...Array(numberOfSquare).keys()];
        const cols = [...Array(numberOfSquare).keys()];
        return (
            <div>
                {rows.map(row => 
                <div className="board-row" key={row}>{cols.map(col => this.renderSquare(row *3 +col))}</div>)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{ squares: Array(9).fill(null) }],
            xIsNext: true,
            stepNumber: 0,
            point: null,
        }
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const y = i % 3;
        const x = Math.floor(i / 3);
        this.setState({
            history: history.concat([{
                squares: squares,
                point: "(" + x + "," + y + ")"
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    replay() {
        let that = this
        this.state.history.map((_, i) => setTimeout(() => that.jumpTo(i), (i + 1) * 1000))
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares)
        const style = { 'fontWeight': 'bold' }
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + step.point :
                'Go to game start';
            return (
                <li key={move}>
                    <button style={move === this.state.stepNumber ? style : {}} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}  winner={winner}/>
                </div>
                <div className="game-info">
                    <button onClick={() => this.replay()}>{"===>Replay<==="}</button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================
function calculateWinner(squares) {
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
            return lines[i];
        }
    }
    return null;
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
