import { NextPage } from 'next'
import { UploadIcon } from '@heroicons/react/outline'
import Head from 'next/head'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Toast from '@/components/toast'
import { useGeolocation } from '@/hooks/use-geolocation'
import axios from 'axios'
import { useAppSelector } from '@/hooks/use-reducer-hooks'
import { cartSelector } from '@/app/appSlice'
import produce from 'immer'
import type { Liff } from "@line/liff";
import { useRouter } from 'next/router'
import Image from 'next/image'
import swal from 'sweetalert2'
import imageCompression from 'browser-image-compression';
import { MessengerSize } from 'react-facebook'


const Order: NextPage<{
  liff: Liff | null;
}> = ({ liff }) => {
  const [deliveryEtcVisible, setDeliveryEtcVisible] = useState(false)
  const [ColorState, setColorState] = useState("")
  const [toastVisible, setToastVisible] = useState(false)
  // const [IMGtoastVisible, setIMGToastVisible] = useState(false)
  const [Add,setAdd]  = useState({"add1":"","add2":""})
  const [OnHidden, setOnHidden] = useState(true)
  const [SummitClicked, setSummitClicked] = useState(false)
  // const [uploadedToastVisible, setUploadedToastVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [userId, setuserId] = useState<string>('')
  const [userName, setuserName] = useState<string>('')
  const [serveis_money, setServeis_money] = useState(3000);
  const cart = useAppSelector(cartSelector)
  const [position] = useGeolocation()
  const cartOrder = produce(cart, (draft) =>
    draft.forEach((item) => {
      delete item.menu.original_image
    }),
  )
  const { register, handleSubmit, watch } = useForm()
  const watchFile = watch('addressPhoto')
  useEffect(() => {
    setuserId(sessionStorage.getItem("userId"))
    setuserName(sessionStorage.getItem("userName"))
  }, [])
  const router = useRouter()
  const formRef = useRef()

  const handleFileOnChange = async (files) => {
    let file = files;

    const options = { 
      maxSizeMB: 2, 
    }
    
    try {
      const compressedFile = await imageCompression(file, options);
      // console.log(compressedFile)
      return compressedFile
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeliveryMessageChange = (e) => {
    if (e.target.value === 'etc') {
      setDeliveryEtcVisible(true)
    } else {
      setDeliveryEtcVisible(false)
    }
  }

  const mapElement = useRef(null);

  useEffect(() => {
    if (userId === "비회원"){
      swal.fire('비회원입니다!')
    }
    setAdd({"add1":sessionStorage.getItem('add1'),"add2":sessionStorage.getItem('add2')})
  }, [userId]);

  useEffect(() => {
    setServeis_money(Number(sessionStorage.getItem("Service_Money")))
  }, []);

  // useEffect(() => {
  //   const { naver } = window;
  //   if (!mapElement.current || !naver) return;

  //   // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
  //   // const location = new naver.maps.LatLng(position?.latitude, position?.longitude);
  //   // const mapOptions: naver.maps.MapOptions = {
  //   //   center: location,
  //   //   zoom: 17,
  //   //   zoomControl: true,
  //   //   zoomControlOptions: {
  //   //     position: naver.maps.Position.TOP_RIGHT,
  //   //   },
  //   // };
  //   // const map = new naver.maps.Map(mapElement.current, mapOptions);

  //   // var marker = new naver.maps.Marker({
  //   //   position: location,
  //   //   map,
  //   // });
  //   // naver.maps.Event.addListener(map, 'click', function (e) {
  //   //   marker.setPosition(e.coord);
  //   //   console.log(marker)
  //   // });

  // }, [position]);

  // if ()alert('form: ' + JSON.stringify(data) + '//// cart: ' + JSON.stringify(cartOrder))
  const onSubmit = async (data) => {
    // 둘 다 입력이 안되어있을 때 에러
    if (SummitClicked) {
      return
    }
    setSummitClicked(true)
    if (!(data.address || data.addressPhoto.length)) {
      if (Add["add1"] === "" || Add["add1"] === null){
        setErrorMessage('โปรดป้อนที่อยู่ของคุณหรืออัปโหลดรูปภาพที่มีที่อยู่')
        setSummitClicked(false)
        setToastVisible(true)
        setColorState("")
        return
      }
      else {
        data.address = Add["add1"]
        data.addressDetail = Add["add2"]
      }
    }
    if (!data.phone) {
      setErrorMessage('กรุณาใส่หมายเลขโทรศัพท์มือถือของคุณ')
      setSummitClicked(false)
      setToastVisible(true)
      setColorState("")

      return
    }

    const formData = new FormData(formRef.current)
    // console.log(formData)
    if (data.addressPhoto.length) {
      formData.append('file', data.addressPhoto[0])
    }
    // if (!liff.isLoggedIn()){
    //   await swal.fire({
    //     title: '주문하시겠습니까?',
    //     confirmButtonText: '로그인',
    //   }).then((result) => {
    //     /* Read more about isConfirmed, isDenied below */
    //     if (result.isConfirmed) {
    //       liff.login()
    //       return
    //     }
    //   })

    //   return
    // }
    
    if (cartOrder) {
      formData.append('cart', JSON.stringify(cartOrder))
    }
    var Messege = []
    var Order_Code = ""
    setOnHidden(!OnHidden)
    setErrorMessage("การสั่งซื้อมีเวลาจำกัด~!")
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
    
    const File_Dates = await handleFileOnChange(data.addressPhoto[0])
    await axios //"U812329a68632f4237dea561c6ba1d413"
      .postForm(`https://www.fastfood.p-e.kr/pushOrder?userId=${userId}&userName=${encodeURIComponent(userName)}&new_cus=${new_Cus}&delivery_fee=${router.query.fee}&Service_Money=${serveis_money}&ImageIn=${data.addressPhoto[0] !== undefined ? 'yes' : 'no'}`, {
      // .postForm(`https://www.fastfood.p-e.kr/pushOrder?userId=${'U812329a68632f4237dea561c6ba1d413'}&userName=${"크턱"}&new_cus=${new_Cus}&delivery_fee=${router.query.fee}&Service_Money=${serveis_money}&ImageIn=${data.addressPhoto[0] !== undefined ? 'yes' : 'no'}`, {
        // .postForm(`http://localhost/pushOrder?userId=${'U812329a68632f4237dea561c6ba1d413'}&userName=${"크턱"}&new_cus=${new_Cus}&delivery_fee=${router.query.fee}&Service_Money=${serveis_money}&ImageIn=${data.addressPhoto[0] !== undefined ? 'yes' : 'no'}`, {
        OrderData: JSON.stringify(data),
        cart: JSON.stringify(cartOrder),
        lan: position.latitude,
        lng: position.longitude,
        thumbnail_url: sessionStorage.getItem("thumbnail_url"),
        // image: data.addressPhoto[0] ? data.addressPhoto[0] : null
        image: data.addressPhoto[0] ? File_Dates : null,
        phone:sessionStorage.getItem("phone"),
        use_point:sessionStorage.getItem("Use_Point")
      })
      .then((res) => {
        Messege = res.data.datas
        Order_Code = res.data.Order_Code
        // console.log(Messege)
        // router.push(`/testpage?UserId=${'U812329a68632f4237dea561c6ba1d413'}`)
      })
    if(liff.isLoggedIn()){
      await liff
      .sendMessages(Messege)
    
      await liff
          .sendMessages([
            {
              type: "text",
              text: `- หมายเลขคำสั่งซื้ออาหาร : ${Order_Code}\n\nโอนแล้วรบกวนแจ้งสลิปด้วยนะคะ🙏`,
            },
          ])
          .then(() => {
            liff.closeWindow()
              // router.push(`/testpage?UserId=${userId}&Ordered=${true}`)
            })
            .catch((err) => {
              liff.closeWindow()
              // router.push(`/testpage?UserId=${userId}&Ordered=${true}`)
            });
    }
    else{
      setToastVisible(false)
      setOnHidden(!OnHidden)
      // swal.fire("주문이 완료되었습니다.")
    }
    
      
  }

  const isOpened = (opened) => {
    if (!opened) {
      setToastVisible(false)
    }
  }

  useEffect(() => {
    if (watchFile?.[0]) {
      setErrorMessage("อัพโหลดรูปภาพแล้ว")
      setToastVisible(true)
      setColorState("success")
    }
  }, [watchFile])

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
      <Head>
        <title>สั่งซื้อ</title>
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
          
          <div style={{ fontSize: '18px', lineHeight: '150%', fontFamily: "Sriracha-Regular", color: "slateblue" }}>เมื่อสั่งอาหารแล้วที่อยู่จะถูกลงทะเบียนโดยอัตโนมัติในแอปค่ะ สั่งครั้งหน้าไม่ต้องส่งไปให้แอดมินค่ะ ลูกค้าสามารถสั่งอาหารได้โดยคลิกครั้งเดียวค่ะ</div>
          <div className="text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>
            {/*배송정보*/}
            ข้อมูลการจัดส่ง
          </div>
          <label className="block">
            <input
              {...register('address')}
              // 주소를 입력하세요
              placeholder="กรุณากรอกที่อยู่"
              value={Add["add1"] !== ""?Add["add1"]:undefined}
              // defaultValue={Add["add1"]}/
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          <label className="block">
            <input
              {...register('addressDetail')}
              // 방 번호
              placeholder="เลขที่ห้อง"
              defaultValue={Add["add2"]}
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          <label className="block">
            <input
              // 1층 현관 비밀번호
              {...register('firstFloorEntranceCode')}
              placeholder="รหัสเข้าประตูชั้นที่1"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          <label className="block h-16 w-full bg-primary text-center text-lg leading-[4rem] text-white" style={{ fontFamily: "Sriracha-Regular" }}>
            <UploadIcon className="mr-1 inline-block h-5 w-5 align-sub " />
            {/*주소 사진 업로드*/}
            อัพโหลดที่อยู่ ภาพถ่าย
            <input {...register('addressPhoto')} type="file" accept="image/*" className="hidden" />
          </label>
          <div className="pt-4 text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>
            {/*배달 시 요청*/}
            คำร้องขอเมื่อจัดส่ง
          </div>
          <label className="flex flex-row items-center" style={{ fontFamily: "Sriracha-Regular" }}>
            <input
              {...register('deliveryMessage')}
              type="radio"
              name="deliveryMessage"
              value="기본"
              defaultChecked={true}
              onChange={handleDeliveryMessageChange}
            />
            <span className="ml-2">
              {/*기본*/}
              ปกติ
            </span>
          </label>
          <label className="flex flex-row items-center" style={{ fontFamily: "Sriracha-Regular" }}>
            <input
              {...register('deliveryMessage')}
              type="radio"
              name="deliveryMessage"
              value="문앞에 놓고 벨을 눌러 주세요"
              onChange={handleDeliveryMessageChange}
            />
            <span className="ml-2">
              {/*문앞에 놓고 벨을 눌러 주세요*/}
              วางไว้ที่ประตูแล้วกดกริ่ง
            </span>
          </label>
          <label className="flex flex-row items-center" style={{ fontFamily: "Sriracha-Regular" }}>
            <input
              {...register('deliveryMessage')}
              type="radio"
              name="deliveryMessage"
              value="문앞에 놓고 벨을 누르지 마세요"
              onChange={handleDeliveryMessageChange}
            />
            <span className="ml-2" style={{ fontFamily: "Sriracha-Regular" }}>
              {/*문앞에 놓고 벨을 누르지 마세요*/}
              วางไว้ที่ประตูและอย่ากดกริ่ง
            </span>
          </label>
          <label className="flex flex-row items-center">
            <input
              {...register('deliveryMessage')}
              type="radio"
              name="deliveryMessage"
              value="카운터에 맡겨주세요"
              onChange={handleDeliveryMessageChange}
            />
            <span className="ml-2" style={{ fontFamily: "Sriracha-Regular" }}>
              {/*카운터에 맡겨주세요*/}
              กรุณาฝากไว้ที่เคาน์เตอร์
            </span>
          </label>
          <label className="flex flex-row items-center">
            <input
              {...register('deliveryMessage')}
              type="radio"
              name="deliveryMessage"
              value="etc"
              onChange={handleDeliveryMessageChange}
            />
            <span className="ml-2" style={{ fontFamily: "Sriracha-Regular" }}>
              {/*기타(아래에 작성)*/}
              อื่น (เขียนด้านล่าง)
            </span>
          </label>
          {/* todo: 여기 클릭시 아래 입력칸 나오도록 */}
          {deliveryEtcVisible && (
            <input
              {...register('deliveryMessageEtc')}
              type="text"
              // 배송 옵션을 선택하세요
              placeholder="กรุณากรอกตัวเลือกการจัดส่ง"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          )}

          <div className="pt-4 text-lg font-bold" style={{ fontFamily: "Sriracha-Regular" }}>
            {/*구매자 정보*/}
            ข้อมูลผู้สั่งชื้อ
          </div>
          <label className="block">
            <input
              {...register('phone')}
              // 핸드폰번호
              placeholder="เบอร์โทร"
              className="h-14 w-full rounded-md border border-gray-300 p-4"
            />
          </label>
          <div>
            <p style={{ fontFamily: "Sriracha-Regular" }}>
              {/* {원활한 의사소통을 위해 휴대폰 번호를 알려주세요} */}
              โปรดระบุหมายเลขโทรศัพท์มือถือของคุณเพื่อการ สื่อสารที่ราบรื่นกับเรา
            </p>
            <p style={{ fontFamily: "Sriracha-Regular" }}>
              {/* {한국어를 몰라도 걱정 마세요(태국어를 할 수 있는 사람 있어요)} */}
              ไม่สำคัญว่าคุณไม่รู้ภาษาเกาหลี(มีคนสื่อสารภาษา ไทย)
            </p>
            {/* <p style={{ fontFamily: "Sriracha-Regular" }}>
              
              หากคุณไม่มีหมายเลขโทรศัพท์มือถือโปรดป้อน หมายเลข 0
            </p> */}
            {/* <pre style={{ fontFamily: "Sriracha-Regular" ,textAlign:'center'}}>
              กรุณาระบุหมายเลขโทรศัพท์มือถือขอ<br/>
              งคุณเพื่อการ ติดต่อสื่อสารที่ราบ<br/>
              รื่นกับเราเผื่อมีเหตุจำเป็นต้องแจ<br/>
               ้ง เช่น ร้านยกเลิกรายการ ต้องเลือกร<br/>
               ้านใหม่ แพดัลเข้าไปส่งไม่ได้ ประมา<br/>
              ณนี้ค่ะ<br/><br/>

              ไม่สำคัญว่าคุณไม่รู้ภาษาเกาหลี<br/>
              มีแอดมินคนไทยเป็นคนโทรสื่อสาร<br/>
              <br/>
              การใช้เบอร์ติดต่อสำคัญมากเพราะลู<br/>
              กค้าบางท่านไม่ว่างดูไลน์ไม่สามาร<br/>
              ถอ่านข้อความได้ ทางเราจำเป็นต้องใ<br/>
              ช้โทรเพื่อความรวดเร็ว กรุณาเข้าใจด<br/>
               ้วยนะคะ🙏🙏🙏
            </pre> */}
          </div>
        </div>
        <button className="h-20 w-full bg-primary text-2xl font-bold text-white" type="submit" style={{ fontFamily: "Sriracha-Regular" }}>
          {/*구매하기*/}
          การชำาระเงิน
        </button>
      </div>
    </form >
  )
}
export default Order
