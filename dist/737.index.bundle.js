(self.webpackChunkwhatsappv2=self.webpackChunkwhatsappv2||[]).push([[737],{7309:(e,n,t)=>{"use strict";t.d(n,{Z:()=>s});var r=t(3645),a=t.n(r)()((function(e){return e[1]}));a.push([e.id,'.Home {\r\n  width: 935px;\r\n  display: grid;\r\n  grid-template-columns: 65% 35%;\r\n  grid-template-areas:\r\n    "posts sugg"\r\n    "posts sugg"\r\n    "posts .";\r\n  margin: 0 auto;\r\n  grid-gap: 10px;\r\n}\r\n.Home .createpost-btn {\r\n  width: 99%;\r\n  height: 30px;\r\n  grid-area: createpost-btn;\r\n  border-style: none;\r\n  border-radius: 4px;\r\n  margin-top: 6px;\r\n  cursor: pointer;\r\n  background-color: #fff;\r\n  border: 1px solid #e5e5e5;\r\n  font-weight: bold;\r\n}\r\n.Home .posts {\r\n  width: 100%;\r\n  height: 90vh;\r\n  grid-area: posts;\r\n  overflow-y: scroll;\r\n}\r\n\r\n@media (max-width: 934px) {\r\n  .Home {\r\n    grid-template-columns: 100vw;\r\n  }\r\n}\r\n',""]);const s=a},1661:(e,n,t)=>{"use strict";t.d(n,{Z:()=>s});var r=t(3645),a=t.n(r)()((function(e){return e[1]}));a.push([e.id,".post {\r\n  width: 99%;\r\n  background-color: #fff;\r\n  border: 1px solid #e5e5e5;\r\n  margin-bottom: 30px;\r\n}\r\n.post .post-header {\r\n  height: 50px;\r\n  display: flex;\r\n  align-items: center;\r\n}\r\n.post .post-header img {\r\n  width: 30px;\r\n  height: 30px;\r\n  border-radius: 50%;\r\n  margin: 0 5px;\r\n}\r\n.post .post-header p {\r\n  font-weight: bold;\r\n}\r\n.post .post-footer {\r\n  padding: 5px 8px;\r\n}\r\n.buttons {\r\n  width: 40px;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  align-items: center;\r\n}\r\n.post .post-footer p {\r\n  margin: 5px 0;\r\n}\r\n\r\n.add-comment {\r\n  width: 100%;\r\n}\r\n.add-comment form {\r\n  width: 100%;\r\n  display: flex;\r\n  align-items: center;\r\n  border-top: 1px solid #e5e5e5;\r\n}\r\n.add-comment form textarea {\r\n  width: 90%;\r\n  font-size: 16px;\r\n  border-style: none;\r\n  background-color: #fff;\r\n  outline: none;\r\n  resize: none;\r\n  padding-top: 8px;\r\n}\r\n.add-comment form textarea::placeholder {\r\n  font-family: Arial, Helvetica, sans-serif;\r\n  padding-top: 8px;\r\n}\r\n.add-comment form button {\r\n  background-color: #fff;\r\n  border-style: none;\r\n  cursor: pointer;\r\n  color: #0095f6;\r\n}\r\n.post .post-img {\r\n  width: 100%;\r\n  border-top: 1px solid #e5e5e5;\r\n  border-bottom: 1px solid #e5e5e5;\r\n}\r\n\r\n@media (max-width: 934px) {\r\n    .post{\r\n        width: 98vw;\r\n    }\r\n}",""]);const s=a},2610:(e,n,t)=>{"use strict";t.d(n,{Z:()=>s});var r=t(3645),a=t.n(r)()((function(e){return e[1]}));a.push([e.id,".Home .suggestions {\r\n    grid-area: sugg;\r\n    padding-top: 50px;\r\n  }\r\n  .suggestions .sugg-header {\r\n    display: flex;\r\n    justify-content: space-between;\r\n  }\r\n  .suggestions .sugg-header div {\r\n    display: flex;\r\n    align-items: center;\r\n  }\r\n  .suggestions .sugg-header div img {\r\n    width: 60px;\r\n    border-radius: 50%;\r\n  }\r\n  \r\n  .suggestions .sugg-header span {\r\n    margin-left: 10px;\r\n  }\r\n  .suggestions .sugg-header span .username {\r\n    margin: 0px;\r\n    font-weight: bold;\r\n  }\r\n  .suggestions .sugg-header span .name {\r\n    margin: 0px;\r\n    color: #C2C2C2;\r\n  }\r\n  .suggestions .sugg-header button {\r\n    background-color: transparent;\r\n    border-style: none;\r\n    color: #0095f6;\r\n    font-weight: bold;\r\n    cursor: pointer;\r\n  }\r\n  .suggestions-container .title {\r\n    font-weight: bold;\r\n    color: #C2C2C2;\r\n  }\r\n  .sugg-user {\r\n    width: 100%;\r\n    display: flex;\r\n    justify-content: space-between;\r\n    align-items: center;\r\n    margin-bottom: 10px;\r\n  }\r\n  .sugg-user img {\r\n    width: 30px;\r\n    height: 30px;\r\n    border-radius: 50%;\r\n  }\r\n  .sugg-user button {\r\n    background-color: transparent;\r\n    color: #0095f6;\r\n    border-style: none;\r\n    font-weight: bold;\r\n    cursor: pointer;\r\n  }\r\n  .sugg-user div {\r\n    display: flex;\r\n    align-items: center;\r\n  }\r\n  .sugg-user p {\r\n    margin: 0px;\r\n    padding-top: 3px;\r\n    margin-left: 3px;\r\n    font-size: 14px;\r\n  }\r\n  ",""]);const s=a},1737:(e,n,t)=>{"use strict";t.r(n),t.d(n,{default:()=>v});var r=t(7294),a=t(4593),s=t(4494),o=t(3727),l=t(5977),i=t(2051),c=t(3379),m=t.n(c),d=t(1661),u={insert:"head",singleton:!1};m()(d.Z,u);d.Z.locals;var p=t(3571);const g=(0,s.$j)((e=>({postModalInfo:e.postModalInfo,userData:e.userData})),(e=>({})))((({postInfo:e,userData:n,handlePostModal:t,postModalInfo:a})=>{const[s,l]=(0,r.useState)(!1),[i,c]=(0,r.useState)(),[m,d]=(0,r.useState)(""),u=()=>{n&&async function(){const e=await(0,p.q0)(i,s,n.username,l);c(e)}()};return(0,r.useEffect)((()=>{n&&(0,p.UE)(e).then((e=>{const t=e.likes.includes(n.username);l(!!t),c(e)}))}),[n,a]),r.createElement(r.Fragment,null,i?r.createElement("div",{className:"post",key:i.id},r.createElement("div",{className:"post-header"},r.createElement("img",{src:i.userPhoto,alt:""}),r.createElement(o.rU,{className:"link",to:`/profile/${i.username}`},r.createElement("p",null,i.username))),r.createElement("img",{className:"post-img",src:i.photo,alt:""}),r.createElement("div",{className:"post-footer"},r.createElement("div",{className:"buttons"},s?r.createElement("i",{onClick:u,className:"fas fa-heart"}):r.createElement("i",{onClick:u,className:"far fa-heart"}),r.createElement("i",{className:"far fa-comment"})),r.createElement("p",null,r.createElement("strong",null,i.likes.length," likes")),r.createElement("p",null,r.createElement("strong",null,i.username)," ",i.caption.length<45?i.caption:`${i.caption.substr(0,42)}...`),i.comments.length?r.createElement("div",null,i.comments.length>=2&&r.createElement("p",{style:{cursor:"pointer"},onClick:()=>t(i)},"View all ",i.comments.length," comments"),r.createElement("p",null,r.createElement("strong",null,i.comments[0].username)," "," ",i.comments[0].text.length<35?i.comments[0].text:`${i.comments[0].text.substr(0,32)}...`)):r.createElement("div",null),r.createElement("div",{className:"add-comment"},r.createElement("form",{onSubmit:e=>(async(e,n,t,r)=>{r&&(e.preventDefault(),await(0,p.Ir)(n,t,r).then((e=>{let n=[...i.comments,e];const t={...i,comments:n};c(t)})),d(""))})(e,i.id,m,n)},r.createElement("textarea",{name:"comment",placeholder:"Add a comment...",value:m,onChange:e=>d(e.target.value)}),r.createElement("button",{type:"submit"},"Post"))))):r.createElement(r.Fragment,null," "))}));var h=t(2610),f={insert:"head",singleton:!1};m()(h.Z,f);h.Z.locals;const E=(0,s.$j)((e=>({userData:e.userData})),(e=>({})))((({userData:e})=>{const[n,t]=(0,r.useState)([]);return(0,r.useEffect)((()=>{(async e=>{if(e.following.length){const n=await i.db.collection("userData").where("username","not-in",e.following).limit(5).get(),r=[];n.docs.forEach((n=>{n.data().uid!==e.uid&&r.push(n.data())})),t(r)}else{const n=await i.db.collection("userData").limit(5).get(),r=[];n.docs.forEach((n=>{n.data().uid!==e.uid&&r.push(n.data())})),t(r)}})(e)}),[]),r.createElement("div",{className:"suggestions-container"},r.createElement("p",{className:"title"},"Suggestion for you"),r.createElement("div",null,n?r.createElement("div",null,n.map(((a,s)=>r.createElement("div",{className:"sugg-user",key:a.uid},r.createElement("div",null,r.createElement("img",{src:a.photoURL,alt:""}),r.createElement(o.rU,{className:"link",to:`/profile/${a.username}`},r.createElement("p",null,a.username))),r.createElement("button",{onClick:()=>(async(r,a)=>{const s=n;s.splice(a,1),t([...s]),(0,p.ZN)(r,e)})(a.username,s)},"Follow"))))):r.createElement("div",null)))}));var x=t(8033),b=t(7309),w={insert:"head",singleton:!1};m()(b.Z,w);b.Z.locals;const v=(0,s.$j)((e=>({userData:e.userData})),(e=>({setPostModalInfo(n){e({type:"SET_POSTMODAL_INFO",postModalInfo:n})}})))((({userData:e,setPostModalInfo:n})=>{const t=(0,l.k6)(),[s,c]=(0,r.useState)([]),[m,d]=(0,r.useState)(!0),u=e=>{n(e)};return(0,r.useEffect)((()=>{e?(0,p.Jq)(e).then((e=>{c(e),d(!1)})):t.push("/")}),[e]),m?r.createElement(x.Z,null):r.createElement(r.Fragment,null,r.createElement(a.q,null,r.createElement("title",null,"Instagram")),e?r.createElement("div",{className:"Home"},r.createElement("div",{className:"posts"},s.length&&s.map((e=>r.createElement(g,{handlePostModal:u,postInfo:e,key:e.id})))),r.createElement("div",{className:"suggestions"},r.createElement("div",{className:"sugg-header"},r.createElement("div",null,r.createElement("img",{src:e.photoURL,alt:""}),r.createElement("span",null,r.createElement(o.rU,{className:"link",to:`/profile/${e.username}`},r.createElement("p",{className:"username"},e.username)),r.createElement("p",{className:"name"},e.name))),r.createElement("button",{onClick:async()=>await i.I.signOut()},"Switch")),r.createElement(E,null))):r.createElement(x.Z,null))}))}}]);