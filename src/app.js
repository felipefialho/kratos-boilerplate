import * as offline from 'offline-plugin/runtime';
import './app.scss';
import './components/welcome/welcome.js';

offline.install({ onUpdateReady: () => offline.applyUpdate() });
