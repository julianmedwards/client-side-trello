const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

const BoardObj = function () {
    this.boardDiv = document.getElementById('board')
    this.lanes = {}
    this.toggleAddingLane = toggleAddingLane
    this.addCard = addCard
    this.buttons = initBtns(this)
}

function initBtns(board) {
    let buttons = document.getElementsByName('add-btn')
    for (let button of buttons) {
        if ((button.parentElement = board.boardDiv)) {
            button.lastElementChild.addEventListener(
                'click',
                board.toggleAddingLane
            )
        } else {
            button.addEventListener('click', board.addCard)
        }
    }
    return buttons
}

function toggleAddingLane() {
    console.log('Preparing to add a lane!')
    toggleVisiblity(this.previousElementSibling)
    this.previousElementSibling['lane-name'].focus()
    toggleIcon(this, icons.plus, icons.times)
    // let newLane = document.createElement('div')
    // newLane.classList.add('lane')
    // this.before(newLane)
}

function addCard() {
    console.log('Add a card!')
}

function toggleVisiblity(element) {
    if (
        element.classList.contains('hidden') ||
        element.classList.contains('visible')
    ) {
        element.classList.toggle('hidden')
        element.classList.toggle('visible')
    } else {
        element.classList.add('hidden')
    }
}

function toggleIcon(iconEl, initIcon, altIcon) {
    if (iconEl.classList.contains(initIcon)) {
        iconEl.classList.replace(initIcon, altIcon)
    } else {
        iconEl.classList.replace(altIcon, initIcon)
    }
}

const board01 = new BoardObj()
