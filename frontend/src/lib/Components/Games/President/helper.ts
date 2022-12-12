import type { CardType } from '../../../types'
export function cards_sort(array: CardType[]) {
  return array.sort((a, b) => {
    if (a.value === b.value) {
      return 0
    }
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
    if (order.indexOf(a.value) > order.indexOf(b.value)) {
      return 1
    } else {
      return -1
    }
  })
}
