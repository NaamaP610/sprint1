'use strict'

function buildBoard() {
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

  // console.log(board);
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
          ${cell.isMine ? '💣' : cell.minesAroundCount === 0 ? ' ' : cell.minesAroundCount} 
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



function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}
