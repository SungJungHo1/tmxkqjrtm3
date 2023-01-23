import styled from "styled-components";
import { useState } from "react";

const SelectBox = styled.div`
  position: relative;
  width: full;
  padding: 8px;
  border-radius: 12px;
  background-color: #ffffff;
  align-self: center;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  &::before {
    content: "⌵";
    position: absolute;
    top: 1px;
    right: 8px;
    color: #49c181;
    font-size: 20px;
  }
`;
const Label = styled.label`
  font-size: 14px;
  margin-left: 4px;
  text-align: center;
`;
const SelectOptions = styled.ul`
  position: absolute;
  list-style: none;
  top: 18px;
  left: 0;
  width: 100%;
  overflow: hidden;
  max-height: ${(props) => (props.show ? "none" : "0")};
  padding: 0;
  border-radius: 8px;
  background-color: #222222;
  color: #fefefe;
`;
const Option = styled.li`
  font-size: 14px;
  padding: 6px 8px;
  transition: background-color 0.2s ease-in;
  &:hover {
    background-color: #595959;
  }
`;

const CustomSelect = (props) => {
    const [currentValue, setCurrentValue] = useState("주소를 선택해주세요");
    const [isShowOptions, setShowOptions] = useState(false);
    const handleOnChangeSelectValue = (e,value) => {
      const { innerText} = e.target;
      console.log(e.target.children[0])
      setCurrentValue(innerText);

      if (e.target.value !== 12121){
        props.UserAdd?.map(async (i)=>{if(i.주소이름 === e.target.value){
          swal.fire(`${i.주소1}\n${i.주소2}`)
          sessionStorage.setItem('add1',`${i.주소1}`)
          sessionStorage.setItem('add2',`${i.주소2}`)
          setPosition_Local({latitude: i.좌표1,
            longitude: i.좌표2})
          const popularMenuRes = await axios.get(
            `https://www.fastfood.p-e.kr/popularMenu?latitude=${i.좌표1}&longitude=${i.좌표2}`,
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
          setpopularMenu_Local(popularMenuRes.data)
          console.log(popularMenuRes.data)
          return
      }})
      }
    };
    return (
      <SelectBox onClick={() => setShowOptions((prev) => !prev)}>
        <Label>{currentValue}</Label>
        <SelectOptions className="z-10" show={isShowOptions}>
        {props.UserAdd.length <=0 ? <Option
                value={"12121"}
              >
                주소데이터가 없습니다
              </Option> :
            props.UserAdd.map((option) => (
              <Option
                onClick={handleOnChangeSelectValue(option.주소이름)}
                key={option.주소이름}
                Value={option.주소이름}
              >
                  <div value={option.주소이름} style={{ fontSize:"1px"}}>
                    {option.주소1}  
                  </div>
                    {option.주소2}
              </Option>
            ))}
        </SelectOptions>
      </SelectBox>
    );
  };

export default CustomSelect;