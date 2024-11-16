import{r as a,P as Ne,Z as j,b as H,c as F,O as $,D as ne,I as oe}from"./app-MMx-yB3G.js";import{C as we,u as ie,a as _e,h as Ae,f as xe,P as Me,j as Oe}from"./iconbase.esm-48fxaLvN.js";import{C as Ie,T as Pe}from"./csstransition.esm-C7-qQLFH.js";import{C as Ce}from"./index.esm-B6m0rV8L.js";import{T as Re,E as Le,I as De}from"./index.esm-vUqAtpS5.js";import{R as je}from"./ripple.esm-CDHzLfkq.js";import{T as ke}from"./TransitionGroup-CAdOuic2.js";function X(){return X=Object.assign?Object.assign.bind():function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e},X.apply(this,arguments)}function V(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,o=new Array(n);t<n;t++)o[t]=e[t];return o}function He(e){if(Array.isArray(e))return V(e)}function Fe(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function le(e,n){if(e){if(typeof e=="string")return V(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);if(t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set")return Array.from(e);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return V(e,n)}}function Ue(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function G(e){return He(e)||Fe(e)||le(e)||Ue()}function Be(e){if(Array.isArray(e))return e}function We(e,n){var t=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(t!=null){var o,r,h,T,s=[],p=!0,E=!1;try{if(h=(t=t.call(e)).next,n===0){if(Object(t)!==t)return;p=!1}else for(;!(p=(o=h.call(t)).done)&&(s.push(o.value),s.length!==n);p=!0);}catch(u){E=!0,r=u}finally{try{if(!p&&t.return!=null&&(T=t.return(),Object(T)!==T))return}finally{if(E)throw r}}return s}}function Je(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function K(e,n){return Be(e)||We(e,n)||le(e,n)||Je()}function I(e){"@babel/helpers - typeof";return I=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},I(e)}function Ye(e,n){if(I(e)!=="object"||e===null)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var o=t.call(e,n||"default");if(I(o)!=="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}function ce(e){var n=Ye(e,"string");return I(n)==="symbol"?n:String(n)}function y(e,n,t){return n=ce(n),n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var Ze=`
@layer primereact {
    .p-toast {
        width: calc(100% - var(--toast-indent, 0px));
        max-width: 25rem;
    }
    
    .p-toast-message-icon {
        flex-shrink: 0;
    }
    
    .p-toast-message-content {
        display: flex;
        align-items: flex-start;
    }
    
    .p-toast-message-text {
        flex: 1 1 auto;
    }
    
    .p-toast-summary {
        overflow-wrap: anywhere;
    }
    
    .p-toast-detail {
        overflow-wrap: anywhere;
    }
    
    .p-toast-top-center {
        transform: translateX(-50%);
    }
    
    .p-toast-bottom-center {
        transform: translateX(-50%);
    }
    
    .p-toast-center {
        min-width: 20vw;
        transform: translate(-50%, -50%);
    }
    
    .p-toast-icon-close {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }
    
    .p-toast-icon-close.p-link {
        cursor: pointer;
    }
    
    /* Animations */
    .p-toast-message-enter {
        opacity: 0;
        transform: translateY(50%);
    }
    
    .p-toast-message-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: transform 0.3s, opacity 0.3s;
    }
    
    .p-toast-message-enter-done {
        transform: none;
    }
    
    .p-toast-message-exit {
        opacity: 1;
        max-height: 1000px;
    }
    
    .p-toast .p-toast-message.p-toast-message-exit-active {
        opacity: 0;
        max-height: 0;
        margin-bottom: 0;
        overflow: hidden;
        transition: max-height 0.45s cubic-bezier(0, 1, 0, 1), opacity 0.3s, margin-bottom 0.3s;
    }
}
`,Qe={root:function(n){var t=n.props,o=n.context;return F("p-toast p-component p-toast-"+t.position,t.className,{"p-input-filled":o&&o.inputStyle==="filled"||H.inputStyle==="filled","p-ripple-disabled":o&&o.ripple===!1||H.ripple===!1})},message:{message:function(n){var t=n.severity;return F("p-toast-message",y({},"p-toast-message-".concat(t),t))},content:"p-toast-message-content",buttonicon:"p-toast-icon-close-icon",closeButton:"p-toast-icon-close p-link",icon:"p-toast-message-icon",text:"p-toast-message-text",summary:"p-toast-summary",detail:"p-toast-detail"},transition:"p-toast-message"},qe={root:function(n){var t=n.props;return{position:"fixed",top:t.position==="top-right"||t.position==="top-left"||t.position==="top-center"?"20px":t.position==="center"?"50%":null,right:(t.position==="top-right"||t.position==="bottom-right")&&"20px",bottom:(t.position==="bottom-left"||t.position==="bottom-right"||t.position==="bottom-center")&&"20px",left:t.position==="top-left"||t.position==="bottom-left"?"20px":t.position==="center"||t.position==="top-center"||t.position==="bottom-center"?"50%":null}}},k=we.extend({defaultProps:{__TYPE:"Toast",id:null,className:null,content:null,style:null,baseZIndex:0,position:"top-right",transitionOptions:null,appendTo:"self",onClick:null,onRemove:null,onShow:null,onHide:null,onMouseEnter:null,onMouseLeave:null,children:void 0},css:{classes:Qe,styles:Ze,inlineStyles:qe}});function ae(e,n){for(var t=0;t<n.length;t++){var o=n[t];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,ce(o.key),o)}}function ze(e,n,t){return n&&ae(e.prototype,n),t&&ae(e,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function Ge(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var d=Object.freeze({STARTS_WITH:"startsWith",CONTAINS:"contains",NOT_CONTAINS:"notContains",ENDS_WITH:"endsWith",EQUALS:"equals",NOT_EQUALS:"notEquals",IN:"in",LESS_THAN:"lt",LESS_THAN_OR_EQUAL_TO:"lte",GREATER_THAN:"gt",GREATER_THAN_OR_EQUAL_TO:"gte",BETWEEN:"between",DATE_IS:"dateIs",DATE_IS_NOT:"dateIsNot",DATE_BEFORE:"dateBefore",DATE_AFTER:"dateAfter",CUSTOM:"custom"}),g=ze(function e(){Ge(this,e)});y(g,"ripple",!1);y(g,"inputStyle","outlined");y(g,"locale","en");y(g,"appendTo",null);y(g,"cssTransition",!0);y(g,"autoZIndex",!0);y(g,"hideOverlaysOnDocumentScrolling",!1);y(g,"nonce",null);y(g,"nullSortOrder",1);y(g,"zIndex",{modal:1100,overlay:1e3,menu:1e3,tooltip:1100,toast:1200});y(g,"pt",void 0);y(g,"filterMatchModeOptions",{text:[d.STARTS_WITH,d.CONTAINS,d.NOT_CONTAINS,d.ENDS_WITH,d.EQUALS,d.NOT_EQUALS],numeric:[d.EQUALS,d.NOT_EQUALS,d.LESS_THAN,d.LESS_THAN_OR_EQUAL_TO,d.GREATER_THAN,d.GREATER_THAN_OR_EQUAL_TO],date:[d.DATE_IS,d.DATE_IS_NOT,d.DATE_BEFORE,d.DATE_AFTER]});y(g,"changeTheme",function(e,n,t,o){var r,h=document.getElementById(t);if(!h)throw Error("Element with id ".concat(t," not found."));var T=h.getAttribute("href").replace(e,n),s=document.createElement("link");s.setAttribute("rel","stylesheet"),s.setAttribute("id",t),s.setAttribute("href",T),s.addEventListener("load",function(){o&&o()}),(r=h.parentNode)===null||r===void 0||r.replaceChild(s,h)});var $e={en:{accept:"Yes",addRule:"Add Rule",am:"AM",apply:"Apply",cancel:"Cancel",choose:"Choose",chooseDate:"Choose Date",chooseMonth:"Choose Month",chooseYear:"Choose Year",clear:"Clear",completed:"Completed",contains:"Contains",custom:"Custom",dateAfter:"Date is after",dateBefore:"Date is before",dateFormat:"mm/dd/yy",dateIs:"Date is",dateIsNot:"Date is not",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],emptyFilterMessage:"No results found",emptyMessage:"No available options",emptySearchMessage:"No results found",emptySelectionMessage:"No selected item",endsWith:"Ends with",equals:"Equals",fileSizeTypes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"],filter:"Filter",firstDayOfWeek:0,gt:"Greater than",gte:"Greater than or equal to",lt:"Less than",lte:"Less than or equal to",matchAll:"Match All",matchAny:"Match Any",medium:"Medium",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],nextDecade:"Next Decade",nextHour:"Next Hour",nextMinute:"Next Minute",nextMonth:"Next Month",nextSecond:"Next Second",nextYear:"Next Year",noFilter:"No Filter",notContains:"Not contains",notEquals:"Not equals",now:"Now",passwordPrompt:"Enter a password",pending:"Pending",pm:"PM",prevDecade:"Previous Decade",prevHour:"Previous Hour",prevMinute:"Previous Minute",prevMonth:"Previous Month",prevSecond:"Previous Second",prevYear:"Previous Year",reject:"No",removeRule:"Remove Rule",searchMessage:"{0} results are available",selectionMessage:"{0} items selected",showMonthAfterYear:!1,startsWith:"Starts with",strong:"Strong",today:"Today",upload:"Upload",weak:"Weak",weekHeader:"Wk",aria:{cancelEdit:"Cancel Edit",close:"Close",collapseRow:"Row Collapsed",editRow:"Edit Row",expandRow:"Row Expanded",falseLabel:"False",filterConstraint:"Filter Constraint",filterOperator:"Filter Operator",firstPageLabel:"First Page",gridView:"Grid View",hideFilterMenu:"Hide Filter Menu",jumpToPageDropdownLabel:"Jump to Page Dropdown",jumpToPageInputLabel:"Jump to Page Input",lastPageLabel:"Last Page",listView:"List View",moveAllToSource:"Move All to Source",moveAllToTarget:"Move All to Target",moveBottom:"Move Bottom",moveDown:"Move Down",moveToSource:"Move to Source",moveToTarget:"Move to Target",moveTop:"Move Top",moveUp:"Move Up",navigation:"Navigation",next:"Next",nextPageLabel:"Next Page",nullLabel:"Not Selected",pageLabel:"Page {page}",otpLabel:"Please enter one time password character {0}",passwordHide:"Hide Password",passwordShow:"Show Password",previous:"Previous",previousPageLabel:"Previous Page",rotateLeft:"Rotate Left",rotateRight:"Rotate Right",rowsPerPageLabel:"Rows per page",saveEdit:"Save Edit",scrollTop:"Scroll Top",selectAll:"All items selected",selectRow:"Row Selected",showFilterMenu:"Show Filter Menu",slide:"Slide",slideNumber:"{slideNumber}",star:"1 star",stars:"{star} stars",trueLabel:"True",unselectAll:"All items unselected",unselectRow:"Row Unselected",zoomImage:"Zoom Image",zoomIn:"Zoom In",zoomOut:"Zoom Out"}}};function Xe(e,n){if(e.includes("__proto__")||e.includes("prototype"))throw new Error("Unsafe key detected");var t=n||g.locale;try{return Ve(t)[e]}catch{throw new Error("The ".concat(e," option is not found in the current locale('").concat(t,"')."))}}function Ve(e){var n=e||g.locale;if(n.includes("__proto__")||n.includes("prototype"))throw new Error("Unsafe locale detected");return $e[n]}function re(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),t.push.apply(t,o)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?re(Object(t),!0).forEach(function(o){y(e,o,t[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):re(Object(t)).forEach(function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))})}return e}var ue=a.memo(a.forwardRef(function(e,n){var t=ie(),o=e.messageInfo,r=e.metaData,h=e.ptCallbacks,T=h.ptm,s=h.ptmo,p=h.cx,E=e.index,u=o.message,S=u.severity,U=u.content,P=u.summary,C=u.detail,B=u.closable,R=u.life,O=u.sticky,W=u.className,J=u.style,Y=u.contentClassName,Z=u.contentStyle,b=u.icon,l=u.closeIcon,i=u.pt,f={index:E},m=c(c({},r),f),w=a.useState(!1),x=K(w,2),L=x[0],D=x[1],me=Oe(function(){Q()},R||3e3,!O&&!L),pe=K(me,1),ee=pe[0],_=function(v,N){return T(v,c({hostName:e.hostName},N))},Q=function(){ee(),e.onClose&&e.onClose(o)},te=function(v){e.onClick&&!(ne.hasClass(v.target,"p-toast-icon-close")||ne.hasClass(v.target,"p-toast-icon-close-icon"))&&e.onClick(o.message)},fe=function(v){e.onMouseEnter&&e.onMouseEnter(v),!v.defaultPrevented&&(O||(ee(),D(!0)))},de=function(v){e.onMouseLeave&&e.onMouseLeave(v),!v.defaultPrevented&&(O||D(!1))},ve=function(){var v=t({className:p("message.buttonicon")},_("buttonicon",m),s(i,"buttonicon",c(c({},f),{},{hostName:e.hostName}))),N=l||a.createElement(Pe,v),A=oe.getJSXIcon(N,c({},v),{props:e}),q=e.ariaCloseLabel||Xe("close"),z=t({type:"button",className:p("message.closeButton"),onClick:Q,"aria-label":q},_("closeButton",m),s(i,"closeButton",c(c({},f),{},{hostName:e.hostName})));return B!==!1?a.createElement("div",null,a.createElement("button",z,A,a.createElement(je,null))):null},ye=function(){if(o){var v=$.getJSXElement(U,{message:o.message,onClick:te,onClose:Q}),N=t({className:p("message.icon")},_("icon",m),s(i,"icon",c(c({},f),{},{hostName:e.hostName}))),A=b;if(!b)switch(S){case"info":A=a.createElement(De,N);break;case"warn":A=a.createElement(Le,N);break;case"error":A=a.createElement(Re,N);break;case"success":A=a.createElement(Ce,N);break}var q=oe.getJSXIcon(A,c({},N),{props:e}),z=t({className:p("message.text")},_("text",m),s(i,"text",c(c({},f),{},{hostName:e.hostName}))),Te=t({className:p("message.summary")},_("summary",m),s(i,"summary",c(c({},f),{},{hostName:e.hostName}))),Se=t({className:p("message.detail")},_("detail",m),s(i,"detail",c(c({},f),{},{hostName:e.hostName})));return v||a.createElement(a.Fragment,null,q,a.createElement("div",z,a.createElement("span",Te,P),C&&a.createElement("div",Se,C)))}return null},ge=ye(),he=ve(),be=t({ref:n,className:F(W,p("message.message",{severity:S})),style:J,role:"alert","aria-live":"assertive","aria-atomic":"true",onClick:te,onMouseEnter:fe,onMouseLeave:de},_("message",m),s(i,"root",c(c({},f),{},{hostName:e.hostName}))),Ee=t({className:F(Y,p("message.content")),style:Z},_("content",m),s(i,"content",c(c({},f),{},{hostName:e.hostName})));return a.createElement("div",be,a.createElement("div",Ee,ge,he))}));ue.displayName="ToastMessage";var se=0,Ke=a.memo(a.forwardRef(function(e,n){var t=ie(),o=a.useContext(Ne),r=k.getProps(e,o),h=a.useState([]),T=K(h,2),s=T[0],p=T[1],E=a.useRef(null),u={props:r,state:{messages:s}},S=k.setMetaData(u);_e(k.css.styles,S.isUnstyled,{name:"toast"});var U=function(l){l&&p(function(i){return P(i,l,!0)})},P=function(l,i,f){var m;if(Array.isArray(i)){var w=i.reduce(function(L,D){return L.push({_pId:se++,message:D}),L},[]);f?m=l?[].concat(G(l),G(w)):w:m=w}else{var x={_pId:se++,message:i};f?m=l?[].concat(G(l),[x]):[x]:m=[x]}return m},C=function(){j.clear(E.current),p([])},B=function(l){p(function(i){return P(i,l,!1)})},R=function(l){var i=l._pId?l._pId:l.message||l;p(function(f){return f.filter(function(m){return m._pId!==l._pId&&!$.deepEquals(m.message,i)})}),r.onRemove&&r.onRemove(i.message||i)},O=function(l){R(l)},W=function(){r.onShow&&r.onShow()},J=function(){s.length===1&&j.clear(E.current),r.onHide&&r.onHide()};Ae(function(){j.set("toast",E.current,o&&o.autoZIndex||H.autoZIndex,r.baseZIndex||o&&o.zIndex.toast||H.zIndex.toast)},[s,r.baseZIndex]),xe(function(){j.clear(E.current)}),a.useImperativeHandle(n,function(){return{props:r,show:U,replace:B,remove:R,clear:C,getElement:function(){return E.current}}});var Y=function(){var l=t({ref:E,id:r.id,className:S.cx("root",{context:o}),style:S.sx("root")},k.getOtherProps(r),S.ptm("root")),i=t({classNames:S.cx("transition"),timeout:{enter:300,exit:300},options:r.transitionOptions,unmountOnExit:!0,onEntered:W,onExited:J},S.ptm("transition"));return a.createElement("div",l,a.createElement(ke,null,s&&s.map(function(f,m){var w=a.createRef();return a.createElement(Ie,X({nodeRef:w,key:f._pId},i),e.content?$.getJSXElement(e.content,{message:f.message}):a.createElement(ue,{hostName:"Toast",ref:w,messageInfo:f,index:m,onClick:r.onClick,onClose:O,onMouseEnter:r.onMouseEnter,onMouseLeave:r.onMouseLeave,closeIcon:r.closeIcon,ptCallbacks:S,metaData:u}))})))},Z=Y();return a.createElement(Me,{element:Z,appendTo:r.appendTo})}));Ke.displayName="Toast";export{Ke as T};
