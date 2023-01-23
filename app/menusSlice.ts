import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/app/state'

export interface Menu {
  name?: string
  translatedName?: string
  items?: any[]
  slug?: string
}

const initialState: Menu[] = []
export const menusSlice = createSlice({
  name: 'menus',
  initialState,
  reducers: {
    setMenus: (state, action: PayloadAction<Menu[]>) => {
      return action.payload
    },
    setRestMenu: (state, action) => {
      state.splice(2, state.length - 2, ...action.payload)
    },
    setRestItem: (state, action: PayloadAction<{ i; k; t }>) => {
      const restMenus = state.slice(2)
      const { i, k, t } = action.payload
      const [name, description] = t.split('|')
      // restMenus[i].items[k].name = name
      restMenus[i].items[k].translatedName = name
      // restMenus[i].items[k].description = description
      restMenus[i].items[k].translatedDescription = description
      state.splice(2, state.length - 2, ...restMenus)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setMenus, setRestItem } = menusSlice.actions

export default menusSlice.reducer

const selectSelf = (state: RootState) => state
export const menusSelector = createSelector(selectSelf, (state) => state.menus)
export const signatureMenusSelector = createSelector(menusSelector, (state) => state[0])
export const top10MenusSelector = createSelector(menusSelector, (state) => state[1])
export const restMenusSelector = createSelector(menusSelector, (state) => state.slice(2))
