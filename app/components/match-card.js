import Component from '@ember/component';
import { set, get, computed } from '@ember/object';

export default Component.extend({

  classNames: ['container__card'],

  flip: false,

  click(evt) {
    if(get(this, 'action')) {
      this.toggleProperty('flip');
      get(this, 'action')(evt)
    }
  }
});
