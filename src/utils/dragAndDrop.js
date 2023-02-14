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
    })
    draggable.addEventListener('dragover', function (e) {
      e.preventDefault()
      const target = e.target
      if (target !== currentBox && target.parentNode === currentBox.parentNode) {
        target.style.backgroundColor = 'lightblue'
        if (currentBox == null) {
          container.appendChild(draggable)
          console.log(container)
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
}
