// TODO: refactor to immutable
// import { Map, List } from 'immutable'
import { Observable } from 'rx'
import { characters } from './config'
import Word from './components/word'
import createDwellGraph from './dwellGraph'

function createStore(chars) {
  return chars.reduce((store, char) => {
    store[char] = []
    return store
  }, {})
}

export default function appModel({ keystroke$, word$, text$ }) {
  const dwell$ = keystroke$
    .startWith(createStore(characters))
    .scan((store, keypress) => {
      store[keypress.key].push(keypress.dwell)
      return store
    })
    .map(createDwellGraph)

  const prompt$ = text$
    .map(text => text
      .split(' ')
      .map((word, index) => Word({ word, key: index } )) 
    )
/*
  const promptWord$ = text$
    .flatMap(text => Observable.from(text.split(' '))

  const classedWord$ = promptWord$
    .withLatestFrom(word$, (promptWord, typedWord) => {
                     
    })
*/   
  return dwell$.combineLatest(prompt$)
}
