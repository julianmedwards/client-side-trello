const icons = {
    plus: 'fa-plus',
    times: 'fa-times',
}

const BoardObj = function () {
    this.boardDiv = document.getElementById('board')
    this.toggleAdding = toggleAdding
    this.buttons = initBtns(this)
}

function initBtns(board) {
    let buttons = document.getElementsByName('add-btn')
    for (let button of buttons) {
        if ((button.parentElement = board.boardDiv)) {
            button.lastElementChild.addEventListener('click', function () {
                board.toggleAdding(this)
            })
        } else {
            button.addEventListener('click', addCard)
        }
    }
    return buttons
}

function activateButton(element, funct) {
    if (!element.getAttribute('data-type-click')) {
        element.setAttribute('data-type-click', funct.name)
        element.addEventListener('click', () => {
            funct(element)
        })
    }
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

function advanceCursor(currInput, form) {
    let formEls = Array.from(form)
    let currIndex = formEls.indexOf(currInput)
    formEls[currIndex + 1].focus()
}

function replaceText(input, textEl, hiddenEl) {
    if (Array.isArray(input)) {
        for (let i = 0; i < input.length; i++) {
            textEl[i].textContent = input[i].value
            hiddenEl[i].style.display = ''
            input[i].remove()
        }
    } else {
        textEl.textContent = input.value
        hiddenEl.style.display = ''
        input.remove()
    }
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

function toggleAdding(button) {
    if (button.parentElement.parentElement.classList.contains('lane')) {
        toggleVisiblity(button.nextElementSibling)
        toggleIcon(button, icons.plus, icons.times)
        activateInput(button.nextElementSibling.firstElementChild, () => {
            advanceCursor(
                button.nextElementSibling.firstElementChild,
                button.nextElementSibling
            )
        })
        activateInput(button.nextElementSibling.lastElementChild, addCard)
        if (button.nextElementSibling.classList.contains('visible')) {
            setTimeout(function () {
                button.nextElementSibling.firstElementChild.focus()
            }, 100)
        } else {
            document.activeElement.blur()
        }
    } else if (button.parentElement.parentElement.id === 'board') {
        toggleVisiblity(button.previousElementSibling)
        toggleIcon(button, icons.plus, icons.times)
        activateInput(button.previousElementSibling.firstElementChild, addLane)
        if (button.previousElementSibling.classList.contains('visible')) {
            setTimeout(function () {
                button.previousElementSibling.firstElementChild.focus()
            }, 100)
        } else {
            document.activeElement.blur()
        }
    } else {
        console.error('Unexpected html structure when adding lane or card.')
    }

    // if (button.previousElementSibling.classList.contains('visible')) {
    //     setTimeout(function () {
    //         if (button.parentElement.parentElement.classList.contains('lane')) {
    //             button.nextElementSibling.firstElementChild.focus()
    //         } else {
    //             button.previousElementSibling.firstElementChild.focus()
    //         }
    //     }, 100)
    // }
}

function addLane(input) {
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
        replaceText(input, headEl, headEl)
    })
    headDiv.append(input)
    input.focus()
}

function delLane(btn) {
    let msg = 'Are you sure you want to delete this swim lane?'
    if (confirm(msg)) {
        let currLane = btn.parentElement.parentElement.parentElement
        let cards = currLane.querySelector('.card-container').children
        let lanes = document.getElementById('board').querySelectorAll('.lane')
        if (cards.length > 0 && lanes.length > 1) {
            let msg2 =
                'Would you like to move your cards to another lane before deleting?'
            if (confirm(msg2)) {
                selectLane = prompt(
                    "Enter a number for the lane you'd like to move the cards to. (left-to-right)"
                )
                if (lanes[selectLane - 1]) {
                    if (lanes[selectLane - 1] == currLane) {
                        alert(
                            "Please select a lane other than the one you're deleting."
                        )
                    } else {
                        for (let i = 0; cards[i] != null; ) {
                            lanes[selectLane - 1]
                                .querySelector('.card-container')
                                .append(cards[i])
                        }
                        currLane.remove()
                    }
                } else {
                    alert(
                        'No lane for ' +
                            selectLane +
                            ". If you'd like to move the cards to the leftmost lane, enter '1', and so on."
                    )
                }
            } else {
                btn.parentElement.parentElement.parentElement.remove()
            }
        } else {
            btn.parentElement.parentElement.parentElement.remove()
        }
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
    let headDiv = btn.parentElement.parentElement.nextElementSibling
    let bodyDiv = headDiv.nextElementSibling
    headDiv.style.display = 'none'
    bodyDiv.style.display = 'none'

    let headEl = headDiv.firstElementChild
    let bodyEl = bodyDiv.firstElementChild

    let name = headEl.textContent
    let descr = bodyEl.textContent

    let editForm = document.createElement('form')
    editForm.setAttribute('onsubmit', 'return false')
    let nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.value = name
    let descrInput = document.createElement('input')
    descrInput.type = 'text'
    descrInput.value = descr

    editForm.append(nameInput, descrInput)

    activateInput(nameInput, () => {
        advanceCursor(nameInput, nameInput.parentElement)
    })
    activateInput(descrInput, () => {
        replaceText(
            [nameInput, descrInput],
            [headEl, bodyEl],
            [headDiv, bodyDiv]
        )
    })
    headDiv.before(editForm)
    nameInput.focus()
}

function delCard(btn) {
    let msg = 'Are you sure you want to delete this card?'
    if (confirm(msg)) {
        btn.parentElement.parentElement.parentElement.remove()
    } else console.log('Card delete aborted.')
}

const board01 = new BoardObj()
