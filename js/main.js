'use strict'


var gBoard
var gLevel = {
    SIZE: 4,
    MINES: 2
}

const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true,
}
  
function onInit (){
    gBoard = buildBoard()
    renderBoard(gBoard, '.board-container')

    gGame.isOn = true
    gGame.coveredCount = 0
    gGame.markedCount = 0
    gGame.isFirstClick = true
    console.log('game!');

    var elSmileyBt = document.querySelector('.smiley-btn')
    elSmileyBt.innerText = '😃'
    
}

function buildBoard(){
    var size = gLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false,              
            }  
        }
    }

    // board[3][2].isMine = true
    // board[2][3].isMine = true

    // setRandMine(gLevel.MINES , board)

    console.log(board);
    return board
}

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j} ${cell.isCovered ? 'covered' : 'revealed'}`

            strHTML += `<td class="${className}" onclick="onCellClicked(event, ${i}, ${j})" oncontextmenu="onCellClicked(event, ${i}, ${j})">
            ${cell.isMine ? '💣' : cell.minesAroundCount} 
            </td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
    elContainer.addEventListener("contextmenu", (e) => {
            e.preventDefault();
    })
}

function setMinesNegsCount(cellI ,cellJ, board){
    var negsCount = 0 

    for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= board.length) continue
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= board[i].length) continue
			if (i === cellI && j === cellJ) continue
			if (board[i][j].isMine) negsCount++
		}
	}
	return negsCount
}

function onCellClicked(event, i, j){
    if (!gGame.isOn) return
    
    if (gGame.isFirstClick){
        handelFirstClick(i,j)
    }
      
    var elCell = document.querySelector(`.cell-${i}-${j}`)
    console.log(i, j);
    var cerCell = gBoard[i][j]
    
    if (event.button === 0 && !gBoard[i][j].isMarked){
        onCellRevel(elCell, i, j)
        expandUncover(gBoard, i, j )
        if (cerCell.isMine){
            exposeMines(gBoard)
            checkGameOver(false)
        } 

    } else if (event.button === 2){
        onCellMarked(elCell, i, j)
    }
    
    var totalSafeCells = (gLevel.SIZE**2) - gLevel.MINES 
    if (gGame.coveredCount === totalSafeCells && countMarkedMinds(gBoard)){
        checkGameOver(true)
    }
}

function handelFirstClick(i, j) {
    gGame.isFirstClick = false
    setRandMine(gLevel.MINES , gBoard, {i , j}) 
    
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j, gBoard);
        }
    }
    
    renderBoard(gBoard, '.board-container')
}


function onCellMarked(elCell , i ,j ){
    if (!gBoard[i][j].isCovered) return
    
    if (!gBoard[i][j].isMarked){
        gBoard[i][j].isMarked = true
        gGame.markedCount++
        
        elCell.classList.remove('covered')
        elCell.classList.add('flagged')
        elCell.innerText = '🚩'

    } else if (gBoard[i][j].isMarked){
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        
        elCell.classList.remove('flagged')
        elCell.classList.add('covered')
        elCell.innerText = gBoard[i][j].minesAroundCount
    }
} 

function onCellRevel(elCell , i ,j ){
    if (gBoard[i][j].isMarked) return
    if (!gBoard[i][j].isCovered) return
    gBoard[i][j].isCovered = false
    gGame.coveredCount++
    console.log(gGame.coveredCount);

    elCell.classList.remove('covered')
    elCell.classList.add('revealed')
}

function expandUncover(board, i, j){
    if (board[i][j].minesAroundCount === 0){
        for (var x = i - 1; x <= i + 1; x++) {
            if (x < 0 || x >= board.length) continue
            for (var y = j - 1; y <= j + 1; y++) {
                if (y < 0 || y >= board[i].length) continue
                var NeighborCell = document.querySelector(`.cell-${x}-${y}`)
                if(!board[x][y].isCovered) continue
                onCellRevel(NeighborCell , x, y )
            }
        }
    }
}

function exposeMines(board){
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                onCellRevel(elCell, i, j)
                elCell.classList.add('mine')
            }
        }
    }
}

function countMarkedMinds(board){
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine && !board[i][j].isMarked) return false
        }
    }

    return true
}

function setRandMine(level, board, firstClickPos) {
    let placedMines = 0

    while (placedMines < level) {
        var randI = getRandomInt(0, board.length)
        var randJ = getRandomInt(0, board[0].length)

        if (randI === firstClickPos.i && randJ === firstClickPos.j) continue
        
        if (!board[randI][randJ].isMine) {
            board[randI][randJ].isMine = true
            placedMines++
        }
    }
}


function checkGameOver(isWin) {
    gGame.isOn = false

    const smileyBtn = isWin ? '😎' : '🤯'
    var elSmileyBt = document.querySelector('.smiley-btn')
    elSmileyBt.innerText = smileyBtn
}

function onDifficultyClick(elBtn) {
    gLevel.SIZE = +elBtn.dataset.size
    gLevel.MINES = +elBtn.dataset.mine
    console.log(gLevel);
    onInit()
}


