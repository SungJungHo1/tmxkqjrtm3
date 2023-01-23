import { GetServerSideProps, NextPage } from 'next'
import { ClockIcon, RefreshIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import Home_Button2 from '@/components/home_Button2'

import axios from 'axios'
import React from 'react'
import { useRef, useState, useEffect } from 'react'
import https from 'https'
import Image from 'next/image'
import swal from 'sweetalert2'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import Swal from 'sweetalert2'

const Testpage: NextPage<{
  position: { longitude: number; latitude: number } | null,
  data: any
}> = ({ data,position }) => {

  const router = useRouter()
  const [SaveData, setSaveData] = useState(null)
  const [Account, setAccount] = useState(null)
  useEffect(()=>{
    setSaveData(data)
  },[])
  // console.log(router.query.UserId)
  const Count_Money=(Cart)=>{
    let Total_M = 0
    Cart.map((i)=>{
      Total_M += i.totalPrice
    })
    return Total_M
  }
  const Reloaded=async ()=>{
    let res
      res = await axios.get(
        `https://www.fastfood.p-e.kr/find_Order_Datas?userId=${router.query.UserId}`,
        // `${process.env.API_HOST}/find_Order_Datas?userId=${'Ua405f456c424b90f2d3271fac5f723a6'}`,
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
      setSaveData(res.data)
  }

  useEffect(()=>{
      axios.get(
        `https://www.fastfood.p-e.kr/getAccount`,
        // `${process.env.API_HOST}/find_Order_Datas?userId=${'Ua405f456c424b90f2d3271fac5f723a6'}`,
        {
          headers: {
            'x-apikey': 'iphoneap',
            'x-apisecret': 'fe5183cc3dea12bd0ce299cf110a75a2',
          },
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
          }),
        },
      ).then((res)=>{
        setAccount(res.data)
      })

      if (router.query.Ordered === "true"){
        // Swal.fire("주문이 완료되었습니다. 주문내역페이지에서 모든 내용을 확인하실수있습니다.\n문의가 필요하시다면 아래 라인 버튼을 클릭해주세요")
        Swal.fire("ลูกค้าคะ สั่งอาหารเรียบร้อยแล้วนะคะ!\nลูกค้าสามารถเช็คข้อมูลการสั่งจากยอดเงินจนถึงเวลาถึงในหน้าประวัติการสั่งอาหารได้ค่ะ\nสำหรับลูกค้าที่สอบถามเพิ่มเติม กรุณากดที่ปุ่ม LINE ค่ะ")
      }
  },[])

  const handleCopyClipBoard = (text: string) => {
    // 1. 임시 textarea 요소를 생성하고 body에 부착
      try{
        const $textarea = document.createElement('textarea');
        document.body.appendChild($textarea);
      // 2. props로 받은 text값을 textarea의 value로 대입하고 textarea 영역 내 모든 텍스트를 선택(드래그효과)
        $textarea.value = text;
        $textarea.select();
      // 3. execCommand 함수를 이용해 클립보드에 복사
        document.execCommand('copy');
        // 4. 임시 textarea 요소 제거
        document.body.removeChild($textarea);
        swal.fire("คัดลอกเลขบัญชีเรียบร้อยแล้วค่ะ")
      }catch(error){
        swal.fire(error)
      }
    }
  
  const handleClickStore = (query) => {
      router.push(`/test_OrderList?Order_Code=${query}`,'/OrderDetail')
  }
  const Make_left_time=(time:string,count)=>{
    const OrderTime = new Date(time)
    OrderTime.setMinutes(OrderTime.getMinutes() + count)
    const today = new Date()
    
    let M_Time = OrderTime.getTime()- today.getTime()
    let left_time = M_Time / 1000 / 60

    return left_time.toFixed()
  }
  return (
    <div >
      <button
          className={`fixed bottom-8 right-1 z-10`}
          onClick={()=>{router.push("https://lin.ee/Zn7EZ6T")}}
      >
          <img className="h-14 w-18" src={"/images/Line-Logo-700x394.png"} alt="" />
      </button>
      <div style={{position:'fixed', width:'100%',zIndex:'5'}}>
        <div className="h-12 grid grid-cols-10 items-center grid-rows-1 bg-primary text-[#FFFFFF] " style={{ fontFamily: "Sriracha-Regular" }}>
          <p className='col-start-4 col-end-8'>รายละเอียดการสั่งซื้อ</p>
          <button className='col-start-10 col-end-10' onClick={()=>Reloaded()}><RefreshIcon className="inline-block h-7 w-7"/></button>
        </div>
        
        <div className="grid grid-cols-10 grid-rows-6 gap-2 h-48 bg-white text-[#000000]" style={{ fontFamily: "Sriracha-Regular" }}>
          <div className="row-start-2 h-24 w-24 flex-[0_0_6rem] overflow-hidden rounded-md bg-slate-300">
            <Image src={'/images/categories/Fastfood.png'} width={105} height={100} alt="logo" unoptimized/>
          </div>
          {/* 은행명 */}
          <div className="row-start-2 col-start-4 col-end-6" style={{fontSize:"13px" }}>ธนาคาร</div>
          <div className="row-start-2 col-start-7 col-end-11 " style={{fontSize:"14px" }}>{Account?.Account_Name}</div>
          {/* 예금주 */}
          <div className="row-start-3 col-start-4 col-end-7" style={{fontSize:"13px" }}>ชื่อบัญชีเกาหลี</div>
          <div className="row-start-3 col-start-7 col-end-11" style={{fontSize:"14px" }}>{Account?.Bank_Name}</div>
          {/* 계좌번호 */}
          <div className="row-start-4 col-start-4 col-end-6" style={{fontSize:"13px" }}>เลขที่บัญชี</div>
          <div className="row-start-4 col-start-7 col-end-11" style={{fontSize:"13px" }}>{Account?.Account_Number}</div>
          
          {/* 추가배달비 */}
          <div className="row-start-5 col-start-2 col-end-10 text-[#037bfc]" style={{fontSize:"13px" }}>เราขออภัยคุณลูกค้าหากมีค่าบริการเพิ่มเติมนอกเหนือจากค่าบริการจัดส่งที่แสดงขึ้นอยู่กับระยะทางในการจัดส่ง</div>
        </div>
        <button className="h-10 w-full rounded-b-xl text-[#000000]" style={{ fontFamily: "Sriracha-Regular" ,backgroundColor:"#E0E0E0"}} onClick={()=>handleCopyClipBoard(Account?.Account_Number)} >
              <p>คัดลอกเลขบัญชี</p>
        </button>
      </div>
      <div style={{ height:"280px"}}/>
      
      
        {SaveData?.Order_List.length > 0 ? (
          SaveData?.Order_List.map((datas) => (
            <button className="h-full py-1" style={{ fontFamily: "Sriracha-Regular"}}
              key={datas.Order_Code}
              onClick={()=>
                handleClickStore(datas.Order_Code)
              }
            >
              <div className="grid grid-cols-7 grid-rows-8 h-32 bg-slate-200 rounded-xl">
                <div className="row-start-2 row-end-6 pl-6">
                  {datas.thumbnail_url ? 
                  <div className="relative h-20 w-24 flex-[0_0_6rem] overflow-hidden rounded-md bg-slate-300">
                    <Image src={datas.thumbnail_url} width={120} height={100} alt="logo" unoptimized/>
                  </div> :
                  <div className="relative h-20 w-24 flex-[0_0_6rem] overflow-hidden rounded-md bg-slate-300"></div>}
                  
                </div>
                {datas.Cancel?
                // 캔슬
                <div className="col-start-7 col-end-8 text-[#FF0000] border-solid border-2 border-indigo-600 border-black rounded-xl" style={{fontSize:"14px" ,float: 'right'}}>{'ยกเลิก'}</div>
                :
                !datas.deposit?
                // 입금확인중
                <div className="col-start-5 col-end-8 text-[#FF0000] border-solid border-2 border-indigo-600 border-black rounded-xl" style={{fontSize:"15px" ,float: 'right'}}>{'กำลังเช็คยอดเงิน'}</div>:
                datas.Order_End ?
                !datas.Del_End?
                // 주문확인중
                <div className="col-start-5 col-end-8 text-[#000000]  border-solid border-2 border-indigo-600 border-black rounded-xl" style={{fontSize:"15px" ,float: 'right'}}>{'กำลังดำเนินการ'}</div>:null
                :datas.Del_End?
                // 배달완료
                <div className="col-start-6 col-end-8 text-[#000000]  border-solid border-2 border-indigo-600 border-black rounded-xl" style={{fontSize:"13px" ,float: 'right'}}>{'อาหารถึงแล้ว'}</div>:
                datas.hasOwnProperty('Wait_Time')?
                // 도착예정
                <div className="col-start-5 col-end-8 text-[#037bfc]  border-solid border-2 border-indigo-600 border-black rounded-xl" style={{fontSize:"13px" ,float: 'right'}}>{`ใช้เวลาประมาณ ${Make_left_time(datas.Order_End_Time,datas.Wait_Time)} นาที`}</div>:
                //도착시간 확인중
                <div className="col-start-6 col-end-8 text-[#037bfc]  border-solid border-2 border-indigo-600 border-black rounded-xl" style={{fontSize:"13px" ,float: 'right'}}>{`ตรวจสอบเวลา`}</div>}
                
                <div className="row-start-2 col-start-3 col-end-8 text-lg font-bold"style={{fontSize:"14px"}}>{datas.Cart[0].storeName}</div>
                <div className="row-start-3 row-end-4 col-start-5 col-end-8 font-bold pl-20" style={{float: 'right'}}>
                  
                  {datas.use_point?
                  <>
                    <span>
                      {Count_Money(datas.Cart) + parseInt(datas.Service_Money) + parseInt(datas.delivery_fee) - parseInt(datas.use_point)} ￦
                    </span>
                    <br/>
                    <span className="text-[#FF3333]">
                      {parseInt(datas.use_point)} ￦
                    </span>
                  </>
                  :
                  <span>
                    {Count_Money(datas.Cart) + parseInt(datas.Service_Money) + parseInt(datas.delivery_fee)} ￦
                  </span>}
                </div>
                <div className="row-start-6 col-start-5 col-end-8" style={{fontSize:"15px"}}>
                  {/* 시간 */}
                  <span >
                    <ClockIcon className="inline-block h-5 w-5 align-text-top text-[#7c7c7c]" />{' '}
                    {datas.Order_Time}
                  </span>
                </div>
              </div>
            </button>
          ))
        ): (
          <div style={{ fontFamily: "Sriracha-Regular" }}>
            {/*조회 결과가 없습니다.*/}
            ไม่มีผลการค้นหา
          </div>
        )}
        <Home_Button2 position={position}/>
      </div>
    
  
  )
}

export default Testpage

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    let res
      res = await axios.get(
        `${process.env.API_HOST}/find_Order_Datas?userId=${query.UserId}`,
        // `${process.env.API_HOST}/find_Order_Datas?userId=${'Ua405f456c424b90f2d3271fac5f723a6'}`,
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
        data: res.data,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: {},
    }
  }
}
