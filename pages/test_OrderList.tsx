import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import axios from 'axios'
import https from 'https'

const Cart: NextPage<{
  Order: any
}> = ({ Order }) =>  {
  const Count_Money=(Cart)=>{
    let Total_M = 0
    Cart.map((i)=>{
      Total_M += i.totalPrice
    })
    return Total_M
  }
  return (
    <div className="flex h-screen flex-col" style={{ fontFamily: "Sriracha-Regular"}}>
      <div className="h-12 grid place-items-center bg-primary text-[#FFFFFF] " style={{ fontFamily: "Sriracha-Regular" ,position:'fixed', width:'100%',zIndex:'5'}}>
        <p>รายละเอียด</p>
      </div>
      <div style={{ height:'50px'}}/>
      <div className="flex-1 overflow-auto" >
        <div>
        <div className="w-full bg-primary h-12 grid place-items-center text-[#000000] "style={{ textAlign:"center",backgroundColor:"#E0E0E0"}}>รายการสั่งซื้อ</div>
          {Order.Cart.map((i) => (
            <div key={`menu.menuId_${i.menu.menuId}`} className="space-y-4 border-b border-gray-300 pl-6">
              <div className="space-y-4 " aria-label="stored-menu">
                <div className="flex flex-row items-center justify-between ">
                  <div>
                    <div className="text-lg font-bold">
                      {i.menu.menuTranslatedName || i.menu.menu_name}
                      <span className="ml-2 font-normal text-[#c71719]">x {i.quantity}</span>
                    </div>
                    <div>
                      <span aria-label="Regular" className="mt-1 inline-block text-gray-500">
                        {/* 기본 */}
                        {`ปกติ(+ ${insertCommas(Number(i.menu.price))})`}
                      </span>
                    </div>
                    {i.options.map((option, index) => (
                      <div key={`${option.optionTranslatedName || option.optionName}_${index}`}>
                        <span aria-label="Option" className="mt-1 inline-block">{`${option.subOptionTranslatedName || option.subOptionName
                          }(+ ${insertCommas(option.subOptionPrice)})`}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between">
                  
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pl-2">
          <div >
            <div className="flex flex-row justify-between">
            </div>
            <div className="h-20 border-b border-gray-300 w-full grid grid-cols-7 grid-rows-3" style={{textAlign:"left"}}>
              {/* 배송비 */}
              <p className="text-[#037bfc] row-start-1 col-start-1 col-end-3" style={{fontSize:"18px"}}>
                  {`ค่าจัดส่ง`}
              </p>
              <p className="text-[#037bfc] row-start-1 col-start-6 col-end-8" style={{fontSize:"18px"}}>
                {`${Order.delivery_fee} ￦`}
              </p>
              {/* 서비스비용 */}
              <p className="text-[#037bfc] row-start-2 col-start-1 col-end-3" style={{fontSize:"18px"}}>
                
                {`ค่าบริการ`}
              </p>
              <p className="text-[#037bfc] row-start-2 col-start-6 col-end-8" style={{fontSize:"18px"}}>
                {`${Order.Service_Money} ￦`}
              </p>
              {/* 총비용 */}
              <p className="text-[#037bfc] row-start-3 col-start-1 col-end-4" style={{fontSize:"18px"}}>
                {`รวมยอดทั้งหมด`}
              </p>
              <p className="text-[#037bfc] row-start-3 col-start-6 col-end-8" style={{fontSize:"18px"}}>
                {`${Count_Money(Order.Cart) + parseInt(Order.Service_Money) + parseInt(Order.delivery_fee)} ￦`}
              </p>
            </div>
            <div>{`ที่อยู่อาศัย : ${Order.Order_Data.address}`}</div>
            <div>{`ที่อยู่อย่างละเอียดชัดเจน : ${Order.Order_Data.addressDetail}`}</div>
            <div>{`รหัสผ่านชั้น 1 : ${Order.Order_Data.firstFloorEntranceCode}`}</div>
            <div>{`หมายเลขโทรศัพท์ : ${Order.Order_Data.phone}`}</div>
            <br></br>
            {Order.Addres_Url ? 
              <Image src={Order.Addres_Url} width={500} height={600} alt="address" />:null
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const Order_Datas = await axios.get(
      `${process.env.API_HOST}/Order_Data?Order_Code=${query.Order_Code}`,
      {
        headers: {
          'x-apikey': 'iphoneap',
          'x-apisecret': 'fe5183cc3dea12bd0ce299cf110a75a2',
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      },
    )
    return {
      props: {
        Order: Order_Datas.data,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {},
    }
  }
}
