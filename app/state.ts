import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import appReducer from './appSlice'
import menusReducer from './menusSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      app: appReducer,
      menus: menusReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true })
