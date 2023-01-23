import { ShoppingCartIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@/hooks/use-reducer-hooks'
import { setStoredCartUpdated } from '@/app/appSlice'
import { isEmpty } from 'lodash'
import swal from 'sweetalert'

interface FloatingButton {
  url: string
}

const FloatingButton = ({ url }: FloatingButton) => {
  const storedCartUpdated = useAppSelector((state) => state.app.cartUpdated)
  const storedCart = useAppSelector((state) => state.app.cart)
  const dispatch = useAppDispatch()

  const router = useRouter()
  const [bounceClassName, setBounceClassName] = useState('')

  const emptyCart = () => {
    if (!isEmpty(storedCart)) {
      router.push(url)
    } else {
      // 귀하의 쇼핑 바구니가 비어있습니다.
      swal('ตะกร้า สินค้า ของ คุณ ว่างเปล่า.')
    }
  }

  useEffect(() => {
    if (storedCartUpdated === true) {
      setBounceClassName('animate-bounce')

      setTimeout(() => {
        setBounceClassName('')
        dispatch(setStoredCartUpdated(false))
      }, 2600)
    }
  }, [storedCartUpdated])

  return (
    <button
      className={`fixed bottom-24 right-5 cursor-pointer rounded-full bg-primary p-4 text-white shadow-xl transition-colors ${bounceClassName}`}
      onClick={emptyCart}
    >
      {storedCart.length ? (
        <span className="absolute top-3 inline-block h-5 w-5 rounded-full border border-primary bg-white text-sm text-primary">
          {storedCart.length}
        </span>
      ) : null}
      <ShoppingCartIcon className="h-8 w-8" />
    </button>
  )
}

export default FloatingButton
