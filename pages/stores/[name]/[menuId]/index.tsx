import { Magnification } from '@/libs/magnification'
import { NextPage } from 'next'
import Link from 'next/link'
import TranslatePopup from '@/components/translate-popup'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import produce from 'immer'
import Loading from '@/components/loading'
import { translates } from '@/libs/translates-helper'
import swal from 'sweetalert';
import { useAppDispatch, useAppSelector } from '@/hooks/use-reducer-hooks'
import {
  addStoredCart,
  setStoredCart,
  setStoredCartUpdated,
  setStoredFoodStore,
} from '@/app/appSlice'
import { isEmpty } from 'lodash'
import Popup from '@/components/popup'
import Head from 'next/head'

const MenuDetails: NextPage = () => {
  const foodStore = useAppSelector((state) => state.app.foodStore)
  const storedFoodStore = useAppSelector((state) => state.app.storedFoodStore)

  const storedCart = useAppSelector((state) => state.app.cart)
  const dispatch = useAppDispatch()

  const router = useRouter()
  const [mandatory_Datas,setMandatory_Datas] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [addedOptions, setAddedOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const {
    description,
    menuId,
    menu_name,
    menuTranslatedName,
    original_image,
    original_price,
    price,
    subchoices,
    review_count,
    name,
    id,
    phone
  } = router.query

  const [menuOptions, setMenuOptions] = useState(
    subchoices ? JSON.parse(router.query.subchoices as string) : null,
  )
  const [tMenuName, setTMenuName] = useState(menu_name as string)
  const [tMenuDescription, setTMenuDescription] = useState(description)

  //라디오 버튼 초기 설정
  useEffect(() => {
    let options = []
    let O_Datas = []
    menuOptions?.map((option, index2) => {
      if (option.multiple && option.mandatory){
        O_Datas = [...O_Datas,
        {
          Option_Name:option.name,
          multiple_count: option.multiple_count
        }
      ]
      }
      
      if (!option.multiple && option.mandatory) {
        // setAddedOptions([
        //   ...addedOptions,
        //   {
        //     index2: index2,
        //     optionName: option.name,
        //     optionTranslatedName: option.translatedName,
        //     subOptionName: option.subchoices[0].name,
        //     subOptionTranslatedName: option.subchoices[0].translatedName,
        //     subOptionPrice: Number(option.subchoices[0].price),
        //   },
        // ])
        options = [...options, {
          index2: index2,
          optionName: option.name,
          optionTranslatedName: option.translatedName,
          subOptionName: option.subchoices[0].name,
          subOptionTranslatedName: option.subchoices[0].translatedName,
          original_subOptionPrice : Number(option.subchoices[0].price),
          subOptionPrice: Number(return_price(option.subchoices[0].price)),
        },]
      }

    })
    setAddedOptions(options)
    setMandatory_Datas(O_Datas)
  }, []);

  const return_price = (prices)=>{
    const re_price = Math.ceil(Math.trunc(parseInt(prices as string, 10) * Magnification.magnification) /100) * 100
    return re_price
  }
  // Math.trunc(subOption.price * 1.1)
  // 번역
  const handleTranslate = async (to) => {
    const originData = JSON.parse(router.query.subchoices as string)
    try {
      // const menuNameAndDescriptionTranslated = await translates(
      //   [menu_name as string, description as string],
      //   to,
      // )
      // console.log(menuNameAndDescriptionTranslated)
      const mainTranslated = await translates(
        originData.map((main) => main.name),
        to,
      )

      const subPromises = originData.map((main) =>
        translates(
          main.subchoices.map((sub) => sub.name),
          to,
        ),
      )

      const subTranslated = await Promise.all(subPromises)

      const newState = produce(menuOptions, (draft) => {
        draft.forEach((option, i) => {
          // option.name = mainTranslated[i]
          // 번역 될 때만 아래 속성이 추가 된다.
          option.translatedName = mainTranslated[i]
          option.subchoices.forEach((sub, k) => {
            // sub.name = subTranslated[i][k]
            // 번역 될 때만 아래 속성이 추가 된다.
            sub.translatedName = subTranslated[i][k]
          })
        })
      })

      // setTMenuName(menuNameAndDescriptionTranslated[0])
      // setTMenuDescription(menuNameAndDescriptionTranslated[1])
      setMenuOptions(newState)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getTotalPrice = () => {
    const totalOptionPrice = addedOptions.reduce((acc, curr) => {
      acc += curr.subOptionPrice
      return acc
    }, 0)

    return {
      value: (Number(price) + totalOptionPrice) * orderQuantity,
      label: insertCommas((Number(price) + totalOptionPrice) * orderQuantity),
    }
  }

  const getOriginal_TotalPrice = () => {
    const totalOptionPrice = addedOptions.reduce((acc, curr) => {
      acc += curr.original_subOptionPrice
      return acc
    }, 0)

    return {
      value: (Number(original_price) + totalOptionPrice) * orderQuantity,
      label: insertCommas((Number(original_price) + totalOptionPrice) * orderQuantity),
    }
  }

  const getBasePrice = () => {
    const totalOptionPrice = addedOptions.reduce((acc, curr) => {
      acc += curr.subOptionPrice
      return acc
    }, 0)

    return {
      value: (Number(price) + totalOptionPrice) * 1,
      label: insertCommas((Number(price) + totalOptionPrice) * 1),
    }
  }

  const handleQuantityClick = (type) => {
    if (type === 'minus') {
      if (orderQuantity !== 1) {
        setOrderQuantity(orderQuantity - 1)
      }
    } else if (type === 'plus') {
      setOrderQuantity(orderQuantity + 1)
    }
  }

  // const handleOptionClick = ({ optionName, subOptionName, subOptionPrice }, checked) => {
  //   if (checked) {
  //     setAddedOptions([
  //       ...addedOptions,
  //       { optionName, subOptionName, subOptionPrice: Number(subOptionPrice) },
  //     ])
  //   } else if (!checked) {
  //     setAddedOptions(addedOptions.filter((option) => option.subOptionName !== subOptionName))
  //   }
  // }

  const handleOptionClick = (
    { index2, optionSlag, optionName, subOptionName, optionTranslatedName, subOptionTranslatedName,original_subOptionPrice, subOptionPrice, multiple_count,mandatory },
    checked, ev
  ) => {

    // console.log(test_Code.length)
    if (checked) {

      let checked_option = 0;
      // addedOptions.map((i) => i.optionName == optionName ? checked_option++ : null)
      for (let i = 0; i < addedOptions.length; i++) {
        if (addedOptions[i].optionSlag === optionSlag) {
          checked_option = checked_option + 1
        }
      }
      if (checked_option >= multiple_count && multiple_count > 0 && !mandatory) {
        swal(`คุณสามารถเลือกได้ถึง ${multiple_count}`)
        ev.target.checked = false
        return
      }

      // console.log(checked_option)
      setAddedOptions([
        ...addedOptions,
        {
          index2,
          optionSlag,
          optionName,
          subOptionName,
          optionTranslatedName,
          subOptionTranslatedName,
          original_subOptionPrice: Number(original_subOptionPrice),
          subOptionPrice: Number(subOptionPrice),
        },
      ])

    } else if (!checked) {
      setAddedOptions(addedOptions.filter((option) => option.subOptionName !== subOptionName))
    }
  }

  const UniquehandleOptionClick = ({ index2, optionName, subOptionName, optionTranslatedName, subOptionTranslatedName,original_subOptionPrice, subOptionPrice }) => {
    // setAddedOptions(addedOptions.filter((option) => option.optionName !== optionName))
    let count = 0
    addedOptions.map((i) => i.optionName === optionName && i.index2 === index2 ? count = count + 1 : null)

    // console.log(count)
    if (count === 0) {
      setAddedOptions([
        ...addedOptions,
        { 
          index2,
          optionName,
          subOptionName,
          optionTranslatedName,
          subOptionTranslatedName,
          original_subOptionPrice: Number(original_subOptionPrice),
          subOptionPrice: Number(subOptionPrice)
        },
      ])
    } else {
      console.log(addedOptions)
      setAddedOptions(addedOptions.map((i) => i.optionName === optionName && i.index2 === index2 ? { index2, optionName, subOptionName, optionTranslatedName, subOptionTranslatedName,original_subOptionPrice: Number(original_subOptionPrice), subOptionPrice: Number(subOptionPrice) } : i))
    }
  }

  const isReviewCountable = (cnt: string) => cnt && Number(cnt) > 0

  const addCartAndBack = () => {
    console.log(mandatory_Datas)
    console.log(addedOptions)
    let sw = true
    mandatory_Datas.map((op)=>{
      let ttt = 0
      addedOptions.map((ao)=>{
        if (ao.optionName === op.Option_Name){
          ttt += 1
        }
      })
      console.log(ttt)
      if (op.multiple_count > ttt){
        // 필수선택을 더 선택해주세요
        swal(`กรุณาเลือก${op.multiple_count - ttt}อีก${op.Option_Name}อย่าง`)
        sw = false
      }

    })
    if (!sw){
      return
    }
    
    const parsedPreviousQuery = JSON.parse(router.query.previousQuery as string)

    // 같은 음식점일 때
    if (foodStore.id === storedFoodStore?.id || isEmpty(storedFoodStore) || isEmpty(storedCart)) {
      dispatch(
        addStoredCart({
          menu: {
            original_image: router.query.original_image as string,
            menu_name: router.query.menu_name as string,
            menuTranslatedName: (menuTranslatedName as string) || tMenuName,
            menuId: router.query.menuId as string,
            original_price: router.query.original_price as string,
            price: router.query.price as string,
          },
          options: addedOptions,
          quantity: orderQuantity,
          Original_TotalPrice:getOriginal_TotalPrice().value,
          totalPrice: getTotalPrice().value,
          basePrice: getBasePrice().value,
          storeId: router.query.id as string,
          storeName: router.query.name as string,
        }),
      )
      console.log(phone)
      if (typeof(phone) !== "undefined"){
        sessionStorage.setItem("phone",String(phone))
      }
      router.push(
        {
          pathname: router.query.to === '/review' ? '/stores/[name]/review' : '/stores/[name]',
          query: {
            ...parsedPreviousQuery,
            addedCartLength: storedCart.length,
          },
        },
        router.query.to === '/review'
          ? `/stores/${parsedPreviousQuery.name}/review`
          : `/stores/${parsedPreviousQuery.name}`,
      )

      dispatch(setStoredCartUpdated(true))
      dispatch(setStoredFoodStore(foodStore))
    } else if (foodStore.id !== storedFoodStore.id) {
      setShowPopup(true)
    }
  }

  const replaceCart = () => {
    const parsedPreviousQuery = JSON.parse(router.query.previousQuery as string)

    dispatch(
      setStoredCart([
        {
          menu: {
            original_image: router.query.original_image as string,
            menu_name: router.query.menu_name as string,
            menuId: router.query.menuId as string,
            original_price: router.query.original_price as string,
            price: router.query.price as string,
          },
          options: addedOptions,
          quantity: orderQuantity,
          Original_TotalPrice:getOriginal_TotalPrice().value,
          totalPrice: getTotalPrice().value,
          basePrice: getBasePrice().value,
          storeId: router.query.id as string,
          storeName: router.query.name as string,
        },
      ]),
    )
    console.log(phone)
    if (typeof(phone) !== "undefined"){
      sessionStorage.setItem("phone",String(phone))
    }
    router.push(
      {
        pathname: router.query.to === '/review' ? '/stores/[name]/review' : '/stores/[name]',
        query: {
          ...parsedPreviousQuery,
          addedCartLength: storedCart.length,
        },
      },
      router.query.to === '/review'
        ? `/stores/${parsedPreviousQuery.name}/review`
        : `/stores/${parsedPreviousQuery.name}`,
    )

    dispatch(setStoredCartUpdated(true))
    dispatch(setStoredFoodStore(foodStore))
  }
  return (
    <>
      {loading && <Loading />}
      <Head>
        <title style={{ fontFamily: "Sriracha-Regular" }}>{name}</title>
      </Head>
      <div className="flex h-screen flex-col" style={{ fontFamily: "Sriracha-Regular" }}>
        <div className="flex-1 overflow-auto">
          {original_image ? (
            <div className="relative h-56 w-full">
              <Image
                src={original_image as string}
                alt={menu_name as string}
                unoptimized
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : null}
          <div className="space-y-4 p-5">
            <div className="text-center text-3xl font-bold">{tMenuName}</div>
            {/* <div className="text-center text-[#999]">{tMenuDescription}</div> */}
            <div className="flex flex-row space-x-4 px-5">
              {isReviewCountable(review_count as string) ? (
                <Link
                  href={{
                    pathname: `/stores/${name}/${menuId}/review`,
                    query: { id, reviewCount: parseInt(review_count as string, 10) },
                  }}
                  as={`/stores/${name}/${menuId}/review`}
                >
                  <button className="w-1/2 rounded-md bg-primary py-2 text-lg text-white">
                    {/*리뷰*/}
                    รีวิว {`(${review_count})`}
                  </button>
                </Link>
              ) : (
                <button className="w-1/2 rounded-md bg-primary/40 py-2 text-lg text-white" disabled>
                  {/*리뷰*/}
                  รีวิว
                </button>
              )}
              <button
                className="w-1/2 rounded-md bg-primary py-2 text-lg text-white"
                onClick={() => {
                  setAlertVisible(true)
                }}
              >
                {/*번역*/}
                การแปล
              </button>
            </div>
          </div>

          <div className="flex flex-row justify-between border-y border-gray-200 px-5 py-4 text-lg font-bold">
            <div>
              {/*가격*/}
              ปกติ
            </div>
            <div>₩ {insertCommas(Number(price))}</div>
          </div>
          <div className="border-b border-gray-200 px-5 py-4">
            {menuOptions?.map((option, index2) => (
              <div key={option.slug} className="mb-4 border-b border-gray-200 pb-2">
                <div className="text-lg font-bold">{option.translatedName || option.name}
                  <p>{"\n"}</p>
                  <p style={{ fontSize: "13px", color: "red" }}>{option.multiple_count > 0 ? option.mandatory ? `เลือกสิ่งที่ต้องการ ${option.multiple_count} อย่าง.` : `เลือกได้สูงสุด ${option.multiple_count} แบบ.` : null}</p>
                </div>
                {
                  option.subchoices.map((subOption, index) => (
                    <div
                      key={subOption.id}
                      className="flex flex-row items-center justify-between py-2"
                    >
                      <label className="flex flex-row items-center">
                        {
                          !option.multiple
                            ? !option.mandatory ? <input
                              type="checkbox"
                              name={option.name}
                              defaultChecked={false}
                              onChange={(event) => {
                                handleOptionClick(
                                  {
                                    index2,
                                    optionSlag: option.slug,
                                    optionName: option.name,
                                    optionTranslatedName: option.translatedName,
                                    subOptionName: subOption.name,
                                    subOptionTranslatedName: subOption.translatedName,
                                    original_subOptionPrice: subOption.price,
                                    subOptionPrice: return_price(subOption.price),
                                    multiple_count: option.multiple_count,
                                    mandatory:option.mandatory
                                  },
                                  event.target.checked,
                                  event
                                )
                                // handleOptionClick(subOption.name, subOption.price, event.target.checked)
                              }}
                            /> :
                              <input
                                type="radio"
                                name={`${option.name}${index2}`}
                                defaultChecked={index === 0}
                                onChange={() => {
                                  UniquehandleOptionClick(
                                    {
                                      index2: index2,
                                      optionName: option.name,
                                      optionTranslatedName: option.translatedName,
                                      subOptionName: subOption.name,
                                      subOptionTranslatedName: subOption.translatedName,
                                      original_subOptionPrice: subOption.price,
                                      subOptionPrice: return_price(subOption.price),
                                    }
                                  )


                                  // handleOptionClick(subOption.name, subOption.price, event.target.checked)
                                }
                                }

                              />
                            : <input
                              type="checkbox"
                              name={option.name}
                              defaultChecked={false}
                              onChange={(event) => {
                                handleOptionClick(
                                  {
                                    index2,
                                    optionSlag: option.slug,
                                    optionName: option.name,
                                    optionTranslatedName: option.translatedName,
                                    subOptionName: subOption.name,
                                    subOptionTranslatedName: subOption.translatedName,
                                    original_subOptionPrice: subOption.price,
                                    subOptionPrice: return_price(subOption.price),
                                    multiple_count: option.multiple_count,
                                    mandatory:option.mandatory
                                  },
                                  event.target.checked,
                                  event
                                )
                                // handleOptionClick(subOption.name, subOption.price, event.target.checked)
                              }}
                            />
                        }
                        <span className="ml-2 w-40">{subOption.translatedName || subOption.name}</span>
                      </label>
                      <span>+ ₩ {insertCommas(return_price(subOption.price))}</span>
                    </div>
                  ))
                }
              </div>
            ))}
            <div className="flex flex-row items-center justify-between">
              <div className="text-lg font-bold">
                {/*주문 수량*/}
                จำนวนที่สั่ง
              </div>
              <div className="rounded-md border border-gray-300 p-2 text-center">
                <button className="w-8 text-lg" onClick={() => handleQuantityClick('minus')}>
                  -
                </button>
                <span className="inline-block w-8 text-[#c71719]">{orderQuantity}</span>
                <button className="w-8 text-lg" onClick={() => handleQuantityClick('plus')}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={addCartAndBack}
          className="h-20 w-full bg-primary text-2xl font-bold text-white"
        >
          {/* 장바구니에 추가 1 ₩ 10,500 */}
          {`ใส่ตะกร้า ${orderQuantity} ₩ ${getTotalPrice().label}`}
        </button>

        {showPopup ? (
          <Popup
            message={
              <div className="text-center">
                1 ตะกร้า สําหรับ 1 ร้าน
                <span className="mt-2 block text-sm text-[#666]">
                  หากมีการเพิ่มเมนูที่เลือกลงในตะกร้าสินค้า เมนูที่มีอยู่จะถูกลบ{' '}
                </span>
              </div>
            }
            onClose={() => setShowPopup(false)}
            onOk={replaceCart}
            okText="ใส่"
          />
        ) : null}

        {alertVisible ? (
          <TranslatePopup
            onClose={(closed) => setAlertVisible(closed)}
            onClick={(to) => {
              setLoading(true)
              handleTranslate(to)
            }}
          />
        ) : null}
      </div>
    </>
  )
}

export default MenuDetails
