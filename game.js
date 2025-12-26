let initialState = {
    board,
    score: 0,
    rows: 4,
    cols: 4,
}

const startBtn = document.getElementById("start");

startBtn.addEventListener('click', () => {
    startGame();
});

const startGame = () => {
    board = [
        [0, 0, 0, 0], 
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    board.forEach((row,i) => {
        row.forEach((col, j) => {
            let cell = document.createElement("div");
            cell.id = String(i) + "-" + String(j);
            let activeCell = board[i][j];
            updateCell(cell, activeCell);
            document.getElementById("board").append(cell);
        })
    });
    generateNew() //2'yi üretmeye yarar
    generateNew()
} 

const updateCell = (cell, activeCell) => {
    cell.innerText = ""
    cell.classList.value = ""
    cell.classList.add("cell")
    if(activeCell > 0){
        cell.innerText = String(activeCell)
        if(activeCell <= 4096){
            cell.classList.add("x" + String(activeCell))
        }else{
            cell.classList.add("x8192")
        }
    }
};

document.addEventListener("keyup", ({key}) => {
    switch (key) {
        case "w":
            for(let c=0; c<initialState.cols; c++){
                let row =[board[0][c], board[1][c], board[2][c], board[3][c]]
                row = slip(row)

                for(let r=0; r<initialState.rows; r++){
                    board[r][c] = row[r];
                    let cell = document.getElementById(String(r) + "-" + String(c));
                    let activeCell = board[r][c];
                    updateCell(cell, activeCell);
                }            
            }
            generateNew();
            break;
        case "a":
            for(let r =0; r< initialState.rows; r++){
                let row = board[r];
                row = slip(row)
                board[r] = row;
                
                for(let c=0; c<initialState.cols; c++){
                    let cell = document.getElementById(String(r) + "-" + String(c));
                    let activeCell = board[r][c];
                    updateCell(cell, activeCell);
                }
            }
              generateNew();
            break;
        case "s":
            for(let c=0; c<initialState.cols; c++){
                let row =[board[0][c], board[1][c], board[2][c], board[3][c]]
                row.reverse();
                row = slip(row)
                row.reverse();

                for(let r=0; r<initialState.rows; r++){
                    board[r][c] = row[r];
                    let cell = document.getElementById(String(r) + "-" + String(c));
                    let activeCell = board[r][c];
                    updateCell(cell, activeCell);
                }            
            }
            generateNew();
            break;
        case "d":
            for(let r =0; r< initialState.rows; r++){
                let row = board[r];
                row.reverse();
                row = slip(row)
                board[r] = row.reverse();
                
                for(let c=0; c<initialState.cols; c++){
                    let cell = document.getElementById(String(r) + "-" + String(c));
                    let activeCell = board[r][c];
                    updateCell(cell, activeCell);
                }
            }
              generateNew();
            break;
        default: 
            break;
    }
    document.getElementById("score").innerText = initialState.score;
});

const slip = (row) => {
    row = row.filter((activeCell) => activeCell != 0); //sıfırları atar
    for(let i=0; i<row.length-1; i++){
        if(row[i] == row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            initialState.score += row[i];
        }
    }
    row = row.filter((activeCell) => activeCell != 0);
    while(row.length < initialState.cols){
        row.push(0);
    }
    return row;
}

const generateNew = () => {
    if(!emptyCell()){
        return;
    }
    let found = false;
    while(!found){
        let r = Math.floor(Math.random() * initialState.rows);
        let c = Math.floor(Math.random() * initialState.cols);
        if(board[r][c] == 0){
            board[r][c] = 2;
            let cell = document.getElementById(String(r) + "-" + String(c))
            cell.innerText = "2";
            cell.classList.add("x2");
            found = true;
        }
    }
}

const emptyCell =() => {
    let count = 0;
    for(let r=0; r < initialState.rows; r++){
        for(let c=0; c < initialState.cols; c++){
            if(board[r][c] == 0){
                return true;
            }
        }
    }
    return false;
}
