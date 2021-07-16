# Distribute server

## Quick start

```
export FLASK_ENV=development
python server.py
```


## 演算法

系必修：全部都有高年級優先。

電子電路實驗：全部都無高年級優先。

十選二實驗：視個別實驗而定，每個人最多可以中兩個。另外，演算法會先以每人選只能選上1門課為前提先做第一次分發，分發完再利用剩下的空位再分發一次。

演算法核心：可以參考指考分發演算法與 Stable Marriage Problem ，即學生與課程選項都有各自的志願。

課程選項的志願：課程選項的志願是依據課程類型而有所改變，若優先與年級相關，則會先依年級分類，再利用random去排序同年級的優先順序。(可參考class Option 中的make_priority_list函數)

priority計算：

1. 每個人的起始priority是 0
2. 如果遇到有高年級優先的課，根據你是 X 年級priority減 X (4 年級以上算 4 年級)
3. 如果是大 X 優先而且你是大 X，則你的priority減 1。
4. 在產生課程選項志願的時候，會從priority低的人開始抽。

數電實驗：選中數電實驗的人算選中一個選項，因此抽籤時不會參加到十選二的第一次分發。

### 課程選項志願產生(詳細實作請看 class Option 中的make_priority_list函數)

假設有這些學生要抽籤(key: student_id, value: priority)，名額有 3 個

```
{
  "BAAAAAAAA": 0,
  "BBBBBBBBB": 0,
  "BCCCCCCCC": -4,
  "BDDDDDDDD" -2,
  "BEEEEEEEE": -4,
}
```

首先把相同priority的學生 group 在一起，變成：

```
{
  0: ["BAAAAAAAA", "BBBBBBBBB"],
  -4: ["BCCCCCCCC", "BEEEEEEEE"],
  -2: ["BDDDDDDDD"],
}
```

接著從中拿出priority最低的 group，即是 -4 那個 group，因此"BCCCCCCCC" 和 "BEEEEEEEE" 都會被取出來，並利用random 打亂順序後加到priority_list(即此選項的志願)中去。

接著依序取出priority次低的 group，重複上述動作，直到所有學生都被加到priority_list中，後面的就會依照個選項的priority_list 去分發。

### 分發部份(只寫一個課程)

```
產生該課程所有選項的priority_list

for (學生 in 選擇該課程的學生們):
  while (還沒分發):
    for (課程選項 in 該學生的志願序)
      if (該選項尚有名額)
        依照該課程priority_list插入選上名單
        此次分發已完成，可離開while loop
      if (該選項已額滿)
        依照該課程priority_list插入選上名單，並把最後一位踢掉(可能剛進去就被踢)
        if (踢掉的學生 != 剛插入的學生)
          break (但還沒完成分發，因此不能離開while loop)
    此次分發已完成，可離開while loop
```




