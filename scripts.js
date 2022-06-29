const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

const BoardObj = function () {
    this.boardDiv = document.getElementById('board')
    this.lanes = {}
    this.toggleAdding = toggleAdding
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
                board.toggleAdding(this)
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

function advanceCursor(currInput) {
    if ((currInput.nextElementSibling.tagName = 'input')) {
        currInput.nextElementSibling.focus()
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

function toggleAdding(button) {
    if (button.parentElement.parentElement.classList.contains('lane')) {
        toggleVisiblity(button.nextElementSibling)
        toggleIcon(button, icons.plus, icons.times)
        activateInput(button.nextElementSibling.firstElementChild, () => {
            advanceCursor(button.nextElementSibling.firstElementChild)
        })
        activateInput(button.nextElementSibling.lastElementChild, addCard)
        button.nextElementSibling.firstElementChild.focus()
    } else if (button.parentElement.parentElement.id === 'board') {
        toggleVisiblity(button.previousElementSibling)
        toggleIcon(button, icons.plus, icons.times)
        // Should fix this to use a variable board in the argument for
        // the addLane function.
        activateInput(button.previousElementSibling.firstElementChild, addLane)
        button.previousElementSibling.firstElementChild.focus()
    }
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
        buttons.classList.add('editing-buttons')
        let rightIcon = document.createElement('i')
        rightIcon.setAttribute('name', 'right')
        rightIcon.classList.add('fas', 'fa-angle-right')
        let leftIcon = document.createElement('i')
        leftIcon.setAttribute('name', 'left')
        leftIcon.classList.add('fas', 'fa-angle-left')
        let editIcon = document.createElement('i')
        editIcon.classList.add('fas', 'fa-edit')
        let delIcon = document.createElement('i')
        delIcon.classList.add('fas', 'fa-trash-alt')
        let midIcons = document.createElement('div')
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

        let cardContainer = document.createElement('div')
        cardContainer.classList.add('card-container', 'round')
        newLane.append(cardContainer)

        let addCardBtn = document.createElement('div')
        addCardBtn.classList.add('add-new', 'round')
        addCardBtn.setAttribute('name', 'add-btn')
        let addCardIcon = document.createElement('i')
        addCardIcon.classList.add('fas', 'fa-plus')
        addCardIcon.setAttribute('name', 'add-icon')
        let addCardForm = document.createElement('form')
        addCardForm.classList.add('hidden')
        addCardForm.setAttribute('name', 'add-form')
        addCardForm.setAttribute('onsubmit', 'return false')
        let addCardName = document.createElement('input')
        addCardName.setAttribute('placeholder', 'Name your card.')
        let addCardDescr = document.createElement('input')
        addCardDescr.setAttribute('placeholder', 'Add a card description.')

        addCardForm.append(addCardName, addCardDescr)
        addCardBtn.append(addCardIcon, addCardForm)
        newLane.append(addCardBtn)

        activateButton(addCardIcon, toggleAdding)

        toggleAdding(input.parentElement.nextElementSibling)
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

function delLane(btn) {
    let msg = 'Are you sure you want to delete this swim lane?'
    if (confirm(msg)) {
        btn.parentElement.parentElement.parentElement.remove()
    } else console.log('Lane delete aborted.')
}

function addCard(descrInput) {
    let cardName = descrInput.previousElementSibling.value
    if (cardName != '') {
        let cardDescr = descrInput.value
        let cardContainer =
            descrInput.parentElement.parentElement.previousElementSibling

        let newCard = document.createElement('div')
        newCard.classList.add('card', 'round')

        let buttons = document.createElement('div')
        buttons.classList.add('editing-buttons')
        let leftIcon = document.createElement('i')
        leftIcon.setAttribute('name', 'left')
        leftIcon.classList.add('fas', 'fa-angle-left')
        let upIcon = document.createElement('i')
        upIcon.setAttribute('name', 'up')
        upIcon.classList.add('fas', 'fa-angle-up')
        let downIcon = document.createElement('i')
        downIcon.setAttribute('name', 'down')
        downIcon.classList.add('fas', 'fa-angle-down')
        let rightIcon = document.createElement('i')
        rightIcon.setAttribute('name', 'right')
        rightIcon.classList.add('fas', 'fa-angle-right')
        let editIcon = document.createElement('i')
        editIcon.classList.add('fas', 'fa-edit')
        let delIcon = document.createElement('i')
        delIcon.classList.add('fas', 'fa-trash-alt')
        let midIcons = document.createElement('div')
        midIcons.append(editIcon, delIcon)
        buttons.append(leftIcon, upIcon, midIcons, downIcon, rightIcon)
        newCard.append(buttons)

        activateButton(leftIcon, moveCard)
        activateButton(rightIcon, moveCard)
        activateButton(upIcon, moveCard)
        activateButton(downIcon, moveCard)
        activateButton(editIcon, editCard)
        activateButton(delIcon, delCard)

        let cardHead = document.createElement('div')
        cardHead.classList.add('card-head')
        let cardTitle = document.createElement('p')
        cardTitle.textContent = cardName

        let cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        let cardDescrEl = document.createElement('p')
        cardDescrEl.textContent = cardDescr

        cardHead.append(cardTitle)
        cardBody.append(cardDescrEl)
        newCard.append(cardHead, cardBody)

        cardContainer.append(newCard)

        toggleAdding(descrInput.parentElement.previousElementSibling)
        descrInput.parentElement.reset()
    } else {
        alert('Please add a name to create a card.')
    }
}

function moveCard(btn) {
    let card = btn.parentElement.parentElement
    switch (btn.getAttribute('name')) {
        case 'up':
            let prevCard = card.previousElementSibling
            if (prevCard) {
                prevCard.before(card)
            } else {
                console.log('Card already at top.')
            }
            break
        case 'down':
            let nextCard = card.nextElementSibling
            if (nextCard) {
                nextCard.after(card)
            } else {
                console.log('Card already at bottom.')
            }
            break
        case 'left':
            let prevLane =
                card.parentElement.parentElement.previousElementSibling
            if (prevLane && prevLane.classList.contains('lane')) {
                let prevLaneCards = prevLane.querySelector('.card-container')
                prevLaneCards.append(card)
            } else {
                console.log('No lane on the left to move card to.')
            }
            break
        case 'right':
            let nextLane = card.parentElement.parentElement.nextElementSibling
            if (nextLane && nextLane.classList.contains('lane')) {
                let nextLaneCards = nextLane.querySelector('.card-container')
                nextLaneCards.append(card)
            } else {
                console.log('No lane on the right to move card to.')
            }
            break
    }
}
function editCard(btn) {
    console.log('edit card')
}
function delCard(btn) {
    console.log('Del card')
}

function replaceText(input, textEl) {
    textEl.textContent = input.value
    textEl.style.display = 'revert'
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
