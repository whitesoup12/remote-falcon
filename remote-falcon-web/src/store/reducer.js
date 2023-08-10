import { combineReducers } from 'redux';

import accountReducer from './slices/account';
import componentsReducer from './slices/components';
import controlPanelReducer from './slices/controlPanel';
import menuReducer from './slices/menu';
import snackbarReducer from './slices/snackbar';

const reducer = combineReducers({
  account: accountReducer,
  components: componentsReducer,
  controlPanel: controlPanelReducer,
  menu: menuReducer,
  snackbar: snackbarReducer
});

export default reducer;
