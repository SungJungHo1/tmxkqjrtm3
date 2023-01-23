import { NextPage } from 'next'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import Popup from '@/components/popup'
import { useAppDispatch, useAppSelector } from '@/hooks/use-reducer-hooks'
import { minusQuantity, plusQuantity, setStoredCart } from '@/app/appSlice'
import { useRouter } from 'next/router'
import { isEmpty } from 'lodash'
import Head from 'next/head'
import Toast from '@/components/toast'
import swal from 'sweetalert'
import Swal2 from 'sweetalert2'
import axios from 'axios'

const Cart: NextPage = () => {
  const storedCart = useAppSelector((state) => state.app.cart)
  const storedFoodStore = useAppSelector((state) => state.app.storedFoodStore)

  const adjusted_delivery_fee = Number(storedFoodStore?.adjusted_delivery_fee)

  const [showPopup, setShowPopup] = useState(false)
  const [showMinOrderPopup, setShowMinOrderPopup] = useState(false)
  const [showEmptyCart, setShowEmptyCart] = useState(false)
  const [crrClickedIndex, setCrrClickedIndex] = useState()
  const [serveis_money, setServeis_money] = useState(3000);
  const [MyPoint, setMyPoint] = useState(0);
  const [UsePoint, setUsePoint] = useState(0);

  const dispatch = useAppDispatch()
  const router = useRouter()

  const menuTotalQuantity = storedCart.reduce((acc, curr) => {
    return acc + curr.quantity
  }, 0)

  const menuTotalPrice = storedCart.reduce((acc, curr) => {
    return acc + curr.totalPrice
  }, 0)

  useEffect(() => {
    setServeis_money(Number(sessionStorage.getItem("Service_Money")))
    setMyPoint(Number(sessionStorage.getItem("User_Point")))
  }, []);

  const cartTotalCombinedPrice = () => {
    if (adjusted_delivery_fee) {
      return insertCommas(
        Number(menuTotalPrice) + Number(serveis_money) + Number(adjusted_delivery_fee) - Number(UsePoint),
      )
    }
    return ''
  }
  const handleClickDeleteMenu = (index) => {
    setShowPopup(true)
    setCrrClickedIndex(index)
  }

  const deleteCartMenu = () => {
    const filteredCart = storedCart.filter((item, i) => i !== crrClickedIndex)

    dispatch(setStoredCart(filteredCart))
    setShowPopup(false)

    if (storedCart.length === 1) {
      setShowEmptyCart(true)
    }
  }

  const changeMenuQuantity = (index, type) => {
    if (type === 'minus') {
      if (storedCart[index].quantity !== 1) {
        dispatch(minusQuantity(index))
      }
    } else if (type === 'plus') {
      dispatch(plusQuantity(index))
    }
  }

  const handleClickOrder = () => {
    let curr = new Date();
    let utc =
      curr.getTime() +
      (curr.getTimezoneOffset() * 60 * 1000);
    let KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    let kr_curr =
      new Date(utc + (KR_TIME_DIFF));
    let Kr_Time = parseInt(kr_curr.getHours().toString())
    if (sessionStorage.getItem("Serveis_Opened") === "true"){
      if (Kr_Time >= 0 && Kr_Time < 11) {
      // if (Kr_Time <= 0) {
        // swal("ร้านปิดแล้วค่ะ\nFASTFOOD\nเปิดทำการ 11:00-00:00.")
        Swal2.fire({
          title: "ร้านปิดแล้วค่ะ\nFASTFOOD\nเปิดทำการ 11:00-00:00.",
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Ok',
          showLoaderOnConfirm: true,
          preConfirm: (login) => {
            if (login === "fastfood1144"){
              if (menuTotalPrice >= Number(storedFoodStore.min_order_amount)) {
                sessionStorage.setItem("Use_Point",String(UsePoint))
                router.push(`/order?fee=${adjusted_delivery_fee}`)
              } else {
                setShowMinOrderPopup(true)
              }
            }
          },
          allowOutsideClick: () => !Swal2.isLoading()
        })
        
      } else {
        if (menuTotalPrice >= Number(storedFoodStore.min_order_amount)) {
          sessionStorage.setItem("Use_Point",String(UsePoint))
          router.push(`/order?fee=${adjusted_delivery_fee}`)
        } else {
          setShowMinOrderPopup(true)
        }
      }
    }else if(sessionStorage.getItem("Serveis_Opened") === "false"){
      // Swal2.fire(sessionStorage.getItem("Serveis_Ment"))
      Swal2.fire({
        title: sessionStorage.getItem("Serveis_Ment"),
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Ok',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          if (login === "fastfood1144"){
            if (menuTotalPrice >= Number(storedFoodStore.min_order_amount)) {
              sessionStorage.setItem("Use_Point",String(UsePoint))
              router.push(`/order?fee=${adjusted_delivery_fee}`)
            } else {
              setShowMinOrderPopup(true)
            }
          }
        },
        allowOutsideClick: () => !Swal2.isLoading()
      })
    }
    
  }
  useEffect(()=>{
    if (menuTotalPrice + adjusted_delivery_fee + serveis_money < MyPoint){
      setUsePoint(menuTotalPrice + adjusted_delivery_fee + serveis_money)

    }else {
      setUsePoint(MyPoint) 
    }
  },[menuTotalPrice,MyPoint,adjusted_delivery_fee,serveis_money])
  

  // 포인트 사용 함수
  const handleClickUsePoint = () => {
    console.log('포인트 사용 핸들러')
  }

  return (
    <div className="flex h-screen flex-col" style={{ fontFamily: "Sriracha-Regular" }}>
      <Head>
        <title style={{ fontFamily: "Sriracha-Regular" }}>ตะกร้าช้อปปิ้ง</title>
      </Head>
      <Toast message="ตะกร้าสินค้าว่างเปล่" open={showEmptyCart} />
      <div className="flex-1 overflow-auto px-5 pb-5">
        {storedCart.map(({ menu, options, quantity, totalPrice }, index) => (
          <div key={`menu.menuId_${index}`} className="space-y-4 border-b border-gray-300 py-5">
            {menu.original_image ? (
              <div className="relative h-56 w-full overflow-hidden rounded-md">
                <Image
                  src={menu.original_image}
                  alt={menu.menu_name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            ) : null}

            <div className="space-y-4 " aria-label="stored-menu">
              <div className="flex flex-row items-center justify-between ">
                <div>
                  <div className="text-lg font-bold">
                    {menu.menuTranslatedName || menu.menu_name}
                    <span className="ml-2 font-normal text-[#c71719]">x {quantity}</span>
                  </div>
                  <div>
                    <span aria-label="Regular" className="mt-1 inline-block text-gray-500">
                      {/* 기본 */}
                      {`ปกติ(+ ${insertCommas(Number(menu.price))})`}
                    </span>
                  </div>
                  {options.map((option, index) => (
                    <div key={`${option.optionTranslatedName || option.optionName}_${index}`}>
                      <span aria-label="Option" className="mt-1 inline-block">{`${option.subOptionTranslatedName || option.subOptionName
                        }(+ ${insertCommas(option.subOptionPrice)})`}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="h-10 w-24 flex-[0_0_6rem] rounded-md bg-[#e63d3e] px-4 text-sm text-white"
                  onClick={() => handleClickDeleteMenu(index)}
                >
                  {/*메뉴삭제*/}
                  ลบรายการ
                </button>
              </div>
              <div className="flex flex-row items-center justify-between">
                <div className="text-2xl font-bold">₩ {insertCommas(totalPrice)}원</div>
                <div className="rounded-md border border-gray-300 p-2 text-center">
                  <button
                    className="w-8 text-lg"
                    onClick={() => changeMenuQuantity(index, 'minus')}
                  >
                    -
                  </button>
                  <span className="inline-block w-8 text-[#c71719]">{quantity}</span>
                  <button className="w-8 text-lg" onClick={() => changeMenuQuantity(index, 'plus')}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div>
          <div className="my-4 space-y-5">
            <div className="flex flex-row justify-between">
              <span className="text-[#7c7c7c]">
                {/* 총 */}
                {`ยอดรวม`}
              </span>
              <span>{`₩ ${insertCommas(menuTotalPrice)}`}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-[#7c7c7c]">
                {/* 배송비 */}
                {`ค่าจัดส่ง`}
              </span>
              <span>{`₩ ${adjusted_delivery_fee ? insertCommas(adjusted_delivery_fee) : ''}`}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-[#7c7c7c]">
                {/* 서비스비용 */}
                {`ค่าบริการ`}
              </span>
              <span>{`₩ ${insertCommas(serveis_money)}`}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-[#7c7c7c]">
                {/* 서비스비용 */}
                {`ใช้คะแนน`}
              </span>
              <span className="text-[#FF3333]">{`₩ ${insertCommas(UsePoint)}`}</span>
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-[#7c7c7c]">
                {/* 서비스비용 */}
                {`คะแนนของฉัน`}
              </span>
              <span className="text-[#FF3333]">{`₩ ${insertCommas(MyPoint)}`}</span>
            </div>
          </div>
          <button
            className="w-full rounded-sm bg-[#1642df]/70 py-3 text-white"
            onClick={handleClickUsePoint}
          >
            {/* 포인트 사용 */}
            ใช้คะแนน
          </button>
          <div className="mt-3 rounded-md bg-[#ddd] p-3 text-[#333]">
            {`ยอดเงินฝากจาก FASTFOOD คะแนนสามารถแปลงเป็นคะแนนและใช้แทนเงินสดได้`}
          </div>
        </div>
      </div>
      <button
        onClick={handleClickOrder}
        className="h-20 w-full bg-primary text-2xl font-bold text-white"
      >
        {`${menuTotalQuantity} รวมยอดสั่งซื้อ ₩ ${isEmpty(storedCart) ? '0' : cartTotalCombinedPrice()
          }`}
      </button>

      {showPopup ? (
        <Popup
          message="คุณแน่ใจใช่ไหมว่าต้องการลบข้อมูล?"
          onClose={() => setShowPopup(false)}
          onOk={deleteCartMenu}
        />
      ) : null}
      {showMinOrderPopup ? (
        <Popup
          message={
            <div className="text-center">
              {`ยอดสั่งขั้นต่ําไม่รวมค่าบริการอย่างน้อย ${insertCommas(
                Number(storedFoodStore.min_order_amount),
              )} วอน`}
              <span className="mt-2 block text-sm">กรุณาเลือกรายการเพิ่</span>
            </div>
          }
          onClose={() => setShowMinOrderPopup(false)}
          closeText="ตกลง"
        />
      ) : null}
    </div>
  )
}

export default Cart
