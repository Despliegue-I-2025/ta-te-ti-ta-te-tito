const express = require('express');
const app = express();
const PORT = 3000;

// GET /move?board=[0,1,0,2,0,0,0,0,0]
app.get('/move', (req, res) => {
    let boardParam = req.query.board;
    let board;
    try {
        board = JSON.parse(boardParam);
    } catch (e) {
        return res.status(400).json({ error: 'Parámetro board inválido. Debe ser un array JSON.' });
    }
    if (!Array.isArray(board) || board.length !== 9) {
        return res.status(400).json({ error: 'El tablero debe ser un array de 9 posiciones.' });
    }

    const lines = [
        [0,1,2], [3,4,5], [6,7,8], // horizontales
        [0,3,6], [1,4,7], [2,5,8], // verticales
        [0,4,8], [2,4,6]           // diagonales
    ];

    // Función que intenta hacer 3 en raya o bloquear
    function findCritical(player) {
        for (let line of lines) {
            const [a,b,c] = line;
            const values = [board[a], board[b], board[c]];
            if (values.filter(v => v === player).length === 2 && values.includes(0)) {
                return line[values.indexOf(0)];
            }
        }
        return null;
    }

    // 1. Intentar ganar
    let move = findCritical(2);
    // 2. Bloquear al oponente
    if (move === null) move = findCritical(1);
    // 3. Si no hay jugada crítica, elegir al azar
    if (move === null) {
        const emptyPositions = board.map((v,i) => v===0 ? i : null).filter(i=>i!==null);
        if (emptyPositions.length === 0) {
            return res.status(400).json({ error: 'No hay movimientos disponibles.' });
        }
        move = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
    }

    board[move] = 2; // IA juega con 2
    res.json({ movimiento: move, tablero: board });
});

app.listen(PORT, () => {
    console.log(`Servidor de tateti escuchando en el puerto ${PORT}`);
});
