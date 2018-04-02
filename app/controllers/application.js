import Controller from '@ember/controller';
import { set, get, computed } from '@ember/object';
import EmberObject from '@ember/object';


const data =  [
  EmberObject.create({ id: 1, type: 'card', value: 1}),
  EmberObject.create({ id: 2, type: 'card', value: 2}),
  EmberObject.create({ id: 3, type: 'card', value: 3}),
  EmberObject.create({ id: 4, type: 'card', value: 4}),
  EmberObject.create({ id: 5, type: 'card', value: 5}),
  EmberObject.create({ id: 6, type: 'card', value: 1}),
  EmberObject.create({ id: 7, type: 'card', value: 2}),
  EmberObject.create({ id: 8, type: 'card', value: 3}),
  EmberObject.create({ id: 9, type: 'card', value: 4}),
  EmberObject.create({ id: 10, type: 'card', value: 5}),
]

export default Controller.extend({

  player1: null,

  player2: null,

  match: [],

  data: data,

  count: 0,

  winner: false,

  matchMessage: null,

  status: null,

  _shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  /**
   * @method _Match
   * @param {Object} model
   * @private
   */

   
  _match(model) {
    let cards = get(this, 'data');
    let matchState = get(this, 'match');
    set(this, 'matchMessage', null)
    matchState.push(model)
    if(matchState.length === 2) {

      if( matchState[0].value === matchState[1].value) {
        this.incrementProperty('count')
        console.log(get(this, 'count'));
        set(this, 'match', [])
        set(this, 'status', true)
        set(this, 'matchMessage', 'Yay you have found a match')
        setTimeout(() => {
          cards.removeObject(matchState[0])
          cards.removeObject(matchState[1])
          set(this, 'matchMessage', false);
        }, 2000)
        
      } else {
        set(this, 'match', []);
        set(this, 'status', false);
        set(this, 'matchMessage', 'Try again');
      }
    }
  },

  cards: computed('data.[]', function() {
    let data = get(this, 'data');
    return this._shuffle(data);
  }),

  newGame: computed('data.[]', function() {
    let data = get(this, 'data');
    if(data.length < 10) {
      return true;
    }
    return false;
  }),

  winner: computed('count', function() {
    return get(this, 'count') === 5 ? true : false;
  }),

  actions: {
    matcher(model) {
      this._match(model);
    },

    newGame() {
      // TODO: This line is super hacky need to find a better way.
      window.location.reload(true);
    }
  }
});

