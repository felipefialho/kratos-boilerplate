import * as offline from 'offline-plugin/runtime';
import './app.scss';
import './components/welcome';

offline.install({ onUpdateReady: () => offline.applyUpdate() });
