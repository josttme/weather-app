import { selectedCountriesList } from '../utils/index'
export function dragAndDrop(container) {
  let currentBox
  const draggables = [...getChildrenElement(container)]
  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', (e) => {
      draggable.classList.add('dragging')
      currentBox = e.target
    })
    container.addEventListener('dragend', (e) => {
      draggable.classList.remove('dragging')
      draggable.setAttribute('draggable', 'false')
    })
    draggable.addEventListener('dragover', function (e) {
      e.preventDefault()
      const target = e.target
      if (target !== currentBox && target.parentNode === currentBox.parentNode) {
        target.style.backgroundColor = 'lightblue'
        if (currentBox == null) {
          container.appendChild(draggable)
        } else {
          if (target.offsetLeft + target.offsetWidth <= currentBox.offsetLeft) {
            console.log('target está a la izquierda de currentBox')
            container.insertBefore(currentBox, target)
          } else if (currentBox.offsetLeft + currentBox.offsetWidth <= target.offsetLeft) {
            container.insertBefore(target, currentBox)
            console.log('currentBox está a la izquierda de target')
          } else {
            container.insertBefore(currentBox, target)
          }
        }
      }
    })
    draggable.addEventListener('dragleave', function (event) {
      event.target.style.backgroundColor = ''
    })
    draggable.addEventListener('drop', function (e) {
      e.preventDefault()
      e.target.style.backgroundColor = ''
      rebuildStorage(getChildrenElement(container))
    })
  })
}
function getChildrenElement(container) {
  const elementChilds = [...container.childNodes]
  return elementChilds.filter((node) => node.nodeType === 1)
}

function rebuildStorage(container) {
  let idCards
  const arrayStorage = [...selectedCountriesList()]
  if (isMobile()) {
    console.log()
    idCards = container.map((item) => item.firstElementChild.id)
  } else {
    idCards = container.map((item) => item.id)
  }
  arrayStorage.sort((a, b) => idCards.indexOf(a.id) - idCards.indexOf(b.id))
  localStorage.setItem('selectedCountries', JSON.stringify(arrayStorage))
}
export function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent)
}
export function trueDragable(container) {
  const draggables = [...getChildrenElement(container)]
  draggables.forEach((draggable) => {
    draggable.setAttribute('draggable', 'true')
  })
}

export function falseDragable(container) {
  const draggables = [...getChildrenElement(container)]
  draggables.forEach((draggable) => {
    draggable.setAttribute('draggable', 'false')
  })
}

export function touchStart(dragging, container) {
  let initialX, initialY
  const draggables = [...getChildrenElement(container)]
  // Events Listeners for dragging
  dragging.addEventListener('touchstart', dragStart)
  dragging.addEventListener('touchmove', dragMove)
  dragging.addEventListener('touchend', dragEnd)

  // Event Touchstart for dragging
  function dragStart(e) {
    e.preventDefault()
    e.stopPropagation()
    const dragging = e.target
    const touch = e.touches[0]

    const styles = window.getComputedStyle(dragging.parentNode)
    const getMarginLeft = parseInt(styles.getPropertyValue('margin-left'))
    const getPaddingLeft = parseInt(styles.getPropertyValue('padding-left'))

    initialX = touch.clientX - getPaddingLeft + getMarginLeft
    initialY = touch.clientY
  }

  // Event Touchmove for dragging
  function dragMove(e) {
    e.preventDefault()
    e.stopPropagation()
    const dragging = e.target
    const parentDraggin = dragging.parentNode
    const currentX = e.touches[0].clientX - initialX
    const currentY = e.touches[0].clientY - initialY

    dragging.classList.add('dragging')
    dragging.style.left = currentX + 'px'
    dragging.style.top = currentY + 'px'

    const draggables = getChildrenElement(container)
    draggables.forEach((newDragDrop) => {
      if (
        dragging.getBoundingClientRect().top + dragging.offsetHeight / 2 + 50 <
          newDragDrop.getBoundingClientRect().bottom &&
        dragging.getBoundingClientRect().right - dragging.offsetWidth / 2 >
          newDragDrop.getBoundingClientRect().left &&
        dragging.getBoundingClientRect().bottom - dragging.offsetHeight / 2 - 50 >
          newDragDrop.getBoundingClientRect().top &&
        dragging.getBoundingClientRect().left + dragging.offsetWidth / 2 <
          newDragDrop.getBoundingClientRect().right
      ) {
        if (newDragDrop === undefined) return
        if (newDragDrop.children[0].id !== dragging.id) {
          parentDraggin.appendChild(newDragDrop.children[0])
          dragging.removeAttribute('style')
          dragging.classList.remove('dragging')
          newDragDrop.appendChild(dragging)
          dragging.removeEventListener('touchstart', dragStart)
          dragging.removeEventListener('touchmove', dragMove)
        }
      }
    })
  }

  // Event Touchend for dragging
  function dragEnd() {
    dragging.removeEventListener('touchstart', dragStart)
    dragging.removeEventListener('touchmove', dragMove)
    dragging.hasAttribute('style') && dragging.removeAttribute('style')
    dragging.classList.contains('dragging') && dragging.classList.remove('dragging')
    rebuildStorage(getChildrenElement(container))
  }
}
