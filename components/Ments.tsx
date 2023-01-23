const ments_Data = (id)=>
{   
    const ments = {
    "type": "bubble",
    "body": {
      "type": "box",
      "layout": "vertical",
      "contents": [
        {
          "type": "text",
          "text": "ลงทะเบียนที่อยู่",
          "weight": "bold",
          "size": "xxl",
          "margin": "md",
          "color": "#3366FF",
          "align": "center"
        },
        {
          "type": "separator",
          "margin": "xxl"
        },
        {
          "type": "box",
          "layout": "vertical",
          "margin": "xxl",
          "spacing": "sm",
          "contents": [
            {
              "type": "text",
              "text": `${id}ขอบคุณที่ลงทะเบียนที่อยู่คะ`,
              "wrap": true,
              "align": "center"
            },
            {
              "type": "text",
              "text": "อาจใช้เวลาประมาณ 5 นาทีนะคะ",
              "wrap": true,
              "align": "center",
              "contents": [
                {
                  "type": "span",
                  "text": "อาจใช้เวลาประมาณ "
                },
                {
                  "type": "span",
                  "text": "5",
                  "size": "xl",
                  "color": "#3366FF"
                },
                {
                  "type": "span",
                  "text": " นาทีนะคะ"
                }
              ]
            },
            {
              "type": "text",
              "text": "หลังจากลงทะเบียนเรียบร้อยแล้วแอดมินจะแจ้งในไลน์อีกทีนะคะ",
              "wrap": true,
              "align": "center"
            },
            {
              "type": "text",
              "text": "แอดมินจะแจ้งในไลน์หรือโทรหาลูกค้าอีกครั้ง",
              "wrap": true,
              "align": "center"
            },
            {
              "type": "text",
              "text": "กรุณาเช็คไลน์เพื่อความถูกต้องและรวดเร็วในการรับอาหารค่ะ",
              "wrap": true,
              "align": "center"
            }
          ]
        },
        {
          "type": "separator",
          "margin": "xxl"
        }
      ]
    },
    "styles": {
      "footer": {
        "separator": true
      }
    }
  }

  const datas = {
    "type": "flex",
    "altText": "ลงทะเบียนที่อยู่เสร็จแล้ว!",
    "contents": {
        "type": "carousel",
        "contents": [ments]
    }
  }

  return JSON.parse(JSON.stringify(datas))
}
export default ments_Data