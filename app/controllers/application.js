import Controller from '@ember/controller';
import { set, get, computed } from '@ember/object';
import EmberObject from '@ember/object';
import { task, timeout } from 'ember-concurrency';


const data =  [
  EmberObject.create({ id: 1, type: 'card', value: 1, flip: false}),
  EmberObject.create({ id: 2, type: 'card', value: 2, flip: false}),
  EmberObject.create({ id: 3, type: 'card', value: 3, flip: false}),
  EmberObject.create({ id: 4, type: 'card', value: 4, flip: false}),
  EmberObject.create({ id: 5, type: 'card', value: 5, flip: false}),
  EmberObject.create({ id: 6, type: 'card', value: 1, flip: false}),
  EmberObject.create({ id: 7, type: 'card', value: 2, flip: false}),
  EmberObject.create({ id: 8, type: 'card', value: 3, flip: false}),
  EmberObject.create({ id: 9, type: 'card', value: 4, flip: false}),
  EmberObject.create({ id: 10, type: 'card', value: 5, flip: false}),
]

export default Controller.extend({

  /**
   * @property metch
   */
  match: [],
  /**
   * @property data
   */
  data: data,
  /**
   * @property count
   */
  count: 0,
  /**
   * @property winner
   */
  matchMessage: null,
  /**
   * @property status
   */
  status: null,

  /**
   * @method cards
   * @returns function;
   */
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
  /**
   * @method _shuffle
   * @param {Array} array 
   */
  _shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  /**
   * @method _statusSwitcherTask
   * @param {Array} cards
   * @param {Boolean} status
   * @param {Boolean} bool
   * @param {String} message
   * @param {Array} array
   */
  _statusSwitcherTask: task(function * (model, cards, status, bool, message, array) {
    yield timeout(1000);
    set(this, 'match', []);
    set(this, 'status', bool);
    set(this, 'matchMessage', message);
    if(status) {
      cards.removeObject(array[0])
      cards.removeObject(array[1])
      yield timeout(1000);
      set(this, 'matchMessage', null);
    } else {
      yield timeout(1000);
      set(this, 'matchMessage', null);
      cards.forEach((card) => {
        if(card.flip) {
          set(card, 'flip', false)
        }
      })
    }
  }).restartable(),

  /**
   * @method _match
   * @param {Object} model 
   */
  _match(model) {
    let cards = get(this, 'data');
    let matchState = get(this, 'match');
    set(this, 'matchMessage', null)
    set(model, 'flip', true)
    matchState.push(model)
    if(matchState.length === 2) {
      if( matchState[0].value === matchState[1].value) {
        this.incrementProperty('count');
        get(this, '_statusSwitcherTask').perform(model, cards, true, true, `Yay! You found a match number ${matchState[0].value}`, matchState);
      } else {
        get(this, '_statusSwitcherTask').perform(model, cards, false, false, 'Try again', matchState);
      }
    }
  },

  actions: {
    /**
     * @method matcher
     * @param {Onject} model 
     */
    matcher(model) {
      this._match(model);
    },
    /**
     * @method newGame
     */
    newGame() {
      // TODO: This line is super hacky need to find a better way.
      window.location.reload(true);
    }
  }
});

