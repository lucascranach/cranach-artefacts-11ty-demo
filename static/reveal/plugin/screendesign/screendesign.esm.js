var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},r=function(t){return t&&t.Math==Math&&t},n=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof t&&t)||function(){return this}()||Function("return this")(),e={},o=function(t){try{return!!t()}catch(t){return!0}},i=!o((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]})),u={},c={}.propertyIsEnumerable,a=Object.getOwnPropertyDescriptor,f=a&&!c.call({1:2},1);u.f=f?function(t){var r=a(this,t);return!!r&&r.enumerable}:c;var l=function(t,r){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:r}},s={}.toString,p=function(t){return s.call(t).slice(8,-1)},y=p,h="".split,g=o((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==y(t)?h.call(t,""):Object(t)}:Object,d=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t},v=g,m=d,S=function(t){return v(m(t))},b=function(t){return"object"==typeof t?null!==t:"function"==typeof t},w=b,L=function(t,r){if(!w(t))return t;var n,e;if(r&&"function"==typeof(n=t.toString)&&!w(e=n.call(t)))return e;if("function"==typeof(n=t.valueOf)&&!w(e=n.call(t)))return e;if(!r&&"function"==typeof(n=t.toString)&&!w(e=n.call(t)))return e;throw TypeError("Can't convert object to primitive value")},O=d,T=function(t){return Object(O(t))},E=T,j={}.hasOwnProperty,M=function(t,r){return j.call(E(t),r)},P=b,x=n.document,A=P(x)&&P(x.createElement),k=function(t){return A?x.createElement(t):{}},C=!i&&!o((function(){return 7!=Object.defineProperty(k("div"),"a",{get:function(){return 7}}).a})),_=i,N=u,F=l,D=S,G=L,I=M,V=C,z=Object.getOwnPropertyDescriptor;e.f=_?z:function(t,r){if(t=D(t),r=G(r,!0),V)try{return z(t,r)}catch(t){}if(I(t,r))return F(!N.f.call(t,r),t[r])};var R={},H=b,q=function(t){if(!H(t))throw TypeError(String(t)+" is not an object");return t},B=i,W=C,K=q,Y=L,J=Object.defineProperty;R.f=B?J:function(t,r,n){if(K(t),r=Y(r,!0),K(n),W)try{return J(t,r,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return"value"in n&&(t[r]=n.value),t};var Q=R,U=l,X=i?function(t,r,n){return Q.f(t,r,U(1,n))}:function(t,r,n){return t[r]=n,t},Z={exports:{}},$=n,tt=X,rt=function(t,r){try{tt($,t,r)}catch(n){$[t]=r}return r},nt=rt,et=n["__core-js_shared__"]||nt("__core-js_shared__",{}),ot=et,it=Function.toString;"function"!=typeof ot.inspectSource&&(ot.inspectSource=function(t){return it.call(t)});var ut=ot.inspectSource,ct=ut,at=n.WeakMap,ft="function"==typeof at&&/native code/.test(ct(at)),lt={exports:{}},st=et;(lt.exports=function(t,r){return st[t]||(st[t]=void 0!==r?r:{})})("versions",[]).push({version:"3.12.1",mode:"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"});var pt,yt,ht,gt=0,dt=Math.random(),vt=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++gt+dt).toString(36)},mt=lt.exports,St=vt,bt=mt("keys"),wt={},Lt=ft,Ot=b,Tt=X,Et=M,jt=et,Mt=function(t){return bt[t]||(bt[t]=St(t))},Pt=wt,xt=n.WeakMap;if(Lt||jt.state){var At=jt.state||(jt.state=new xt),kt=At.get,Ct=At.has,_t=At.set;pt=function(t,r){if(Ct.call(At,t))throw new TypeError("Object already initialized");return r.facade=t,_t.call(At,t,r),r},yt=function(t){return kt.call(At,t)||{}},ht=function(t){return Ct.call(At,t)}}else{var Nt=Mt("state");Pt[Nt]=!0,pt=function(t,r){if(Et(t,Nt))throw new TypeError("Object already initialized");return r.facade=t,Tt(t,Nt,r),r},yt=function(t){return Et(t,Nt)?t[Nt]:{}},ht=function(t){return Et(t,Nt)}}var Ft={set:pt,get:yt,has:ht,enforce:function(t){return ht(t)?yt(t):pt(t,{})},getterFor:function(t){return function(r){var n;if(!Ot(r)||(n=yt(r)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return n}}},Dt=n,Gt=X,It=M,Vt=rt,zt=ut,Rt=Ft.get,Ht=Ft.enforce,qt=String(String).split("String");(Z.exports=function(t,r,n,e){var o,i=!!e&&!!e.unsafe,u=!!e&&!!e.enumerable,c=!!e&&!!e.noTargetGet;"function"==typeof n&&("string"!=typeof r||It(n,"name")||Gt(n,"name",r),(o=Ht(n)).source||(o.source=qt.join("string"==typeof r?r:""))),t!==Dt?(i?!c&&t[r]&&(u=!0):delete t[r],u?t[r]=n:Gt(t,r,n)):u?t[r]=n:Vt(r,n)})(Function.prototype,"toString",(function(){return"function"==typeof this&&Rt(this).source||zt(this)}));var Bt=n,Wt=n,Kt=function(t){return"function"==typeof t?t:void 0},Yt=function(t,r){return arguments.length<2?Kt(Bt[t])||Kt(Wt[t]):Bt[t]&&Bt[t][r]||Wt[t]&&Wt[t][r]},Jt={},Qt=Math.ceil,Ut=Math.floor,Xt=function(t){return isNaN(t=+t)?0:(t>0?Ut:Qt)(t)},Zt=Xt,$t=Math.min,tr=function(t){return t>0?$t(Zt(t),9007199254740991):0},rr=Xt,nr=Math.max,er=Math.min,or=S,ir=tr,ur=function(t,r){var n=rr(t);return n<0?nr(n+r,0):er(n,r)},cr=function(t){return function(r,n,e){var o,i=or(r),u=ir(i.length),c=ur(e,u);if(t&&n!=n){for(;u>c;)if((o=i[c++])!=o)return!0}else for(;u>c;c++)if((t||c in i)&&i[c]===n)return t||c||0;return!t&&-1}},ar={includes:cr(!0),indexOf:cr(!1)},fr=M,lr=S,sr=ar.indexOf,pr=wt,yr=function(t,r){var n,e=lr(t),o=0,i=[];for(n in e)!fr(pr,n)&&fr(e,n)&&i.push(n);for(;r.length>o;)fr(e,n=r[o++])&&(~sr(i,n)||i.push(n));return i},hr=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"].concat("length","prototype");Jt.f=Object.getOwnPropertyNames||function(t){return yr(t,hr)};var gr={};gr.f=Object.getOwnPropertySymbols;var dr,vr,mr=Jt,Sr=gr,br=q,wr=Yt("Reflect","ownKeys")||function(t){var r=mr.f(br(t)),n=Sr.f;return n?r.concat(n(t)):r},Lr=M,Or=wr,Tr=e,Er=R,jr=o,Mr=/#|\.prototype\./,Pr=function(t,r){var n=Ar[xr(t)];return n==Cr||n!=kr&&("function"==typeof r?jr(r):!!r)},xr=Pr.normalize=function(t){return String(t).replace(Mr,".").toLowerCase()},Ar=Pr.data={},kr=Pr.NATIVE="N",Cr=Pr.POLYFILL="P",_r=Pr,Nr=n,Fr=e.f,Dr=X,Gr=Z.exports,Ir=rt,Vr=function(t,r){for(var n=Or(r),e=Er.f,o=Tr.f,i=0;i<n.length;i++){var u=n[i];Lr(t,u)||e(t,u,o(r,u))}},zr=_r,Rr=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t},Hr=p,qr=Array.isArray||function(t){return"Array"==Hr(t)},Br=Yt("navigator","userAgent")||"",Wr=n.process,Kr=Wr&&Wr.versions,Yr=Kr&&Kr.v8;Yr?vr=(dr=Yr.split("."))[0]<4?1:dr[0]+dr[1]:Br&&(!(dr=Br.match(/Edge\/(\d+)/))||dr[1]>=74)&&(dr=Br.match(/Chrome\/(\d+)/))&&(vr=dr[1]);var Jr=vr&&+vr,Qr=Jr,Ur=o,Xr=!!Object.getOwnPropertySymbols&&!Ur((function(){return!String(Symbol())||!Symbol.sham&&Qr&&Qr<41})),Zr=Xr&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,$r=n,tn=lt.exports,rn=M,nn=vt,en=Xr,on=Zr,un=tn("wks"),cn=$r.Symbol,an=on?cn:cn&&cn.withoutSetter||nn,fn=function(t){return rn(un,t)&&(en||"string"==typeof un[t])||(en&&rn(cn,t)?un[t]=cn[t]:un[t]=an("Symbol."+t)),un[t]},ln=b,sn=qr,pn=fn("species"),yn=function(t,r,n){if(Rr(t),void 0===r)return t;switch(n){case 0:return function(){return t.call(r)};case 1:return function(n){return t.call(r,n)};case 2:return function(n,e){return t.call(r,n,e)};case 3:return function(n,e,o){return t.call(r,n,e,o)}}return function(){return t.apply(r,arguments)}},hn=g,gn=T,dn=tr,vn=function(t,r){var n;return sn(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!sn(n.prototype)?ln(n)&&null===(n=n[pn])&&(n=void 0):n=void 0),new(void 0===n?Array:n)(0===r?0:r)},mn=[].push,Sn=function(t){var r=1==t,n=2==t,e=3==t,o=4==t,i=6==t,u=7==t,c=5==t||i;return function(a,f,l,s){for(var p,y,h=gn(a),g=hn(h),d=yn(f,l,3),v=dn(g.length),m=0,S=s||vn,b=r?S(a,v):n||u?S(a,0):void 0;v>m;m++)if((c||m in g)&&(y=d(p=g[m],m,h),t))if(r)b[m]=y;else if(y)switch(t){case 3:return!0;case 5:return p;case 6:return m;case 2:mn.call(b,p)}else switch(t){case 4:return!1;case 7:mn.call(b,p)}return i?-1:e||o?o:b}},bn={forEach:Sn(0),map:Sn(1),filter:Sn(2),some:Sn(3),every:Sn(4),find:Sn(5),findIndex:Sn(6),filterOut:Sn(7)},wn=o,Ln=Jr,On=fn("species"),Tn=bn.filter;(function(t,r){var n,e,o,i,u,c=t.target,a=t.global,f=t.stat;if(n=a?Nr:f?Nr[c]||Ir(c,{}):(Nr[c]||{}).prototype)for(e in r){if(i=r[e],o=t.noTargetGet?(u=Fr(n,e))&&u.value:n[e],!zr(a?e:c+(f?".":"#")+e,t.forced)&&void 0!==o){if(typeof i==typeof o)continue;Vr(i,o)}(t.sham||o&&o.sham)&&Dr(i,"sham",!0),Gr(n,e,i,t)}})({target:"Array",proto:!0,forced:!function(t){return Ln>=51||!wn((function(){var r=[];return(r.constructor={})[On]=function(){return{foo:1}},1!==r[t](Boolean).foo}))}("filter")},{filter:function(t){return Tn(this,t,arguments.length>1?arguments[1]:void 0)}});var En=o,jn=bn.forEach,Mn=n,Pn={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0},xn=function(t,r){var n=[][t];return!!n&&En((function(){n.call(null,r||function(){throw 1},1)}))}("forEach")?[].forEach:function(t){return jn(this,t,arguments.length>1?arguments[1]:void 0)},An=X;for(var kn in Pn){var Cn=Mn[kn],_n=Cn&&Cn.prototype;if(_n&&_n.forEach!==xn)try{An(_n,"forEach",xn)}catch(t){_n.forEach=xn}}export default function(){var t={};return t.markdown=!1,t.separator="^\n\n\n",t["separator-vertical"]="^\n\n",t["separator-notes"]="^Note:",t.charset="iso-8859-15",{id:"screendesign",init:function(r){!function(r){console.log(r);var n=r.filter((function(t){return t.dataset.contentFile.length>0}));console.log(n),n.forEach((function(r){for(var n in console.log(r),t)t.markdown=r.dataset.contentFile,r.setAttribute("data-".concat(n),t[n])}))}(r.getSlides())}}}
