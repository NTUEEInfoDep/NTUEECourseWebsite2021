import React from "react";
import { Element } from "react-scroll";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { CarouselProvider, DotGroup, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BatteryAlertIcon from "@material-ui/icons/BatteryAlert";
import BatteryCharging20Icon from "@material-ui/icons/BatteryCharging20";
import BatteryCharging80Icon from "@material-ui/icons/BatteryCharging80";
import BatteryChargingFullIcon from "@material-ui/icons/BatteryChargingFull";

import Card from "./Cards/Card";
import Card2 from "./Cards/Card2";
import Card3 from "./Cards/Card3";

const useStyles = makeStyles(() => ({
  root: {
    width: "80%",
    margin: "auto",
    maxHeight: "700px",
    display: "flex",
    borderRadius: "3%",
    flexDirection: "column",
    alignItems: "center",
    background: "rgb(0,0,0,.7)",
    // boxShadow: "0 0 150px #A5DEE4 inset",
    flexGrow: 1,
    padding: "20px",
  },
  title: {
    padding: "10px",
    textAlign: "center",
  },
}));
const StyledSlide = styled(Slide)`
  .carousel__inner-slide {
    max-width: 400px;
    /* margin: "auto"; */
    display: flex;
    overflow-y: auto;
    width: 100%; //內層卡片的寬度 點框
    justify-content: center;
  }
`;
const StyledCarouselProvider = styled(CarouselProvider)`
  width: 35%;
  border: solid;
  /* margin-top: 3%; */
  padding: 2%;
  @media screen and (max-width: 480px) {
    width: 100%;
    padding: 3%;
    margin: 0;
  }
`;
const StyledDotGroup = styled(DotGroup)`
  margin: auto;
  display: flex;
  justify-content: center;
  button {
    width: 11px;
    height: 11px;
    margin-top: 30px;
    /* margin-bottom: 10px; */
    padding: 5px;
    border-radius: 50%;
    background-color: #e4e4e4;
    border: none;
    outline: none;
    &:not(:last-of-type) {
      margin-right: 3px;
    }
  }
  .carousel__dot--selected {
    background-color: #62deda;
    margin-bottom: 3%;
  }
`;
const message = `先取所有人之第一志願，若某選項太熱門而超過限額，則從＂高年級先錄取＂，同年級超額的部分抽籤至限額。下個階段，未抽中的人取下個順位並重複前述機制，直到所有人都抽出。後續事宜交由加簽處理。 `;
const message2 = `先取所有人之第一志願，若某選項太熱門而超過限額，則＂抽籤＂至限額，同年級超額的部分抽籤至限額。下個階段，未抽中的人取下個順位並重複前述機制，直到所有人都抽出。後續事宜交由加簽處理。 `;
const message4 = `通常是全部選上，若遇到需要抽籤情況，抽籤方式爲＂隨機＋人工篩選＂。人工篩選：若學術部判定隨機抽籤的結果會引起爭議時，我們會考慮年級、十選二修課紀錄等等情節，手動調整並將修課機會合理地讓給未來較無機會再修習的人。`;
const message5 = `先抽出保障名額，之後尚未被抽中兩次的人取出第一志願,若超額 則抽籤至限額,之後取下個志願序重複執行,直到執行完所有志願序。`;
export default function Explanation() {
  const classes = useStyles();
  const isMobile = useMediaQuery({ query: "(max-width: 480px,)" }); //只是控制頁數和上面的選擇器無關

  return (
    <Element name="explanation">
      <div style={{ height: "55px" }} />
      {/* 讓網頁下滑 */}
      <div className={classes.root}>
        <Typography
          variant="h5"
          className={classes.title}
          style={{ marginTop: "3%" }}
        >
          選課及演算法說明
        </Typography>
        <Typography gutterBottom variant="subtitle2" className={classes.title}>
          Explanation
        </Typography>

        {/* <Grid
          container
          style={{ marginBottom: "13%", margin: "auto", border: "solid red" }}
        > */}
        {/* //first paper */}
        <StyledCarouselProvider
          naturalSlideWidth={isMobile ? 190 : 350}
          naturalSlideHeight={isMobile ? 250 : 400}
          totalSlides={5}
          visibleSlides={1}
          // dragEnabled={false}
        >
          <Slider>
            <StyledSlide index={0}>
              <Card
                message={message}
                title="系必修課程"
                icon={BatteryAlertIcon}
              />
            </StyledSlide>
            <StyledSlide index={1}>
              <Card
                message={message2}
                title="電電實驗"
                icon={BatteryCharging20Icon}
              />
            </StyledSlide>
            <StyledSlide index={2}>
              <Card2 />
            </StyledSlide>

            <StyledSlide index={3}>
              <Card3
                message={message4}
                title={"數電實驗抽籤"}
                icon={BatteryCharging80Icon}
                note={
                  "NOTE：人工篩選會完全透明公開，非黑箱作業。黑箱作業對學術部沒有任何好處，請知悉。"
                }
                step={"STEP1"}
              />
            </StyledSlide>
            <StyledSlide index={4}>
              <Card3
                message={message5}
                title={"九實驗志願抽籤"}
                icon={BatteryChargingFullIcon}
                note={"NOTE：已選上數電實驗的同學算已抽中一次。"}
                step={"STEP2"}
              />
            </StyledSlide>
          </Slider>
          <StyledDotGroup />
        </StyledCarouselProvider>
        {/* </Grid> */}
      </div>
    </Element>
  );
}
