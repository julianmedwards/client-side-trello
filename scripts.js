const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

const BoardObj = function () {
    this.boardDiv = document.getElementById('board')
    this.lanes = {}
    this.toggleAddingLane = toggleAddingLane
    this.addLane = addLane
    this.addCard = addCard
    this.buttons = initBtns(this)
    this.activateInput = activateInput
}

function initBtns(board) {
    let buttons = document.getElementsByName('add-btn')
    for (let button of buttons) {
        if ((button.parentElement = board.boardDiv)) {
            button.lastElementChild.addEventListener('click', function () {
                board.toggleAddingLane(this)
            })
        } else {
            button.addEventListener('click', board.addCard)
        }
    }
    return buttons
}

function activateInput(element, funct) {
    if (!element.getAttribute('data-type-keypress')) {
        element.setAttribute('data-type-keypress', 'addLane')
        element.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Enter pressed')
                funct(this)
            }
        })
    }
}

function toggleAddingLane(button) {
    toggleVisiblity(button.previousElementSibling)
    button.previousElementSibling.firstElementChild.focus()
    toggleIcon(button, icons.plus, icons.times)
    // Should fix this to use a variable board in the argument for
    // the addLane function.
    activateInput(
        button.previousElementSibling.firstElementChild,
        board01.addLane
    )
}

// Issue: If you mash enter while creating a lane it'll attempt to register
// the enter input and create a lane after it's reset the input but before
// the input is hidden/not in focus.
function addLane(input) {
    console.log('Adding a lane!')
    let laneName = input.value
    if (laneName !== '') {
        input.parentElement.reset()
        let newLane = document.createElement('div')
        newLane.classList.add('lane', 'round')
        input.parentElement.parentElement.before(newLane)

        let laneHead = document.createElement('div')
        let laneTitle = document.createElement('p')
        laneTitle.textContent = laneName
        laneHead.append(laneTitle)
        newLane.append(laneHead)

        let addCardBtn = document.createElement('div')
        addCardBtn.classList.add('add-new', 'round')
        addCardBtn.setAttribute('name', 'add-btn')
        newLane.append(addCardBtn)

        toggleAddingLane(input.parentElement.nextElementSibling)
    } else {
        alert('Please add a name to create a new lane.')
    }
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
