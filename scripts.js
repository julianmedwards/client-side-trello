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
    this.moveLane = moveLane
    this.editLane = editLane
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
        element.setAttribute('data-type-keypress', funct.name)
        element.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                console.log('Enter pressed')
                funct(this)
            }
        })
    }
}

function activateButton(element, funct) {
    if (!element.getAttribute('data-type-click')) {
        element.setAttribute('data-type-click', funct.name)
        element.addEventListener('click', () => {
            funct(element)
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

function addLane(input) {
    console.log('Adding a lane!')
    let laneName = input.value
    if (laneName !== '') {
        input.parentElement.reset()

        let newLane = document.createElement('div')
        newLane.classList.add('lane', 'round')
        input.parentElement.parentElement.before(newLane)

        let buttons = document.createElement('div')
        buttons.classList.add('lane-btns')
        let rightIcon = document.createElement('i')
        rightIcon.setAttribute('name', 'right')
        rightIcon.classList.add('fas', 'fa-angle-right')
        let leftIcon = document.createElement('i')
        leftIcon.setAttribute('name', 'left')
        leftIcon.classList.add('fas', 'fa-angle-left')
        let midIcons = document.createElement('div')
        let editIcon = document.createElement('i')
        editIcon.classList.add('fas', 'fa-edit')
        let delIcon = document.createElement('i')
        delIcon.classList.add('fas', 'fa-trash-alt')
        midIcons.append(editIcon, delIcon)
        buttons.append(leftIcon, midIcons, rightIcon)
        newLane.append(buttons)

        activateButton(rightIcon, moveLane)
        activateButton(leftIcon, moveLane)
        activateButton(editIcon, editLane)
        activateButton(delIcon, delLane)

        let laneHead = document.createElement('div')
        laneHead.classList.add('lane-head')
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

function moveLane(moveBtn) {
    let lane = moveBtn.parentElement.parentElement
    if (moveBtn.getAttribute('name') === 'left') {
        let prev = lane.previousElementSibling
        if (prev) {
            lane.previousElementSibling.before(lane)
        } else {
            console.log('Lane is already at beginning of list.')
        }
    } else {
        let next = lane.nextElementSibling
        if (!next.getAttribute('name', 'add-btn')) {
            next.after(lane)
        } else console.log('Lane has reached end of list.')
    }
}

function editLane(btn) {
    let headDiv = btn.parentElement.parentElement.nextElementSibling
    let headEl = headDiv.firstElementChild
    headEl.style.display = 'none'
    let name = headEl.textContent

    let input = document.createElement('input')
    input.type = 'text'
    input.value = name

    activateInput(input, () => {
        replaceText(input, headEl)
    })
    headDiv.append(input)
    input.focus()
}

function delLane(btn) {}

function addCard() {
    console.log('Add a card!')
}

function replaceText(input, textEl) {
    textEl.textContent = input.value
    textEl.style.display = 'initial'
    input.remove()
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
