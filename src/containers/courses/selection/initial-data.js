// const courses = [
//   {
//     id: "Ten-Select-Two",
//     name: "十選二實驗",
//     type: "0",
//     description:
//       '<p>(1) 請詳閱 <a href= "https://bit.ly/3o0MrAb" target= "_blank" style= "color: #45bbff;">實驗規定</a>，攸關各位的權利。</p><p>(2)特別轉載半導體實驗規定： ★★大學畢業後欲投入半導體領域者，可保留名額  ★★實驗期間需全程戴口罩、穿實驗衣含無塵衣,且著裝後需能自由移動。  ★★需遵守政府、臺大及實驗室之公共安全規定。  ★★環安衛法律條文規定沒有英文部份,若有外藉生不懂中文,將請助教以英文口譯告知。  ★★Electrical Engineering Lab (semiconductor) safety rules: ★In the labs,  students are required to wear  masks and lab  coats /cleanroom suits, and can be able to move freely with the  coats/suits.  ★★All persons in labs must follow the related safety regulations required by the labs, NTU, and the government.  ★★Enrolled international students  will be informed by teaching assistants orally in case that the English regulations/statutes of occupational health and safety, and environmental protection are not officially available.</p><p>(3) 數電請進入 <a href="https://forms.gle/kJowuD9SynDYQpjB6" target="_blank" style="color: #45bbff;">此表單</a> 報名。</p>',
//     options: [
//       "電力電子",
//       "自動控制",
//       "嵌入式系統",
//       "電磁波",
//       "半導體",
//       "通信專題",
//       "網路與多媒體",
//       "生醫工程",
//       "光電",
//     ],
//   },
//   {
//     id: "Electronic-Circuit",
//     name: "電路學",
//     type: "1",
//     description: "",
//     options: ["老師A", "老師B", "老師C", "老師D", "老師E"],
//   },
//   {
//     id: "Electronics-two",
//     name: "電子學（二）",
//     type: "2",
//     description: "",
//     options: ["老師F", "老師G", "老師H", "老師I"],
//   },
//   {
//     id: "Electormagnetics-two",
//     name: "電磁學二",
//     type: "2",
//     description: "",
//     options: ["老師J", "老師K", "老師L", "老師M", "老師N"],
//   },
//   {
//     id: "Signals-Systems",
//     name: "信號與系統",
//     type: "2",
//     description: "",
//     options: ["老師O", "老師P", "老師Q", "老師R"],
//   },
//   {
//     id: "Probability-Statistics",
//     name: "機率與統計",
//     type: "2",
//     description: "",
//     options: ["老師S", "老師T", "老師U"],
//   },
//   {
//     id: "Algorithm",
//     name: "演算法",
//     type: "3",
//     description: "",
//     options: ["老師V"],
//   },
// ];
// {
//   courseID: 0,
//   name: "演算法",
//   grade: 3,
//   options: ["老師A", "老師B"],
// },
// const initialData = {
//   courses: [
//     {
//       id: "0",
//       name: "演算法",
//       grade: 3,
//       option: ["老師A", "老師B"],
//     },
//     {
//       id: "1",
//       name: "電子學",
//       grade: 2,
//       option: ["老師C", "老師D"],
//     },
//     {
//       id: "2",
//       name: "網路多媒體實驗",
//       grade: 0,
//       option: ["老師E"],
//     },
//     {
//       id: "3",
//       name: "電磁學",
//       grade: 1,
//       option: ["老師F", "老師G", "老師H", "老師I", "老師J"],
//     },
//   ],
//   columns: [
//     {
//       id: "column1",
//       title: "chosen",
//       optionIds: ["老師A", "老師B"],
//     },
//     {
//       id: "column2",
//       title: "unchosen",
//       optionIds: [],
//     },
//   ],
//   columnOrder: ["column1", "column2"],
// };
const initialData = [
  {
    id: "column1",
    title: "chosen",
    optionIds: ["老師A", "老師B"],
  },
  {
    id: "column2",
    title: "unchosen",
    optionIds: [],
  },
];

// const initialData = {
//   courses: {
//     course1: {
//       id: "course1",
//       content: "electrical engineering",
//     },
//     course2: {
//       id: "course2",
//       content: "electrical engineering",
//     },
//     course3: {
//       id: "course3",
//       content: "electrical engineering",
//     },
//   },
//   columns: {
//     column1: {
//       id: "column1",
//       title: "chosen",
//       courseIds: ["course1", "course2", "course3"],
//     },
//     column2: {
//       id: "column2",
//       title: "unchosen",
//       courseIds: [],
//     },
//   },
//   columnOrder: ["column1", "column2"],
// };
export default initialData;
