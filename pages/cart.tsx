import { Magnification } from '@/libs/magnification'
import { NextPage } from 'next'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import Popup from '@/components/popup'
import { useAppDispatch, useAppSelector } from '@/hooks/use-reducer-hooks'
import { minusQuantity, plusQuantity, setStoredCart } from '@/app/appSlice'
import { useRouter } from 'next/router'
import { isEmpty, List } from 'lodash'
import Head from 'next/head'
import Toast from '@/components/toast'
import swal from 'sweetalert'
import Swal2 from 'sweetalert2'
import axios from 'axios'

const Cart: NextPage = () => {
  const storedCart = useAppSelector((state) => state.app.cart)
  const storedFoodStore = useAppSelector((state) => state.app.storedFoodStore)
  const return_price = (prices)=>{
    const re_price = Math.ceil(Math.trunc(parseInt(prices as string, 10) * Magnification.magnification) /100) * 100
    return re_price
  }
  const adjusted_delivery_fee = Number(return_price(storedFoodStore?.adjusted_delivery_fee))
  const origin_adjusted_delivery_fee = Number(storedFoodStore?.adjusted_delivery_fee)

  const [showPopup, setShowPopup] = useState(false)
  const [showMinOrderPopup, setShowMinOrderPopup] = useState(false)
  const [showEmptyCart, setShowEmptyCart] = useState(false)
  const [crrClickedIndex, setCrrClickedIndex] = useState()
  const [serveis_money, setServeis_money] = useState(3000);
  const [MyPoint, setMyPoint] = useState(0);
  const [MyRePoint, setMyRePoint] = useState(0);
  const [UsePoint, setUsePoint] = useState(0);
  const [Coupon_List, setCoupon_List] = useState([]);
  const [Coupon_Code, setCoupon_Code] = useState("not");
  const [C_S,setC_S] = useState(true);
  const [Coupon_Pay, setCoupon_Pay] = useState(0);
  const [Use_Repoint, setUse_Repoint] = useState(0);
  const [UserId, setUserId] = useState("");

  const messageBoxRef = useRef<HTMLUListElement>();
  const scrollToBottom = () => {
  if (messageBoxRef.current) {
    console.log(messageBoxRef.current.scrollTop)
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  }
  };

  const dispatch = useAppDispatch()
  const router = useRouter()

  const menuTotalQuantity = storedCart.reduce((acc, curr) => {
    return acc + curr.quantity
  }, 0)

  const menuTotalPrice = storedCart.reduce((acc, curr) => {
    return acc + curr.totalPrice
  }, 0)

  const Resets = () =>{
    setCoupon_Pay(0)
    setUsePoint(0)
  }

  const C_Setter = async () => {
    
    await find_U_D().then((data)=>{
      
    })
  }

  const Setter = async () => {
    scrollToBottom()
    let points
    let Coupons

    await find_U_D().then((data)=>{
      points = data.Point
      Coupons = data.coupon_List
    })

    if(menuTotalPrice + adjusted_delivery_fee + serveis_money < points){
      setUsePoint(Number(menuTotalPrice + adjusted_delivery_fee + serveis_money))
      if (Coupons?.length > 0){
        if (menuTotalPrice + adjusted_delivery_fee + serveis_money <= points + serveis_money){
          setCoupon_Code(Coupons[0].쿠폰번호)
          setCoupon_Pay(serveis_money)
          setUsePoint(menuTotalPrice + adjusted_delivery_fee)
        }
        else{
          setCoupon_Code(Coupons[0].쿠폰번호)
          setCoupon_Pay(serveis_money)
        }
      }
      return
    }
    else{
      setUsePoint(Number(points))
      if (Coupons?.length > 0){
        if (menuTotalPrice + adjusted_delivery_fee + serveis_money <= points + serveis_money){
          setCoupon_Code(Coupons[0].쿠폰번호)
          setCoupon_Pay(serveis_money)
          setUsePoint(menuTotalPrice + adjusted_delivery_fee)
        }
        else{
          setCoupon_Code(Coupons[0].쿠폰번호)
          setCoupon_Pay(serveis_money)
        }
      }
      return
    }
  }

  useEffect(()=>{
    if (Coupon_List.length > 0 && C_S){
      Swal2.fire(`ใช้คูปองแล้ว.`)
      setC_S(false)
    }
  },[Coupon_List])

  const find_U_D = async ()=>{
    let data
    await axios
      .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${encodeURIComponent(UserId)}`, {//http://127.0.0.1/service
      // .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${encodeURIComponent('Ua80cd1a19a12cb88657950e300a68594')}`, {//
      // .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${'Ua80cd1a19a12cb88657950e300a68594'}`, {
      }).then((res) => {
        setCoupon_List(res.data.coupon_List)
        setMyPoint(res.data.Point)
        setMyRePoint(res.data.Re_Point)
        data =  res.data
      })
    return data
  }

  const couponUse = async () =>{
    let Coupon_Name
    if(Use_Repoint > 0){
      //이미 할인
      Swal2.fire("ลูกค้าได้รับส่วนลดแล้วค่ะ")
      return
      
    }
    scrollToBottom()
    await find_U_D().then((val)=>{
      Coupon_Name = val.coupon_List
    })
    
    let Options = {}
    Coupon_Name.map((is)=>{Options[is.쿠폰번호]=is.쿠폰내용})
    //쿠폰적용
    const { value: Coupon } = await Swal2.fire({
      //쿠폰함
      title: 'กล่องคูปอง',
      input: 'select',
      inputOptions: Options,
      // 취소
      cancelButtonText:"ยกเลิก",
      // 선택
      confirmButtonText:"เลือก",
      inputPlaceholder: `เลือกคูปอง`,
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value !== "") resolve("")
        })
      }
    })
    
    if (Coupon) {
      
      let Coupons = {}
      Coupon_Name.map((ii)=>{
          if(ii.쿠폰번호 === Coupon){
            Coupons["쿠폰이름"] = ii.쿠폰내용
            Coupons["쿠폰번호"] = ii.쿠폰번호
            console.log(Coupons["쿠폰이름"])
            console.log(Coupons["쿠폰번호"])
          }
        })
      if (Coupons){
        Swal2.fire(`ใช้คูปองแล้ว.`)
      }
      else if (Coupons['쿠폰이름'] === "undefined"){
        Swal2.fire(`ใช้คูปองแล้ว.`)
      }

      if (menuTotalPrice + adjusted_delivery_fee + serveis_money <= UsePoint + serveis_money){
        setCoupon_Code(Coupons["쿠폰번호"])
        setCoupon_Pay(serveis_money)
        setUsePoint(menuTotalPrice + adjusted_delivery_fee + serveis_money - serveis_money)
      }
      else{
        setCoupon_Code(Coupons["쿠폰번호"])
        setCoupon_Pay(serveis_money)
        return
      }
    }

  }

  useEffect(() => {
    setUserId(sessionStorage.getItem("userId"))
    setServeis_money(Number(sessionStorage.getItem("Service_Money")))
    setMyPoint(Number(sessionStorage.getItem("User_Point")))
    Setter()
    C_Setter()

  }, []);

  useEffect(()=>{
    Setter()
    C_Setter()
  },[menuTotalPrice])

  useEffect(() => {
    Setter()
    C_Setter()
  }, [UserId]);

  const cartTotalCombinedPrice = () => {
    if (adjusted_delivery_fee) {
      return insertCommas(
        Number(menuTotalPrice) + Number(serveis_money) + Number(adjusted_delivery_fee) - Number(UsePoint) - Number(Coupon_Pay) - Number(Use_Repoint),
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
              if (menuTotalPrice >= Math.ceil(Math.trunc(Number(storedFoodStore.min_order_amount) * Magnification.min_del) /100) * 100) {
                
                router.push(`/order?fee=${adjusted_delivery_fee}&Coupon_Pay=${Coupon_Pay}&Use_Point=${UsePoint}&Coupon_Code=${Coupon_Code}&Use_Repoint=${Use_Repoint}&origin_fee=${origin_adjusted_delivery_fee}`)
              } else {
                setShowMinOrderPopup(true)
              }
            }
          },
          allowOutsideClick: () => !Swal2.isLoading()
        })
        
      } else {
        if (menuTotalPrice >= Math.ceil(Math.trunc(Number(storedFoodStore.min_order_amount) * Magnification.min_del) /100) * 100) {
          router.push(`/order?fee=${adjusted_delivery_fee}&Coupon_Pay=${Coupon_Pay}&Use_Point=${UsePoint}&Coupon_Code=${Coupon_Code}&Use_Repoint=${Use_Repoint}&origin_fee=${origin_adjusted_delivery_fee}`)
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
            if (menuTotalPrice >= Math.ceil(Math.trunc(Number(storedFoodStore.min_order_amount) * Magnification.min_del) /100) * 100) {
              router.push(`/order?fee=${adjusted_delivery_fee}&Coupon_Pay=${Coupon_Pay}&Use_Point=${UsePoint}&Coupon_Code=${Coupon_Code}&Use_Repoint=${Use_Repoint}&origin_fee=${origin_adjusted_delivery_fee}`)
            } else {
              setShowMinOrderPopup(true)
            }
          }
        },
        allowOutsideClick: () => !Swal2.isLoading()
      })
    }
    
  }
  // useEffect(()=>{
  //   if (menuTotalPrice + adjusted_delivery_fee + serveis_money < MyPoint){
  //     setUsePoint(menuTotalPrice + adjusted_delivery_fee + serveis_money)

  //   }else {
  //     setUsePoint(MyPoint) 
  //   }
  // },[menuTotalPrice,MyPoint,adjusted_delivery_fee,serveis_money])

  // 포인트 사용 함수
  const handleClickUsePoint = async () => {
    
    find_U_D()

    Swal2.fire({
      input:'number',
      inputLabel: 'พ้อยท์',
      // 취소
      cancelButtonText:"ยกเลิก",
      // 선택
      confirmButtonText:"เลือก",
      inputPlaceholder:"กรุณาใส่จำนวนพ้อยท์",
      showCancelButton: true,
      preConfirm: (Pay) => {
        if (Coupon_Pay > 0){
          Swal2.fire(`ลูกค้าได้รับส่วนลดแล้วค่ะ.`)
          return
        }
        else{
          if(Pay > MyPoint){
            // 3. 사용할수 있는포인트를 초과하셨습니다
            setUsePoint(0)
            Swal2.fire("ลูกค้าใส่พ้อยท์เกินจำนวนที่มีอยู่ค่ะ")
            return
          }else if(Pay === ""){
            //포인트를 입력해주세요
            setUsePoint(0)
            Swal2.fire("กรุณาใส่จำนวนพ้อยท์")
            return
          }else if(menuTotalPrice + adjusted_delivery_fee + serveis_money <= Pay){
            setUsePoint(Number(menuTotalPrice + adjusted_delivery_fee + serveis_money))
            // 음식가격 이하로만 포인트 사용 가능합니다.
            Swal2.fire("ใช้พ้อยท์ได้ต่ำกว่าค่าอาหารเท่านั้นค่ะ.")
            return
          }
          else{
            setUsePoint(Number(Pay))
            Swal2.fire(`ลูกค้าได้ใช้${Pay}พ้อยท์แล้วค่ะ.`)
            return
          }
        }
        
      },
    })
  }
  // 리마인드 포인트 사용 함수
  // const handleClickUseRePoint = async () => {
    
  //   find_U_D()

  //   Swal2.fire({
  //     input:'number',
  //     inputLabel: 'พ้อยท์',
  //     // 취소
  //     cancelButtonText:"ยกเลิก",
  //     // 선택
  //     confirmButtonText:"เลือก",
  //     inputPlaceholder:"กรุณาใส่จำนวนพ้อยท์",
  //     showCancelButton: true,
  //     preConfirm: (Pay) => {
  //       if (Coupon_Pay > 0){
  //         Swal2.fire(`ลูกค้าได้รับส่วนลดแล้วค่ะ.`)
  //         return
  //       }
  //       else{
  //         if(Pay > MyRePoint){
  //           // 3. 사용할수 있는포인트를 초과하셨습니다
  //           setUse_Repoint(0)
  //           Swal2.fire("ลูกค้าใส่พ้อยท์เกินจำนวนที่มีอยู่ค่ะ")
  //           return
  //         }else if(Pay === ""){
  //           //포인트를 입력해주세요
  //           setUse_Repoint(0)
  //           Swal2.fire("กรุณาใส่จำนวนพ้อยท์")
  //           return
  //         }else if(menuTotalPrice + adjusted_delivery_fee + serveis_money < Pay){
  //           setUse_Repoint(Number(menuTotalPrice + adjusted_delivery_fee + serveis_money))
  //           // 음식가격 이하로만 포인트 사용 가능합니다.
  //           Swal2.fire("ใช้พ้อยท์ได้ต่ำกว่าค่าอาหารเท่านั้นค่ะ.")
  //           return
  //         }
  //         else{
  //           setUse_Repoint(Number(Pay))
  //           Swal2.fire(`ลูกค้าได้ใช้${Pay}พ้อยท์แล้วค่ะ.`)
  //           return
  //         }
  //       }
        
  //     },
  //   })
  // }

  const handleClickUseRePoint = async () => {
    
    find_U_D()
    if(Coupon_Pay > 0){
      Swal2.fire("ลูกค้าได้รับส่วนลดแล้วค่ะ.")
      return
    }else if (menuTotalPrice + adjusted_delivery_fee + serveis_money < UsePoint + MyRePoint){
      if(menuTotalPrice + adjusted_delivery_fee + serveis_money < MyRePoint){
        setUse_Repoint(Number(menuTotalPrice + adjusted_delivery_fee + serveis_money))
        setUsePoint(0)
        return
      }
      else{
        setUse_Repoint(Number(MyRePoint))
        setUsePoint(menuTotalPrice + adjusted_delivery_fee + serveis_money - MyRePoint)
        console.log(Use_Repoint)
        console.log(UsePoint)
      }
    }
    else if(menuTotalPrice + adjusted_delivery_fee + serveis_money < MyRePoint){
      setUse_Repoint(Number(menuTotalPrice + adjusted_delivery_fee + serveis_money))
      return
    }
    else{
      setUse_Repoint(Number(MyRePoint))
      return
    }
  }

  return (
    <div className="flex h-screen flex-col" style={{ fontFamily: "Sriracha-Regular" }}>
      <Head>
        <title style={{ fontFamily: "Sriracha-Regular" }}>ตะกร้าช้อปปิ้ง</title>
      </Head>
      <Toast message="ตะกร้าสินค้าว่างเปล่" open={showEmptyCart} />
      <div className="flex-1 overflow-auto px-5 pb-5">
      <div className="flex flex-row justify-between ">
              <span className="text-[#7c7c7c] mt-3 ">
                {/* 쿠폰함 */}
                <span className='flex flex-row'>
                <p  className='mr-3 font-bold text-[#000000]'>{` มีคูปองอยู่`}</p>
                <p className="text-[#000000] mr-3">{`(มีคูปองอยู่`} </p>
                <p className="text-[#FF3333]">{`${Coupon_List?.length} ใบ`}</p>
                <p>{')'}</p>
                </span>
              </span>

            </div>
            
            <button
              className="w-full rounded-sm bg-primary py-3 text-white "
              onClick={couponUse}
              // 쿠폰사용금액
              // 쿠폰적용,쿠폰금액
            >{`ใช้คูปอง`}
            </button>
          
          {/* <button
            className="w-full rounded-sm bg-primary py-3 text-white"
            onClick={handleClickUsePoint}
          >
            포인트 사용
            {`ใช้พ้อยท์`}
          </button> */}

          <div className="flex flex-row justify-between mt-5" >
            <span className="text-[#7c7c7c] ">
              {/* 내포인트 */}
              
              <p className='mr-4 flex flex-row'>
                <p className='mr-4 text-[#000000]'>{`พ้อยท์ของฉัน`}</p>
                <span className="text-[#FF3333]">{`${insertCommas(MyRePoint)}`}</span>
              </p>
            </span>
          </div>

          <button
            className="w-full rounded-sm bg-primary py-3 text-white"
            onClick={handleClickUseRePoint}
          >
            {/* 리마인드 포인트 사용 */}
            {`ใช้พ้อยท์ทั้งหมด`}
          </button>
          

          <div className="my-4 space-y-2" style={{borderTop:"3px solid",borderColor:"#cccccc"}}>
            <div className='w-full text-center text-[#000000] font-bold text-[25px] mt-3'>{`ข้อมูลการสั่งซื้อ`}</div>
            <div 
              className="flex flex-row justify-between"
            >
              <span className="text-[#7c7c7c] ">
                {/* 총 */}
                {`ยอดรวม`}
              </span>
              <span >{`${insertCommas(menuTotalPrice)}`}</span>
            </div>
            
            <div className="flex flex-row justify-between">
              <span className="text-[#7c7c7c]">
                {/* 배송비 */}
                {`ค่าจัดส่ง`}
              </span>
              <span>{`${adjusted_delivery_fee ? insertCommas(adjusted_delivery_fee) : ''}`}</span>
            </div>
            <div 
              className=" justify-between"
            >
              <p className='flex flex-row  justify-between'>
                <span className="text-[#7c7c7c] mb-2">
                  {/* 서비스비용 */}
                  {`ค่าบริการ`}
                </span>
                <span>{`${insertCommas(serveis_money)}`}</span>
              </p>

              <p className='flex flex-row  justify-between'>
                <span className="text-[#7c7c7c] mb-2">
                  {/* 캐쉬 */}
                  {`My Cash`}
                </span>
                <span>{`${insertCommas(UsePoint)}`}</span>
              </p>

              <p className='flex flex-row  justify-between'  style={{borderBottom:"3px solid",borderColor:"#cccccc"}}>                
                <span className="text-[#7c7c7c] mb-2">
                  {/* 서비스비용 */}
                  {`Point&Coupon`}
                </span>
                <span>{`${insertCommas(Use_Repoint + Coupon_Pay)}`}</span>
              </p>

              <p className='flex flex-row justify-between mt-2'>
                <p className="text-[#1642df] font-bold text-[18px]">{`ส่วนลดทันที `}</p>
                <p className="text-[#1642df] font-bold text-[18px]">{`₩ -${insertCommas(UsePoint + Coupon_Pay + Use_Repoint)}`}</p>
              </p>
            </div>
              
              <p className='flex flex-row justify-between'>
                <p className="text-[#FF3333] font-bold text-[20px]">{`จำนวนเงินที่ต้องชำระ`}</p>
                <p className="text-[#FF3333] font-bold text-[20px]">{`${isEmpty(storedCart) ? '0' : cartTotalCombinedPrice()}`}</p>
              </p>
            {/* <button
              className="w-full rounded-sm bg-[#000000]/70 py-3 text-white"
              onClick={Resets}
            >리셋</button> */}

            

          </div>
          
          <div 
            className="mt-3 rounded-md p-3 text-[#333] grid place-items-center"
            style={{border:"2px solid"}}
          >
            <p className=' flex flex-row my-auto items-center'>
              <p className='mr-2 font-bold text-[#1642df] text-[27px]'
                >
                {`₩${insertCommas(UsePoint + Coupon_Pay + Use_Repoint)}`}
                {/* {`₩ ${insertCommas(30000)}`} */}
              </p>
                <p className='mr-2 font-bold  text-[15px]'>
                  {`คุณได้รับส่วนลด`}
                </p>
            </p>
          </div>
        {storedCart.map(({ menu, options, quantity, totalPrice }, index) => (
          <div key={`menu.menuId_${index}`} className="space-y-4 border-b border-gray-300 py-5">
            {menu.original_image ? (
              <div className="relative h-56 w-full overflow-hidden rounded-md">
                <Image
                  src={menu.original_image}
                  unoptimized
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
                <div className="text-xl font-bold">{insertCommas(totalPrice)}</div>
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

        
        </div>
      </div>
      <button
        onClick={handleClickOrder}
        className="h-20 w-full bg-primary text-2xl font-bold text-white"
      >
        {`${menuTotalQuantity} รวมยอดสั่งซื้อ`}
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
                Math.ceil(Math.trunc(Number(storedFoodStore.min_order_amount) * Magnification.min_del) /100) * 100,
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
