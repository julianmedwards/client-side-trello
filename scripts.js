const BoardObj = function () {
    this.boardDiv = document.getElementById('board')
    this.lanes = {}
    this.addLane = addLane
    this.addCard = addCard
    this.buttons = initBtns(this)
}

function initBtns(board) {
    let buttons = document.getElementsByName('add-btn')
    for (let button of buttons) {
        if ((button.parentElement = board.boardDiv)) {
            button.addEventListener('click', board.addLane)
        } else {
            button.addEventListener('click', board.addCard)
        }
    }
    return buttons
}

function addLane() {
    console.log('Add a lane!')
}

function addCard() {
    console.log('Add a card!')
}

const board01 = new BoardObj()
