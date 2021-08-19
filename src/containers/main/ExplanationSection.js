import React from "react";
import { Element } from "react-scroll";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import { CarouselProvider, DotGroup, Slide, Slider } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { Scrollbars } from "rc-scrollbars";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BatteryAlertIcon from "@material-ui/icons/BatteryAlert";
import BatteryCharging20Icon from "@material-ui/icons/BatteryCharging20";
import BatteryCharging60Icon from "@material-ui/icons/BatteryCharging60";

import Card from "./Cards/Card";
import Card2 from "./Cards/Card2";
import Card3 from "./Cards/Card3";
import Card4 from "./Cards/Card4";
import Card5 from "./Cards/Card5";
import Card6 from "./Cards/Card6";

const useStyles = makeStyles(() => ({
  root: {
    width: "80%",
    margin: "auto",
    // maxHeight: "700px",
    display: "flex",
    borderRadius: "3%",
    flexDirection: "column",
    alignItems: "center",
    background: "rgb(0,0,0,.7)",
    // boxShadow: "0 0 150px #A5DEE4 inset",
    flexGrow: 1,
    padding: "20px",
    paddingBottom: "40px",
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
      margin-right: 10px;
    }
  }
  .carousel__dot--selected {
    background-color: #62deda;
    margin-bottom: 3%;
  }
`;
const message = `選擇課程後，對所有教授設置志願序。全部為高年級優先，後續事宜交由加簽處理。 `;
const message2 = `對所有時段設置志願序。無特定年級優先，後續事宜交由開學後的實驗meeting處理。 `;
const message4 = `通常是全部選上，若遇到需要抽籤情況，抽籤方式為 "隨機+人工篩選" 。人工篩選：若學術部判定隨機抽籤的結果會引起爭議時，我們會考慮年級、十選二修課紀錄等等情節，手動調整並將修課機會合理地讓給未來較無機會再修習的人。`;
const message5 = `依據實驗年級保障而有所改變，若優先順序與年級相關，則會先依年級分類，再利用random去排序同年級的優先順序。演算法會先以每人選只能選上一門課為前提先做第一次分發，分發完再利用剩下的空位再分發一次。此外，已選上數電實驗的同學算已抽中一次，因此抽籤時不會參加到十選二的第一次分發。光電實驗及電磁波實驗設有年級保障名額。演算法利用十選二實驗有兩次分發的特性，第一次分發先把該課程選項的人數上限設為保障名額人數，保障年級為優先進行分發，第二次分發再開放剩餘名額，並調成無年級優先進行分發，即可保障該年級人數能盡可能到達保障人數。（但如果選該課的保障年級學生人數很少，可能就不會到達保障名額人數）`;
export default function Explanation() {
  const classes = useStyles();
  const isMobile = useMediaQuery({ query: "(max-width: 480px,)" }); //只是控制頁數和上面的選擇器無關

  return (
    <Element name="explanation">
      <div style={{ height: "100px" }} />
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
          totalSlides={8}
          visibleSlides={1}
          // dragEnabled={false}
        >
          <Slider>
            <StyledSlide index={0}>
              <Scrollbars>
                <Card
                  message={message}
                  title="系必修課程"
                  icon={BatteryAlertIcon}
                />
              </Scrollbars>
            </StyledSlide>

            <StyledSlide index={1}>
              <Scrollbars>
                <Card
                  message={message2}
                  title="電電實驗"
                  icon={BatteryCharging20Icon}
                />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={2}>
              <Scrollbars>
                <Card2 />
              </Scrollbars>
            </StyledSlide>

            <StyledSlide index={3}>
              <Scrollbars>
                <Card3
                  message={message4}
                  title={"數電實驗抽籤"}
                  icon={BatteryCharging60Icon}
                  note={
                    "NOTE：人工篩選會完全透明公開，非黑箱作業。黑箱作業對學術部沒有任何好處，請知悉。"
                  }
                  link={"https://forms.gle/GBHURqUTTd8dQxv28"}
                  step={"STEP1"}
                />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={4}>
              <Scrollbars>
                <Card3
                  message={message5}
                  title={"九實驗志願抽籤"}
                  icon={BatteryCharging60Icon}
                  note={
                    "NOTE：請注意，第一 / 第二次分發表示演算法內部運作過程，與第一 / 第二階段選課不同。"
                  }
                  step={"STEP2"}
                />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={5}>
              <Scrollbars>
                <Card4 />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={6}>
              <Scrollbars>
                <Card5 />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={7}>
              <Scrollbars>
                <Card6 />
              </Scrollbars>
            </StyledSlide>
          </Slider>
          <StyledDotGroup />
        </StyledCarouselProvider>
        {/* </Grid> */}
      </div>
    </Element>
  );
}
