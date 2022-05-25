import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import auth from './reducers/auth'
import appointments from './reducers/appointments';
import healthcare from './reducers/healthcare';

const rootReducer = combineReducers({
    auth: auth,
    appointments: appointments,
    healthcare: healthcare
});

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof rootReducer>;

export default store;