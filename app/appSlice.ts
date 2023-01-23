import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '@/app/state'

export type FoodStore = {
  id?: number
  lang?: 'en' | 'th'
}
export type StoredFoodStore = FoodStore & {
  adjusted_delivery_fee?: string
  min_order_amount?: string
}

export type StoredCart = {
  menu: {
    original_image: string
    menu_name: string
    menuTranslatedName?: string
    menuId: string
    price: string
  }
  options: any[]
  quantity: number
  totalPrice: number
  basePrice: number
  storeId: string
  storeName: string
}

export interface AppState {
  foodStore: FoodStore
  storedFoodStore: StoredFoodStore
  cart: StoredCart[]
  cartUpdated: boolean
}

const initialState: AppState = {
  foodStore: null,
  storedFoodStore: null,
  cart: [],
  cartUpdated: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFoodStore: (state, action: PayloadAction<FoodStore>) => {
      state.foodStore = action.payload
    },
    updateFoodStoreLang: (state, action: PayloadAction<FoodStore['lang']>) => {
      state.foodStore.lang = action.payload
    },
    setStoredFoodStore: (state, action: PayloadAction<StoredFoodStore>) => {
      state.storedFoodStore = action.payload
    },
    addStoredCart: (state, action: PayloadAction<StoredCart>) => {
      state.cart.push(action.payload)
    },
    setStoredCart: (state, action: PayloadAction<StoredCart[]>) => {
      state.cart = action.payload
    },
    setStoredCartUpdated: (state, action: PayloadAction<boolean>) => {
      state.cartUpdated = action.payload
    },
    plusQuantity: (state, action: PayloadAction<number>) => {
      const cartIndex = action.payload
      state.cart[cartIndex].quantity += 1
      state.cart[cartIndex].totalPrice += state.cart[cartIndex].basePrice
    },
    minusQuantity: (state, action: PayloadAction<number>) => {
      const cartIndex = action.payload
      state.cart[cartIndex].quantity -= 1
      state.cart[cartIndex].totalPrice -= state.cart[cartIndex].basePrice
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setFoodStore,
  updateFoodStoreLang,
  setStoredFoodStore,
  addStoredCart,
  setStoredCart,
  setStoredCartUpdated,
  plusQuantity,
  minusQuantity,
} = appSlice.actions

export default appSlice.reducer

const selectSelf = (state: RootState) => state
export const foodStoreSelector = createSelector(selectSelf, (state) => state.app.foodStore)
export const foodStoreLangSelector = createSelector(
  foodStoreSelector,
  (foodStore) => foodStore?.lang,
)
export const cartSelector = createSelector(selectSelf, (state) => state.app.cart)
