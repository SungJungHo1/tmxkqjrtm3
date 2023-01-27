import { NextPage } from 'next'
import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Toast from '@/components/toast'
import axios from 'axios'
import type { Liff } from "@line/liff";
import { useRouter } from 'next/router'
import Image from 'next/image'
import { insertCommas } from '@/libs/utils'
import swal from 'sweetalert2'

type UnPromise<T> = T extends Promise<infer X> ? X : T;

const Order: NextPage = () => {
  const [ColorState, setColorState] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  const [OnHidden, setOnHidden] = useState(true)
  const [SummitClicked, setSummitClicked] = useState(false)
  const [bankName, setbankName] = useState("하나")
  const [User_Point, setUser_Point] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [userId, setuserId] = useState<string>('')
  const [userName, setuserName] = useState<string>('')

  const [liffObject, setLiffObject] = useState<Liff | null>(null);

  useEffect(() => {
    let liff_ID = "1657404178-OkbrA8Ae"
    // to avoid `window is not defined` error
    async function liffLogin() {
      const liff = (await import('@line/liff')).default;
      try {
        await liff.init({ liffId: liff_ID }).then(() => {
          // console.log("LIFF init succeeded.");
          setLiffObject(liff);
        })
      } catch (err) {
        console.error('liff init error', err.message);
      }
    }
    liffLogin();

  }, []);

  useEffect(() => {
    if (liffObject !== null) {
      liffObject.ready.then(async () => {
        const liffprofile: UnPromise<ReturnType<typeof liffObject.getProfile>> = await liffObject.getProfile();
        setuserId(liffprofile.userId)
        setuserName(liffprofile.displayName)
        await axios
        .get(`https://www.fastfood.p-e.kr/find_User_Data2?User_ID=${encodeURIComponent(liffprofile.userId)}`, {//
        }).then((res) => {
            if (res.data){
                setUser_Point(Number(res.data.Point))
            }
          }
        );
      })
    }
  }, [liffObject])

  useEffect(() => {
    if (liffObject !== null) {
      
    }
  }, [liffObject])

  const { register, handleSubmit } = useForm()
  const router = useRouter()
  const formRef = useRef()

  const onSubmit = async (data) => {
    // 둘 다 입력이 안되어있을 때 에러
    if (SummitClicked) {
      return
    }
    if (User_Point < 10000){
      swal.fire("คุณสามารถถอนได้มากกว่า 10,000 วอน")
      return
    }
    setSummitClicked(true)
    console.log(data)
    if (!(data.Name && data.accountName)) {
      setErrorMessage('กรุณาป้อนข้อมูลทั้งหมดค่ะ')
      setSummitClicked(false)
      setToastVisible(true)
      setColorState("")
      return
    }

    setOnHidden(!OnHidden)
    setErrorMessage("คำขอคืนเงินเสร็จสมบูรณ์ค่ะ.")
    setToastVisible(true)
    setColorState("success")
    const On_User = sessionStorage.getItem("On_User")
    let new_Cus = false
    if (On_User === "On"){
      new_Cus = false
    }
    else{
      new_Cus = true
    }
    
    await axios //"Ua80cd1a19a12cb88657950e300a68594"
      .post(`https://www.fastfood.p-e.kr/refund`, {
      // .post(`http://localhost/refund`, {
        'UserName':userId,
        'UserId':userName,
        'Name':data.Name,
        'BankName':bankName,
        'accountName':data.accountName,
        "Refund_Point":User_Point
      })
      .then((res) => {
        
        swal.fire({
          title: 'คำขอคืนเงินเสร็จสมบูรณ์แล้วค่ะ หากลูกค้ากดยืนยันจะไปที่หน้าให้คำปรึกษาค่ะ.',
          confirmButtonText: 'Ok',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
            liffObject.closeWindow()
        })
      })
      
  }

  const isOpened = (opened) => {
    if (!opened) {
      setToastVisible(false)
    }
  }

  const handleChange = (e) => {
      setbankName(e.target.value)
  }
  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Head>
        <title>คืนเงิน</title>
      </Head>
      <Toast message={errorMessage} open={toastVisible} onOpen={isOpened} delay={3000} color={ColorState} />

      <div className="flex h-screen flex-col">
        {!OnHidden ? <div className="absolute z-10 flex h-full w-full flex-col justify-center bg-black/70 px-2 text-center text-xs text-white">
          <p style={{ fontSize: '30px', lineHeight: '150%', fontFamily: "Sriracha-Regular" }}>{'กำลังยืนยันคำสั่งซื้อ โปรดรอสักครู่เนื่องจากคำสั่งซื้อจะถูกย้ายไปที่หน้าต่างบรรทัดหลังจากการยืนยัน'}</p>
          <Image src="/images/Inter.svg" alt="home" width={300} height={300} unoptimized/>
        </div> : null}
        <div className="flex-1 space-y-5 overflow-auto p-5">
          {/* <div id="map" ref={mapElement} style={{ width: '100 %', height: '200px' }} hidden={!OnHidden}></div>
           */}
          
          <div className="text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>
            {/*환불정보*/}
            ข้อมูลการคืนเงิน
          </div>
          <div className="text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>
            {/*환불정보*/}
            <br/>
            จุดแลกของสมนาคุณ <p className="text-[#FF3333]">{insertCommas(User_Point)}₩</p>
          </div>

          <p>ธนาคาร</p>
          <select className='w-full rounded-md' style={{ fontFamily: "Sriracha-Regular"}} onChange={handleChange}>
            <option
              value= "하나"
            >KEB Hana Bank
            </option>
            <option
              value= "우리"
            >Woori Bank
            </option>
            <option
              value= "기업"
            >IBK기업
            </option>
            <option
              value= "전북"
            >Jeonbuk Bank
            </option>
            <option
              value= "농협"
            >NH Bank
            </option>

            <option
              value= "국민"
            >KooKmin bank
            </option>
            <option
              value= "부산"
            >Busan Bank
            </option>
            <option
              value= "신한"
            >Shinhan Bank
            </option>
            <option
              value= "토스"
            >Toss Bank
            </option>
            <option
              value= "광주"
            >Kwangij Bank
            </option>

            <option
              value= "케이뱅크"
            >K-bank
            </option>
            <option
              value= "신협"
            >NCUFK
            </option>
            <option
              value= "카카오"
            >Kakao Bank
            </option>
            
		      </select>

          <label className="block">
            <input
              {...register('Name')}
              // 예금주
              placeholder="ชื่อบัญชีเกาหลี(ใส่ชื่อลูกค้า)"
              // defaultValue={Add["add1"]}/
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          {/* <label className="block">
            <input
              {...register('BankName')}
              // 은행명
              placeholder="ธนาคาร"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label> */}
          
          <label className="block">
            <input
              // 계좌번호
              {...register('accountName')}
              placeholder="เลขที่บัญชี"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          
          <div className="mt-3 rounded-md border-2 border-black p-3 text-[#333]  text-center " style={{ fontSize: '18px', lineHeight: '150%', fontFamily: "Sriracha-Regular" }}>
            ขออภัยในความไม่สะดวกค่ะลูกค้า แอดมินไม่สามารถคืนเงินได้ทันทีเนื่องจากมีคำสั่งซื้อของลูกค้าคนอื่นๆจำนวนมาก กรุณารอสักครู่นะคะ ขอบคุณที่เข้าใจแอดมินค่ะ<br/>
            ลูกค้าที่ต้องการคืนเงินกรุณารอตามเวลานะคะ🙏<br/><br/>
            Fast Food คืนเงิน 1 รอบ ค่ะ<br/><br/>
            ทุกวัน 23:00 PM ถึง 24:00 PM<br/>
          </div>
          
        </div>

        <button className="h-20 w-full bg-primary text-2xl font-bold text-white" type="submit" style={{ fontFamily: "Sriracha-Regular" }}>
          {/*구매하기*/}
          ขอคืนเงิน
        </button>
      </div>
    </form >
  )
}
export default Order
