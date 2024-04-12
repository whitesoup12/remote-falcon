import { combineReducers } from 'redux';

import componentsReducer from './slices/components';
import controlPanelReducer from './slices/controlPanel';
import menuReducer from './slices/menu';
import showReducer from './slices/show';
import snackbarReducer from './slices/snackbar';

const reducer = combineReducers({
  show: showReducer,
  components: componentsReducer,
  controlPanel: controlPanelReducer,
  menu: menuReducer,
  snackbar: snackbarReducer
});

export default reducer;
