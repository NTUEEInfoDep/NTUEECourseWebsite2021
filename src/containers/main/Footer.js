import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.h1`
  font-size: 25px;
  font-weight: 500;
  line-height: 1.4;
  color: #fff;
  margin: 0;
  margin-bottom: 10px;
`;

const Members = styled.div`
  width: 80%;
  display: flex;
  height: 150px;
  /* overflow:auto; */
  flex-direction: column;
  font-size: 12px;
  letter-spacing: 2px;
  border-top: 2px solid #cdcdcd;
  padding-right: 10px;
  padding-left: 10px;

  color: #fff;
  align-items: center;
  /* justify-content: space-between; */
  @media screen and (max-width: 480px) {
    width: 90%;
    height: 130px;
    display: flex;
    overflow: auto;
    font-size: 11px;
    letter-spacing: 1.5px;
    line-height: 1.5;
    flex-direction: column;
    // justify-content: space-between;
    /* align-items:center; */
    padding-left: 8px;
    padding-right: 8px;
  }
`;

export default function Footer() {
  return (
    <FooterContainer>
      <Text>Developers</Text>
      <Members>
        <p>朱哲廣 吳詩昀 張創渝 梁 正 陳宏恩 陳冠霖 陳亮瑜 </p>
        <p>徐明晧 陳威侑 陳駿瑋 黃宥翔 黃筱穎 游耿睿 楊宗賢 </p>
        <p>楊博宇 楊新慧 鄧旭辰 劉奇聖 蔡仲廷 賴群貿 黃柏睿 </p>
      </Members>
    </FooterContainer>
  );
}
