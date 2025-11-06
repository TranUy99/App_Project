import {Middleware} from '@reduxjs/toolkit';

export const customLogger: Middleware = store => next => action => {
  if (__DEV__) {
    console.log('%c🟡 Dispatching:', 'color: orange', action);
  }
  const result = next(action);
  if (__DEV__) {
    console.log('%c🔵 Next state:', 'color: blue', store.getState());
  }
  return result;
};
