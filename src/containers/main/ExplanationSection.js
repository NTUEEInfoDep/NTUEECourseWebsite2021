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
import BatteryCharging30Icon from "@material-ui/icons/BatteryCharging30";
import BatteryCharging50Icon from "@material-ui/icons/BatteryCharging50";
import BatteryCharging60Icon from "@material-ui/icons/BatteryCharging60";
import BatteryCharging80Icon from "@material-ui/icons/BatteryCharging80";
import BatteryChargingFullIcon from "@material-ui/icons/BatteryChargingFull";
import AssistantPhotoIcon from "@material-ui/icons/AssistantPhoto";

import Card from "./Cards/Card";
import Card2 from "./Cards/Card2";
import Card3 from "./Cards/Card3";
import Card4 from "./Cards/Card4";
import Card5 from "./Cards/Card5";
import Card6 from "./Cards/Card6";
import CardMarkdown from "./Cards/CardMarkdown";

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
    max-width: 700px;
    /* margin: "auto"; */
    display: flex;
    overflow-y: auto;
    width: 100%; //內層卡片的寬度 點框
    justify-content: center;
  }
`;
const StyledCarouselProvider = styled(CarouselProvider)`
  width: 70%;
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

const message2 = `- 請對所有時段設置志願序(每個時段的上限人數為 50人)，無特定年級優先。
- 在預選後，如您欲更換時段，請您找好能與您更換時段的同學。請直接來信與實驗課林冠中助教聯繫 ([calculus365@yahoo.com.tw](mailto:calculus365@yahoo.com.tw)) 並副本 (CC) 給另一位同學，這樣助教才會處理，謝謝。
- 若未參加預選的同學，屆時將由助教們統一安排時段。
- 參加系上實驗課預選，並不代表電子學實驗(二)、電路學實驗這門課會出現在您的課表上，請務必進入學校選課系統點選電子學實驗(二)、電路學實驗這門課，這樣才算數，期末才會有成績。
- 電子學實驗(二)與電路學實驗之第一次上課時間與地點將會在開學前另行公告。`;

const message3 = `選擇有興趣的實驗並設置志願序。

- 請先詳細閱讀**十選二實驗規定**。部分課程有相關先修規定。
- **[注意]** 今年電磁波實驗會針對兩個時段 (周二早上、周三早上) 各設置一個志願，請同學考量自身時間狀況進行志願的排序，系統會自行判斷不會同時選上兩個時段之電磁波實驗。
- 可設置0~10個志願序 (不含數電實驗、有兩個電磁波實驗)，所有志願序都有可能選上。
數電實驗另開Google表單，3人組隊報名。表單開放時間與預選系統相同。
- 所有學生至多選上2門實驗，包含數電實驗。
- 抽籤作業流程：(A)數電實驗抽籤 → (B)志願序抽籤

十選二實驗規定：[https://reurl.cc/VRx3Gy](https://reurl.cc/VRx3Gy)

課程表：[https://reurl.cc/pZN52e](https://reurl.cc/pZN52e)`

const message4 = `通常是全部選上，若遇到需要抽籤情況，抽籤方式為**隨機**。

數電實驗表單：[https://forms.gle/nHBXNxA4RP1Ajvts6](https://forms.gle/nHBXNxA4RP1Ajvts6)`;

const message5 = `- 演算法會進行兩次分發，會先以每人選只能選上一門課為前提先做第一次分發，分發完再利用剩下的空位再分發一次。
- 第一次分發會先把上限設為保障名額數，以該年級為優先進行分發；第二次分發再開放剩餘名額，並調整為無特定年級優先，即可保障該年級人數能盡可能到達保障人數。（但如果選該課的保障年級學生人數很少，可能就不會到達保障名額人數）
- 選中數電實驗的人算選中一個選項，因此抽籤時不會參加到十選二的第一次分發。
- 本學期**自動控制、半導體**設有**特定年級優先**；**光電**設置**年級保障名額**。
- 本學期電力電子預選只會開放18個名額；剩下的名額由加簽或教授決定。`

const message6 = `1. 每個人的起始優先度是 0
2. 優先度會受到該選項的志願序影響，如果你將課程中的某個選項設為第X志願，你的優先度將會減X(簡單來說，志願放越前面越容易上)
3. 如果遇到有高年級優先的課，根據你是 X 年級優先度加 X*20 (4 年級以上算 4 年級)
4. 如果是大 X 優先而且你是大 X，則你的優先度加 20。
5. 在產生課程選項志願的時候，會從優先度高的人開始抽。若有一群學生優先度相同則random排序進行分。

演算法詳細說明: [Github](https://github.com/NTUEEInfoDep/NTUEECourseWebsite2021/blob/2022-fall/distribute-server/README.md)`

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
          naturalSlideHeight={isMobile ? 250 : 200}
          totalSlides={5}
          visibleSlides={1}
          // dragEnabled={false}
        >
          <Slider>
            <StyledSlide index={0}>
              <Scrollbars>
                <CardMarkdown
	  	  description={message2}
                  title="電電實驗"
                  icon={BatteryCharging20Icon}
                />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={1}>
              <Scrollbars>
                <CardMarkdown
	  	  description={message3}
                  title="十選二實驗"
                  icon={BatteryCharging50Icon}
                />
              </Scrollbars>
            </StyledSlide>

            <StyledSlide index={2}>
              <Scrollbars>
                <CardMarkdown
                  description={message4}
                  title={"數電實驗抽籤"}
                  icon={BatteryCharging80Icon}
                />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={3}>
              <Scrollbars>
                <CardMarkdown
                  description={message5}
                  title={"九實驗志願抽籤"}
                  icon={BatteryChargingFullIcon}
                />
              </Scrollbars>
            </StyledSlide>
            <StyledSlide index={4}>
              <Scrollbars>
                <CardMarkdown
                  description={message6}
                  title={"補充"}
                  icon={AssistantPhotoIcon}
                />
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
