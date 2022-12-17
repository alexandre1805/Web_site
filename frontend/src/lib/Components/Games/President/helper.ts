import type { CardType } from '../../../types'
const order = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
  '2',
]

export function cards_sort(array: CardType[]) {
  return array.sort((a, b) => {
    if (a.value === b.value) {
      return 0
    }
    if (order.indexOf(a.value) > order.indexOf(b.value)) {
      return 1
    } else {
      return -1
    }
  })
}

export function validateTurn(stack: CardType[], turn: CardType[], nbCards: number): String {
  if (nbCards !== 0 && nbCards !== turn.length) {
    return `You must give exactly ${nbCards} cards`
  }

  for (let i = 1; i < turn.length; i++) {
    if (turn[i - 1].value !== turn[i].value)
      return 'You must give cards with the same value in you turn'
  }

  if(stack.length !== 0 && order.indexOf(turn[0].value) < order.indexOf(stack[stack.length - 1].value))
    return 'You must give cards with a value upper or equal to the stack value'

  return ''
}
