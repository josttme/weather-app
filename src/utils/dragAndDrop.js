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
  const arrayStorage = [...selectedCountriesList()]
  const idCards = container.map((item) => item.id)
  arrayStorage.sort((a, b) => idCards.indexOf(a.id) - idCards.indexOf(b.id))
  localStorage.setItem('selectedCountries', JSON.stringify(arrayStorage))
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

export function touchStart(e, container) {
  let initialX, initialY, dragTop, dragLeft, parentTop, parentLeft, itemAppend, parent, child
  const draggables = [...getChildrenElement(container)]
  const ddd = e.target
  ddd.addEventListener('touchstart', (e) => {
    const touch = e.touches[0]
    dragTop = e.target.getBoundingClientRect().top
    parentTop = e.target.parentElement.getBoundingClientRect().top
    console.log(dragTop, parentTop, dragTop - parentTop)
    dragLeft = e.target.offsetLeft
    parentLeft = e.target.parentNode.offsetLeft

    const styles = window.getComputedStyle(e.target.parentNode)
    const marginLeft = parseInt(styles.getPropertyValue('margin-left'))
    const paddingLeft = parseInt(styles.getPropertyValue('padding-left'))
    initialX = touch.clientX - paddingLeft + marginLeft
    initialY = touch.clientY
  })
  ddd.addEventListener('touchmove', function eetouchMove(e) {
    e.preventDefault()
    const currentX = e.touches[0].clientX - initialX
    const currentY = e.touches[0].clientY - initialY
    child = e.target
    parent = e.target.parentNode
    e.target.classList.add('dragging')

    e.target.style.left = currentX + 'px'
    e.target.style.top = currentY + 'px'
    const draggable = getChildrenElement(container)
    const item = draggable.find((dragg, i) => {
      if (
        e.target.getBoundingClientRect().top + e.target.offsetHeight / 2 + 50 <
          dragg.getBoundingClientRect().bottom &&
        e.target.getBoundingClientRect().right - e.target.offsetWidth / 2 >
          dragg.getBoundingClientRect().left &&
        e.target.getBoundingClientRect().bottom - e.target.offsetHeight / 2 - 50 >
          dragg.getBoundingClientRect().top &&
        e.target.getBoundingClientRect().left + e.target.offsetWidth / 2 <
          dragg.getBoundingClientRect().right
      ) {
        dragg.classList.add('active')
        return dragg
      } else {
        dragg.classList.remove('active')
      }
    })
    if (item !== undefined && item.children[0].id !== child.id) {
      ddd.removeEventListener('touchmove', eetouchMove)
      parent.appendChild(item.children[0])
      child.removeAttribute('style')
      child.classList.remove('dragging')
      item.appendChild(child)
    }
  })
  ddd.addEventListener('touchend', (e) => {
    child.removeAttribute('style')
    child.classList.remove('dragging')
  })
}
export function touchMove(e, container) {}
function appendToChild(childIndex, element) {
  element.appendChild(childIndex)
}

function etouchMove() {}
