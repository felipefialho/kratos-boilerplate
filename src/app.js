import * as offline from 'offline-plugin/runtime';
import './app.styl';
import './components/welcome/welcome.js';


offline.install({
  onUpdateReady: function() {
    offline.applyUpdate();
  }
});
