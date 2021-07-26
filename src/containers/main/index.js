import React , {useState,useRef,useEffect} from "react";
import "./main.css";
import moment from 'moment';
import {OpentimeAPI} from "../../api";
/**
 * This is Main Page
 */
export default function Main() {
  //get start time and end time
  const [start,setStart]=useState(null);
  const [end,setEnd]=useState(null);
  useEffect(async () => {
    try {
      const res = await OpentimeAPI.getOpentime();
      setStart(res.data.start);
      setEnd(res.data.end);
    } catch (err) {
      console.error(err);
    }
  }, []); // only run the first time

  //count left time
  const [leftDays,setLeftDays]=useState("00");
  const [leftHours,setLeftHours]=useState("00");
  const [leftMinutes,setLeftMinutes]=useState("00");
  const [leftSeconds,setLeftSeconds]=useState("00");

  let interval=useRef();
  const countDown=()=>{
    // const countDate=new Date("Aug 11 ,2021 23:59:59").getTime();
    interval=setInterval(() => {
      const now = new Date().getTime();
      const gap = end*1000-now;
  
      const second = 1000;
      const minute = second*60;
      const hour = minute*60;
      const day = hour*24;
  
      const textDay = Math.floor(gap/day);
      const textHour = Math.floor((gap % day)/hour);
      const textMinute = Math.floor((gap % hour)/minute);
      const textSecond = Math.floor((gap % minute)/second);

      if (gap < 0) {
        clearInterval(interval.current)
      }else {
        setLeftDays(textDay);
        setLeftHours(textHour);
        setLeftMinutes(textMinute);
        setLeftSeconds(textSecond);
      }
    }, 1000);
    
  }
  useEffect(()=>{
    countDown();
    return () =>{
      clearInterval(interval.current);
    }
  })
  var moment = require('moment');
  return (
    <div className="wrap">
      <div className="item1">
        <div>NTUEE</div>
        <div>Course Pre-selection</div>
      </div>
      <hr />
      <div className="item2">
        <h2>使用說明</h2>
        <img
          src="https://raw.githubusercontent.com/NTUEEInfoDep/NTUEECourseWebsite2020/master/assets/instruction_take3.gif"
          alt=""
        />
      </div>
      <div className="item2">
        <h2>選課說明</h2>
        <ul>
          <div className="wrap">
            <li>必修</li>
            <div>依照想選擇的老師，排列志願序</div>
          </div>
          <div className="wrap">
            <li>數電實驗</li>
            <div>排列志願序</div>
          </div>
          <div className="wrap">
            <li>十選二實驗</li>
            <div>
              依照想選的實驗課程，排列志願序。根據系上規定，學生應修習不同類二門。詳細課程規定請參閱學術部公告
            </div>
          </div>
        </ul>
      </div>
      <div className="time">
        <h2>開放時間</h2>
        <>
          <div>開始：{moment(start*1000).format('YYYY-MM-DD HH:mm:ss')}</div>
          {/* {start} */}
          <div>結束：{moment(end*1000).format('YYYY-MM-DD HH:mm:ss')}</div>
          {/* {end} */}
          <div>剩餘：{leftDays}天{leftHours}小時{leftMinutes}分{leftSeconds}秒</div>
        </>
      </div>

      {/* <div className="item4">
        <h4>Developers</h4>
        <h5>
        </h5>
      </div> */}
    </div>
  );
}
