import{A as Cr,r as ar,a as ze}from"./inside-KOB7JHHP-MQbaLpa6.js";import"../search-worker-entry-CQUcisg8.js";var y=[],Je=[1];for(let e=0;e<32;++e){y[e]=[];for(let n=0;n<32;++n)y[e][n]=0}for(let e=0;e<32;++e){y[e][0]=y[e][e]=1,Je[e+1]=Je[e]*(e+1);for(let n=1;n<e;++n)y[e][n]=y[e-1][n-1]+y[e-1][n]}function w(e,...n){const r=n.length,o=e[n[r-1]];for(let l=r;l>0;l--)e[n[l]]=e[n[l-1]];return e[n[0]]=o,w}function Sr(e,n,r,o){r=(r||8)-1;let l=1985229328,p=0;o??(o=0),o<0&&(n<<=1);for(let u=0;u<r;++u){const _=Je[r-u];let d=~~(n/_);p^=d,n%=_,d<<=2,e[u]=l>>d&7;const b=(1<<d)-1;l=(l&b)+(l>>4&~b)}return o<0&&p&1?(e[r]=e[r-1],e[r-1]=l&7):e[r]=l&7,e}function g(e,n){const r=new Array(e);if(n!==void 0)for(let o=0;o<e;o++)r[o]=new Array(n);return r}var c,ve={},xr={},T1=0,$e=30,R1=21,Ar=22,zr=23,D1=24,Lr=25,Fr=34,jr=26,ie=40;function Br(e){return new ve[e]}function L(e,n,r,...o){let l=ve[e];l&&!l.___clazz$?c=l.prototype:(!l&&(l=ve[e]=function(){}),c=l.prototype=n<0?{}:Br(n),c.castableTypeMap$=r);for(const p of o)p.prototype=c;l.___clazz$&&(c.___clazz$=l.___clazz$,l.___clazz$=null)}function G(e){const n={};for(let r=0,o=e.length;r<o;++r)n[e[r]]=1;return n}L(1,-1,xr);c.value=null;function O1(){}function Mr(e,n){const r=U1(0,n);return P1(e.___clazz$,e.castableTypeMap$,e.queryId$,r),r}function U1(e,n){const r=new Array(n);if(e===3)for(let o=0;o<n;++o){const l={m:0,l:0,h:0};l.l=l.m=l.h=0,r[o]=l}else if(e>0){const o=[null,0,!1][e];for(let l=0;l<n;++l)r[l]=o}return r}function se(e,n,r,o,l){const p=U1(l,o);return P1(e,n,r,p),p}function P1(e,n,r,o){return N1(),Qr(o,Ke,Ye),o.___clazz$=e,o.castableTypeMap$=n,o.queryId$=r,o}function Le(e,n,r){return e[n]=r}L(73,1,{},O1);c.queryId$=0;var b1=!1;function N1(){b1||(b1=!0,Ke=[],Ye=[],Er(new O1,Ke,Ye))}function Er(e,n,r){let o=0,l;for(const p in e)(l=e[p])&&(n[o]=p,r[o]=l,++o)}function Qr(e,n,r){N1();for(let o=0,l=n.length;o<l;++o)e[n[o]]=r[o]}var Ke,Ye;function Tr(e,n){return e.castableTypeMap$&&!!e.castableTypeMap$[n]}function Rr(e,n){return e!==null&&Tr(e,n)}var k1=!1;function Dr(){if(k1)return!1;k1=!0,Pe=g(15582,36),Ne=g(15582),R=g(15582),i=g(48,48),Q=g(48,36),$=g(48),n1=g(48)}function e1(e){e.ct=g(24)}function w1(e,n){let r,o;if(Rr(n,R1)){for(r=n,o=0;o<24;++o)if(e.ct[o]!==r.ct[o])return!1;return!0}return!1}function Fe(e){let n,r,o;for(r=0,o=8,n=23;n>=0;--n)e.ct[n]===1&&(r+=y[n][o--]);return r}function ye(e){let n,r;if(ne!==null)return ne[Fe(e)];for(r=0;r<48;++r){if(n=qr(Fe(e)),n!==-1)return n*64+r;k(e,0),r%2===1&&k(e,1),r%8===7&&k(e,2),r%16===15&&k(e,3)}}function E(e,n){const r=n%3;switch(n=~~(n/3),n){case 0:{f(e.ct,0,1,2,3,r);break}case 1:{f(e.ct,16,17,18,19,r);break}case 2:{f(e.ct,8,9,10,11,r);break}case 3:{f(e.ct,4,5,6,7,r);break}case 4:{f(e.ct,20,21,22,23,r);break}case 5:{f(e.ct,12,13,14,15,r);break}case 6:{f(e.ct,0,1,2,3,r),f(e.ct,8,20,12,16,r),f(e.ct,9,21,13,17,r);break}case 7:{f(e.ct,16,17,18,19,r),f(e.ct,1,15,5,9,r),f(e.ct,2,12,6,10,r);break}case 8:{f(e.ct,8,9,10,11,r),f(e.ct,2,19,4,21,r),f(e.ct,3,16,5,22,r);break}case 9:{f(e.ct,4,5,6,7,r),f(e.ct,10,18,14,22,r),f(e.ct,11,19,15,23,r);break}case 10:{f(e.ct,20,21,22,23,r),f(e.ct,0,8,4,14,r),f(e.ct,3,11,7,13,r);break}case 11:f(e.ct,12,13,14,15,r),f(e.ct,1,20,7,18,r),f(e.ct,0,23,6,17,r)}}function k(e,n){switch(n){case 0:{E(e,19),E(e,28);break}case 1:{E(e,21),E(e,32);break}case 2:{f(e.ct,0,3,1,2,1),f(e.ct,8,11,9,10,1),f(e.ct,4,7,5,6,1),f(e.ct,12,15,13,14,1),f(e.ct,16,19,21,22,1),f(e.ct,17,18,20,23,1);break}case 3:E(e,18),E(e,29),E(e,24),E(e,35)}}function y1(e,n){let r;for(r=0;r<n;++r)k(e,0),r%2===1&&k(e,1),r%8===7&&k(e,2),r%16===15&&k(e,3)}function r1(e,n){let r,o;for(o=8,r=23;r>=0;--r)e.ct[r]=0,n>=y[r][o]&&(n-=y[r][o--],e.ct[r]=1)}function Ce(e,n){let r;for(r=0;r<24;++r)e.ct[r]=n.ct[r]}function ce(){let e;for(e1(this),e=0;e<8;++e)this.ct[e]=1;for(e=8;e<24;++e)this.ct[e]=0}function ae(e,n){let r;for(e1(this),r=0;r<24;++r)this.ct[r]=~~(e.ct[r]/2)===n?1:0}function _e(e){let n;for(e1(this),n=0;n<24;++n)this.ct[n]=e[n]}function Or(){let e,n;const r=new ce,o=new ce;for(e=0;e<15582;++e)for(r1(o,Ne[e]),n=0;n<36;++n)Ce(r,o),E(r,n),Pe[e][n]=ye(r)}function Ur(){let e,n,r,o,l,p,u,_;for(Xe(R),R[0]=0,n=0,r=1;r!==15582;)for(p=n>4,_=p?-1:n,e=p?n:-1,++n,o=0;o<15582;++o)if(R[o]===_){for(u=0;u<27;++u)if(l=~~Pe[o][u]>>>6,R[l]===e)if(++r,p){R[o]=n;break}else R[l]=n}}function Pr(e){let n,r,o;const l=new _e(e.ct);for(o=0;o<48;++o){for(n=!0,r=0;r<24;++r)if(l.ct[r]!==~~(r/4)){n=!1;break}if(n)return o;k(l,0),o%2===1&&k(l,1),o%8===7&&k(l,2),o%16===15&&k(l,3)}return-1}function Nr(){let e,n,r;const o=new ce;for(e=0;e<24;++e)o.ct[e]=e;const l=new _e(o.ct),p=new _e(o.ct),u=new _e(o.ct);for(e=0;e<48;++e){for(n=0;n<48;++n){for(r=0;r<48;++r)w1(o,l)&&(i[e][n]=r,r===0&&($[e]=n)),k(l,0),r%2===1&&k(l,1),r%8===7&&k(l,2),r%16===15&&k(l,3);k(o,0),n%2===1&&k(o,1),n%8===7&&k(o,2),n%16===15&&k(o,3)}k(o,0),e%2===1&&k(o,1),e%8===7&&k(o,2),e%16===15&&k(o,3)}for(e=0;e<48;++e)for(Ce(o,p),y1(o,$[e]),n=0;n<36;++n)for(Ce(l,o),E(l,n),y1(l,e),r=0;r<36;++r)if(Ce(u,p),E(u,r),w1(u,l)){Q[e][n]=r;break}for(r1(o,0),e=0;e<48;++e)n1[$[e]]=Fe(o),k(o,0),e%2===1&&k(o,1),e%8===7&&k(o,2),e%16===15&&k(o,3)}function Vr(){let e,n,r,o;const l=new ce,p=g(22984);for(n=0;n<22984;n++)p[n]=0;for(e=0,n=0;n<735471;++n)if(!(p[~~n>>>5]&1<<(n&31))){for(r1(l,n),o=0;o<48;++o)r=Fe(l),p[~~r>>>5]|=1<<(r&31),ne!==null&&(ne[r]=e<<6|$[o]),k(l,0),o%2===1&&k(l,1),o%8===7&&k(l,2),o%16===15&&k(l,3);Ne[e++]=n}}function qr(e){const n=Ln(Ne,e);return n>=0?n:-1}L(153,1,G([R1]),ce,ae,_e);var R,Pe,n1,ne=null,Ne,$,Q,i,C1=!1;function Hr(){C1||(C1=!0,Ee=g(70,28),Me=g(6435,28),X1=g(70,16),q1=g(6435,16),A=g(450450),H1=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0])}function je(e){let n,r,o;for(r=0,o=8,n=14;n>=0;--n)e.ct[n]!==e.ct[15]&&(r+=y[n][o--]);return r}function Be(e){let n,r,o;for(r=0,o=4,n=6;n>=0;--n)e.rl[n]!==e.rl[7]&&(r+=y[n][o--]);return r*2+e.parity}function t(e,n){e.parity^=H1[n];const r=n%3;switch(n=~~(n/3),n){case 0:{f(e.ct,0,1,2,3,r);break}case 1:{f(e.rl,0,1,2,3,r);break}case 2:{f(e.ct,8,9,10,11,r);break}case 3:{f(e.ct,4,5,6,7,r);break}case 4:{f(e.rl,4,5,6,7,r);break}case 5:{f(e.ct,12,13,14,15,r);break}case 6:{f(e.ct,0,1,2,3,r),f(e.rl,0,5,4,1,r),f(e.ct,8,9,12,13,r);break}case 7:{f(e.rl,0,1,2,3,r),f(e.ct,1,15,5,9,r),f(e.ct,2,12,6,10,r);break}case 8:{f(e.ct,8,9,10,11,r),f(e.rl,0,3,6,5,r),f(e.ct,3,2,5,4,r);break}case 9:{f(e.ct,4,5,6,7,r),f(e.rl,3,2,7,6,r),f(e.ct,11,10,15,14,r);break}case 10:{f(e.rl,4,5,6,7,r),f(e.ct,0,8,4,14,r),f(e.ct,3,11,7,13,r);break}case 11:f(e.ct,12,13,14,15,r),f(e.rl,1,4,7,2,r),f(e.ct,1,0,7,6,r)}}function Y(e,n){switch(n){case 0:{t(e,19),t(e,28);break}case 1:{t(e,21),t(e,32);break}case 2:f(e.ct,0,3,1,2,1),f(e.ct,8,11,9,10,1),f(e.ct,4,7,5,6,1),f(e.ct,12,15,13,14,1),f(e.rl,0,3,5,6,1),f(e.rl,1,2,4,7,1)}}function V1(e,n,r){let o;for(o=0;o<16;++o)e.ct[o]=~~(n.ct[o]/2);for(o=0;o<8;++o)e.rl[o]=n.ct[o+16];e.parity=r}function a1(e,n){let r,o;for(o=8,e.ct[15]=0,r=14;r>=0;--r)n>=y[r][o]?(n-=y[r][o--],e.ct[r]=1):e.ct[r]=0}function S1(e,n){let r,o;for(e.parity=n&1,n>>>=1,o=4,e.rl[7]=0,r=6;r>=0;--r)n>=y[r][o]?(n-=y[r][o--],e.rl[r]=1):e.rl[r]=0}function o1(){this.rl=g(8),this.ct=g(16)}function Xr(){let e,n,r,o,l,p,u,_,d,b;const v=new o1;for(l=0;l<70;++l)for(_=0;_<28;++_)S1(v,l),t(v,I[_]),Ee[l][_]=Be(v);for(l=0;l<70;++l)for(S1(v,l),u=0;u<16;++u)X1[l][u]=Be(v),Y(v,0),u%2===1&&Y(v,1),u%8===7&&Y(v,2);for(l=0;l<6435;++l)for(a1(v,l),u=0;u<16;++u)q1[l][u]=je(v)&65535,Y(v,0),u%2===1&&Y(v,1),u%8===7&&Y(v,2);for(l=0;l<6435;++l)for(_=0;_<28;++_)a1(v,l),t(v,I[_]),Me[l][_]=je(v)&65535;for(Xe(A),A[0]=A[18]=A[28]=A[46]=A[54]=A[56]=0,r=0,o=6;o!==450450;){const m=r>6,a=m?-1:r,z=m?r:-1;for(++r,l=0;l<450450;++l)if(A[l]===a){for(e=~~(l/70),d=l%70,_=0;_<23;++_)if(n=Me[e][_],b=Ee[d][_],p=n*70+b,A[p]===z)if(++o,m){A[l]=r;break}else A[p]=r}}}L(154,1,{},o1);c.parity=0;var Me,A,q1,H1,Ee,X1,x1=!1;function Gr(){x1||(x1=!0,ge=g(29400,20),W1=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],q=g(29400),u1=[0,9,14,23,27,28,41,42,46,55,60,69],p1=g(70))}function l1(e){let n,r,o,l;for(r=0,l=4,n=6;n>=0;--n)e.ud[n]!==e.ud[7]&&(r+=y[n][l--]);for(r*=35,l=4,n=6;n>=0;--n)e.fb[n]!==e.fb[7]&&(r+=y[n][l--]);r*=12;const p=e.fb[7]^e.ud[7];for(o=0,l=4,n=7;n>=0;--n)e.rl[n]!==p&&(o+=y[n][l--]);return e.parity+2*(r+p1[o])}function Wr(e,n){switch(e.parity^=W1[n],n){case 0:case 1:case 2:{f(e.ud,0,1,2,3,n%3);break}case 3:{f(e.rl,0,1,2,3,1);break}case 4:case 5:case 6:{f(e.fb,0,1,2,3,(n-1)%3);break}case 7:case 8:case 9:{f(e.ud,4,5,6,7,(n-1)%3);break}case 10:{f(e.rl,4,5,6,7,1);break}case 11:case 12:case 13:{f(e.fb,4,5,6,7,(n+1)%3);break}case 14:{f(e.ud,0,1,2,3,1),f(e.rl,0,5,4,1,1),f(e.fb,0,5,4,1,1);break}case 15:{f(e.rl,0,1,2,3,1),f(e.fb,1,4,7,2,1),f(e.ud,1,6,5,2,1);break}case 16:{f(e.fb,0,1,2,3,1),f(e.ud,3,2,5,4,1),f(e.rl,0,3,6,5,1);break}case 17:{f(e.ud,4,5,6,7,1),f(e.rl,3,2,7,6,1),f(e.fb,3,2,7,6,1);break}case 18:{f(e.rl,4,5,6,7,1),f(e.fb,0,3,6,5,1),f(e.ud,0,3,4,7,1);break}case 19:f(e.fb,4,5,6,7,1),f(e.ud,0,7,6,1,1),f(e.rl,1,4,7,2,1)}}function G1(e,n,r){let o;const l=(n.ct[0]>n.ct[8]?1:0)^(n.ct[8]>n.ct[16]?1:0)^(n.ct[0]>n.ct[16]?1:0)?1:0;for(o=0;o<8;++o)e.ud[o]=n.ct[o]&1^1,e.fb[o]=n.ct[o+8]&1^1,e.rl[o]=n.ct[o+16]&1^1^l;e.parity=l^r}function Ir(e,n){let r,o,l,p;for(e.parity=n&1,n>>>=1,l=u1[n%12],n=~~(n/12),p=4,r=7;r>=0;--r)e.rl[r]=0,l>=y[r][p]&&(l-=y[r][p--],e.rl[r]=1);for(o=n%35,n=~~(n/35),p=4,e.fb[7]=0,r=6;r>=0;--r)o>=y[r][p]?(o-=y[r][p--],e.fb[r]=1):e.fb[r]=0;for(p=4,e.ud[7]=0,r=6;r>=0;--r)n>=y[r][p]?(n-=y[r][p--],e.ud[r]=1):e.ud[r]=0}function f1(){this.ud=g(8),this.rl=g(8),this.fb=g(8)}function Jr(){let e,n,r,o;for(r=0;r<12;++r)p1[u1[r]]=r;const l=new f1;for(r=0;r<29400;++r)for(o=0;o<20;++o)Ir(l,r),Wr(l,o),ge[r][o]=l1(l)&65535;for(Xe(q),q[0]=0,e=0,n=1;n!==29400;){for(r=0;r<29400;++r)if(q[r]===e)for(o=0;o<17;++o)q[ge[r][o]]===-1&&(q[ge[r][o]]=e+1,++n);++e}}L(155,1,{},f1);c.parity=0;var ge,W1,q,u1,p1;function Kr(e,n){let r;for(r=0;r<24;++r)e.ct[r]=n.ct[r]}function Yr(e,n){const r=n%3;switch(n=~~(n/3),n){case 0:{f(e.ct,0,1,2,3,r);break}case 1:{f(e.ct,16,17,18,19,r);break}case 2:{f(e.ct,8,9,10,11,r);break}case 3:{f(e.ct,4,5,6,7,r);break}case 4:{f(e.ct,20,21,22,23,r);break}case 5:{f(e.ct,12,13,14,15,r);break}case 6:{f(e.ct,0,1,2,3,r),f(e.ct,8,20,12,16,r),f(e.ct,9,21,13,17,r);break}case 7:{f(e.ct,16,17,18,19,r),f(e.ct,1,15,5,9,r),f(e.ct,2,12,6,10,r);break}case 8:{f(e.ct,8,9,10,11,r),f(e.ct,2,19,4,21,r),f(e.ct,3,16,5,22,r);break}case 9:{f(e.ct,4,5,6,7,r),f(e.ct,10,18,14,22,r),f(e.ct,11,19,15,23,r);break}case 10:{f(e.ct,20,21,22,23,r),f(e.ct,0,8,4,14,r),f(e.ct,3,11,7,13,r);break}case 11:f(e.ct,12,13,14,15,r),f(e.ct,1,20,7,18,r),f(e.ct,0,23,6,17,r)}}function _1(){let e;for(this.ct=g(24),e=0;e<24;++e)this.ct[e]=~~(e/4)}function I1(){let e,n,r;for(_1.call(this),e=0;e<23;++e)r=e+ze(24-e),this.ct[r]!==this.ct[e]&&(n=this.ct[e],this.ct[e]=this.ct[r],this.ct[r]=n)}L(156,1,{},_1,I1);var A1=!1;function Zr(){A1||(A1=!0,B=g(18),$r())}function J1(e){e.cp=[0,1,2,3,4,5,6,7],e.co=[0,0,0,0,0,0,0,0]}function K1(e,n){let r;for(r=0;r<8;++r)e.cp[r]=n.cp[r],e.co[r]=n.co[r]}function hr(e,n){!e.temps&&(e.temps=new Ve),Y1(e,B[n],e.temps),K1(e,e.temps)}function tr(e,n){let r,o;for(o=0,r=6;r>=0;--r)o+=e.co[r]=n%3,n=~~(n/3);e.co[7]=(15-o)%3}function Y1(e,n,r){let o,l,p,u;for(o=0;o<8;++o)r.cp[o]=e.cp[n.cp[o]],p=e.co[n.cp[o]],u=n.co[o],l=p,l=l+(p<3?u:6-u),l=l%3,(p>=3?1:0)^(u>=3?1:0)&&(l=l+3),r.co[o]=l}function Ve(){J1(this)}function V(e,n){J1(this),Sr(this.cp,e),tr(this,n)}function Z1(){V.call(this,ze(40320),ze(2187))}function $r(){let e,n;for(B[0]=new V(15120,0),B[3]=new V(21021,1494),B[6]=new V(8064,1236),B[9]=new V(9,0),B[12]=new V(1230,412),B[15]=new V(224,137),e=0;e<18;e+=3)for(n=0;n<2;++n)B[e+n+1]=new Ve,Y1(B[e+n],B[e],B[e+n+1])}L(157,1,G([Ar]),Ve,V,Z1);c.temps=null;var B,z1=!1;function ir(){z1||(z1=!0,T=g(1937880),qe=g(1538),Re=g(1538),ue=g(11880),s1=[0,1,6,3,4,5,2,7],d1=g(160,12),v1=g(160,12),g1=[1,1,1,3,12,60,360,2520,20160,181440,1814400,19958400,239500800],Ze=[0,2,4,6,1,3,7,5,8,9,10,11])}function Z(e,n,r,o,l){const p=e.edgeo[l];e.edgeo[l]=e.edge[o],e.edge[o]=e.edgeo[r],e.edgeo[r]=e.edge[n],e.edge[n]=p}function oe(e,n){let r,o,l,p,u;for(e.isStd||$1(e),o=0,u=1985229328,p=47768,r=0;r<n;++r)l=e.edge[r]<<2,o*=12-r,l>=32?(o+=p>>l-32&15,p-=4368<<l-32):(o+=u>>l&15,p-=4369,u-=286331152<<l);return o}function h1(e){let n;const r=oe(e,4);n=ue[r];const o=n&7;n>>=3,Te(e,o);const l=oe(e,10)%20160;return n*20160+l}function Qe(e,n){switch(e.isStd=!1,n){case 0:{w(e.edge,0,4,1,5),w(e.edgeo,0,4,1,5);break}case 1:{C(e.edge,0,4,1,5),C(e.edgeo,0,4,1,5);break}case 2:{w(e.edge,0,5,1,4),w(e.edgeo,0,5,1,4);break}case 3:{C(e.edge,5,10,6,11),C(e.edgeo,5,10,6,11);break}case 4:{w(e.edge,0,11,3,8),w(e.edgeo,0,11,3,8);break}case 5:{C(e.edge,0,11,3,8),C(e.edgeo,0,11,3,8);break}case 6:{w(e.edge,0,8,3,11),w(e.edgeo,0,8,3,11);break}case 7:{w(e.edge,2,7,3,6),w(e.edgeo,2,7,3,6);break}case 8:{C(e.edge,2,7,3,6),C(e.edgeo,2,7,3,6);break}case 9:{w(e.edge,2,6,3,7),w(e.edgeo,2,6,3,7);break}case 10:{C(e.edge,4,8,7,9),C(e.edgeo,4,8,7,9);break}case 11:{w(e.edge,1,9,2,10),w(e.edgeo,1,9,2,10);break}case 12:{C(e.edge,1,9,2,10),C(e.edgeo,1,9,2,10);break}case 13:{w(e.edge,1,10,2,9),w(e.edgeo,1,10,2,9);break}case 14:{C(e.edge,0,4,1,5),C(e.edgeo,0,4,1,5),w(e.edge,9,11),w(e.edgeo,8,10);break}case 15:{C(e.edge,5,10,6,11),C(e.edgeo,5,10,6,11),w(e.edge,1,3),w(e.edgeo,0,2);break}case 16:{C(e.edge,0,11,3,8),C(e.edgeo,0,11,3,8),w(e.edge,5,7),w(e.edgeo,4,6);break}case 17:{C(e.edge,2,7,3,6),C(e.edgeo,2,7,3,6),w(e.edge,8,10),w(e.edgeo,9,11);break}case 18:{C(e.edge,4,8,7,9),C(e.edgeo,4,8,7,9),w(e.edge,0,2),w(e.edgeo,1,3);break}case 19:C(e.edge,1,9,2,10),C(e.edgeo,1,9,2,10),w(e.edge,4,6),w(e.edgeo,5,7)}}function s(e,n){switch(e.isStd=!1,n){case 0:{Qe(e,14),Qe(e,17);break}case 1:{Z(e,11,5,10,6),Z(e,5,10,6,11),Z(e,1,2,3,0),Z(e,4,9,7,8),Z(e,8,4,9,7),Z(e,0,1,2,3);break}case 2:j(e,4,5),j(e,5,4),j(e,11,8),j(e,8,11),j(e,7,6),j(e,6,7),j(e,9,10),j(e,10,9),j(e,1,1),j(e,0,0),j(e,3,3),j(e,2,2)}}function Te(e,n){for(;n>=2;)n-=2,s(e,1),s(e,2);n!==0&&s(e,0)}function ke(e,n){let r,o,l,p,u,_;for(u=1985229328,_=47768,l=0,r=0;r<11;++r)if(o=g1[11-r],p=~~(n/o),n=n%o,l^=p,p<<=2,p>=32){p=p-32,e.edge[r]=_>>p&15;const d=(1<<p)-1;_=(_&d)+(_>>4&~d)}else{e.edge[r]=u>>p&15;const d=(1<<p)-1;u=(u&d)+(u>>>4&~d)+(_<<28),_=_>>4}for(l&1?(e.edge[11]=e.edge[10],e.edge[10]=u):e.edge[11]=u,r=0;r<12;++r)e.edgeo[r]=r;e.isStd=!0}function L1(e,n){let r;for(r=0;r<12;++r)e.edge[r]=n.edge[r],e.edgeo[r]=n.edgeo[r];e.isStd=n.isStd}function t1(e,n){let r,o,l,p;for(e.temp===null&&(e.temp=g(12)),r=0;r<12;++r)e.temp[r]=r,e.edge[r]=n.ep[Ze[r]+12]%12;for(o=1,r=0;r<12;++r)for(;e.edge[r]!==r;)p=e.edge[r],e.edge[r]=e.edge[p],e.edge[p]=p,l=e.temp[r],e.temp[r]=e.temp[p],e.temp[p]=l,o^=1;for(r=0;r<12;++r)e.edge[r]=e.temp[n.ep[Ze[r]]%12];return o}function $1(e){let n;for(e.temp===null&&(e.temp=g(12)),n=0;n<12;++n)e.temp[e.edgeo[n]]=n;for(n=0;n<12;++n)e.edge[n]=e.temp[e.edge[n]],e.edgeo[n]=n;e.isStd=!0}function C(e,n,r,o,l){let p;p=e[n],e[n]=e[o],e[o]=p,p=e[r],e[r]=e[l],e[l]=p}function j(e,n,r){const o=e.edge[n];e.edge[n]=e.edgeo[r],e.edgeo[r]=o}function O(){this.edge=g(12),this.edgeo=g(12)}function sr(){let e,n,r,o,l,p,u,_,d,b,v,m,a,z,S,D,F,M,J,x,U,K;const P=new O,N=new O,Ge=new O;for(Xe(T),_=0,we=1,We(T,0,0);we!==31006080&&(S=_>9,u=_%3,p=(_+1)%3,b=S?3:u,e=S?u:3,!(_>=9));){for(m=0;m<31006080;m+=16)if(K=T[~~m>>4],!(!S&&K===-1)){for(v=m,d=m+16;v<d;++v,K>>=2)if((K&3)===b){for(J=~~(v/20160),n=qe[J],o=v%20160,ke(P,n*20160+o),F=0;F<17;++F)if(r=le(P.edge,F<<3,4),x=ue[r],U=x&7,x>>=3,l=le(P.edge,F<<3|U,10)%20160,a=x*20160+l,me(T,a)===e){if(We(T,S?v:a,p),++we,S)break;if(M=Re[x],M!==1)for(L1(N,P),Qe(N,F),Te(N,U),D=1;(M=~~M>>1&65535)!==0;++D)(M&1)===1&&(L1(Ge,N),Te(Ge,D),z=x*20160+oe(Ge,10)%20160,me(T,z)===e&&(We(T,z,p),++we))}}}++_}}function me(e,n){return e[n>>4]>>((n&15)<<1)&3}function le(e,n,r){let o,l,p,u,_;const d=v1[n],b=d1[n];for(l=0,_=1985229328,u=47768,o=0;o<r;++o)p=d[e[b[o]]]<<2,l*=12-o,p>=32?(l+=u>>p-32&15,u-=4368<<p-32):(l+=_>>p&15,u-=4369,_-=286331152<<p);return l}function i1(e){let n,r,o,l,p,u,_,d,b,v,m;const a=new O;if(u=0,p=me(T,e),p===3)return 10;for(;e!==0;)for(p===0?p=2:--p,b=~~(e/20160),n=qe[b],o=e%20160,ke(a,n*20160+o),d=0;d<17;++d)if(r=le(a.edge,d<<3,4),v=ue[r],m=v&7,v>>=3,l=le(a.edge,d<<3|m,10)%20160,_=v*20160+l,me(T,_)===p){++u,e=_;break}return u}function en(e,n){const r=me(T,e);return r===3?10:(1227133513<<r>>n&3)+n-1}function rn(){let e,n,r;const o=new O;for(n=0;n<20;++n)for(r=0;r<8;++r){for(ke(o,0),Qe(o,n),Te(o,r),e=0;e<12;++e)d1[n<<3|r][e]=o.edge[e];for($1(o),e=0;e<12;++e)v1[n<<3|r][e]=o.temp[e]}}function nn(){let e,n,r,o;const l=new O,p=g(1485);for(n=0;n<1485;n++)p[n]=0;for(e=0,n=0;n<11880;++n)if(!(p[~~n>>>3]&1<<(n&7))){for(ke(l,n*g1[8]),o=0;o<8;++o)r=oe(l,4),r===n&&(Re[e]=(Re[e]|1<<o)&65535),p[~~r>>3]=p[~~r>>3]|1<<(r&7),ue[r]=e<<3|s1[o],s(l,0),o%2===1&&(s(l,1),s(l,2));qe[e++]=n}}function We(e,n,r){e[n>>4]^=(3^r)<<((n&15)<<1)}L(158,1,G([zr]),O);c.isStd=!0;c.temp=null;var Ze,we=0,T,g1,d1,v1,ue,qe,s1,Re;function on(e){let n,r,o;for(n=0,o=!1,r=0;r<12;++r)n|=1<<e.ep[r],o=o!==e.ep[r]>=12;return n&=~~n>>12,n===0&&!o}function ln(e,n){let r;for(r=0;r<24;++r)e.ep[r]=n.ep[r]}function fn(e,n){const r=n%3;switch(n=~~(n/3),n){case 0:{f(e.ep,0,1,2,3,r),f(e.ep,12,13,14,15,r);break}case 1:{f(e.ep,11,15,10,19,r),f(e.ep,23,3,22,7,r);break}case 2:{f(e.ep,0,11,6,8,r),f(e.ep,12,23,18,20,r);break}case 3:{f(e.ep,4,5,6,7,r),f(e.ep,16,17,18,19,r);break}case 4:{f(e.ep,1,20,5,21,r),f(e.ep,13,8,17,9,r);break}case 5:{f(e.ep,2,9,4,10,r),f(e.ep,14,21,16,22,r);break}case 6:{f(e.ep,0,1,2,3,r),f(e.ep,12,13,14,15,r),f(e.ep,9,22,11,20,r);break}case 7:{f(e.ep,11,15,10,19,r),f(e.ep,23,3,22,7,r),f(e.ep,2,16,6,12,r);break}case 8:{f(e.ep,0,11,6,8,r),f(e.ep,12,23,18,20,r),f(e.ep,3,19,5,13,r);break}case 9:{f(e.ep,4,5,6,7,r),f(e.ep,16,17,18,19,r),f(e.ep,8,23,10,21,r);break}case 10:{f(e.ep,1,20,5,21,r),f(e.ep,13,8,17,9,r),f(e.ep,14,0,18,4,r);break}case 11:f(e.ep,2,9,4,10,r),f(e.ep,14,21,16,22,r),f(e.ep,7,15,1,17,r)}}function c1(){let e;for(this.ep=g(24),e=0;e<24;++e)this.ep[e]=e}function er(){let e,n,r;for(c1.call(this),e=0;e<23;++e)r=e+ze(24-e),r!==e&&(n=this.ep[e],this.ep[e]=this.ep[r],this.ep[r]=n)}L(159,1,{},c1,er);var F1=!1;function un(){F1||(F1=!0,he=[35,1,34,2,4,6,22,5,19])}function rr(e){e.moveBuffer=g(60)}function pn(e,n){return e.value-n.value}function fe(e,n){let r;for(ln(e.edge,n.edge),Kr(e.center,n.center),K1(e.corner,n.corner),e.value=n.value,e.add1=n.add1,e.length1=n.length1,e.length2=n.length2,e.length3=n.length3,e.sym=n.sym,r=0;r<60;++r)e.moveBuffer[r]=n.moveBuffer[r];e.moveLength=n.moveLength,e.edgeAvail=n.edgeAvail,e.centerAvail=n.centerAvail,e.cornerAvail=n.cornerAvail}function H(e){for(;e.centerAvail<e.moveLength;)Yr(e.center,e.moveBuffer[e.centerAvail++]);return e.center}function nr(e){for(;e.cornerAvail<e.moveLength;)hr(e.corner,e.moveBuffer[e.cornerAvail++]%18);return e.corner}function be(e){for(;e.edgeAvail<e.moveLength;)fn(e.edge,e.moveBuffer[e.edgeAvail++]);return e.edge}function _n(e){let n,r,o,l,p,u;const _=new Array(e.moveLength-(e.add1?2:0));for(r=0,n=0;n<e.length1;++n)_[r++]=e.moveBuffer[n];for(u=e.sym,n=e.length1+(e.add1?2:0);n<e.moveLength;++n)Q[u][e.moveBuffer[n]]>=27?(_[r++]=Q[u][e.moveBuffer[n]]-9,l=he[Q[u][e.moveBuffer[n]]-27],u=i[u][l]):_[r++]=Q[u][e.moveBuffer[n]];const d=i[$[u]][Pr(H(e))];for(p="",u=d,n=r-1;n>=0;--n)o=_[n],o=~~(o/3)*3+(2-o%3),Q[u][o]>=27?(p=`${p}${te[Q[u][o]-9]} `,l=he[Q[u][o]-27],u=i[u][l]):p=`${p}${te[Q[u][o]]} `;return p}function W(e,n){e.moveBuffer[e.moveLength++]=n}function De(){rr(this),this.edge=new c1,this.center=new _1,this.corner=new Ve}function He(e){De.call(this),fe(this,e)}function or(){rr(this),this.edge=new er,this.center=new I1,this.corner=new Z1}L(160,1,G([D1,Fr]),De,He,or);c.compareTo$=function(n){return pn(this,n)};c.add1=!1;c.center=null;c.centerAvail=0;c.corner=null;c.cornerAvail=0;c.edge=null;c.edgeAvail=0;c.length1=0;c.length2=0;c.length3=0;c.moveLength=0;c.sym=0;c.value=0;var he;function gn(e,n){return n.value-e.value}function Oe(e,n){return gn(e,n)}function lr(){}L(161,1,{},lr);c.compare=function(n,r){return Oe(n,r)};var j1=!1;function dn(){if(j1)return;j1=!0;let e,n;for(te=["U  ","U2 ","U' ","R  ","R2 ","R' ","F  ","F2 ","F' ","D  ","D2 ","D' ","L  ","L2 ","L' ","B  ","B2 ","B' ","Uw ","Uw2","Uw'","Rw ","Rw2","Rw'","Fw ","Fw2","Fw'","Dw ","Dw2","Dw'","Lw ","Lw2","Lw'","Bw ","Bw2","Bw'"],I=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,21,22,23,25,28,30,31,32,34,36],pe=[0,1,2,4,6,7,8,9,10,11,13,15,16,17,19,22,25,28,31,34,36],B1=g(37),M1=g(37),h=g(37,36),Se=g(29,28),xe=g(21,20),Ie=g(36),de=g(28),ee=g(20),e=0;e<29;++e)B1[I[e]]=e;for(e=0;e<21;++e)M1[pe[e]]=e;for(e=0;e<36;++e){for(n=0;n<36;++n)h[e][n]=~~(e/3)===~~(n/3)||~~(e/3)%3===~~(n/3)%3&&e>n;h[36][e]=!1}for(e=0;e<29;++e)for(n=0;n<28;++n)Se[e][n]=h[I[e]][I[n]];for(e=0;e<21;++e)for(n=0;n<20;++n)xe[e][n]=h[pe[e]][pe[n]];for(e=0;e<36;++e)for(Ie[e]=36,n=e;n<36;++n)if(!h[e][n]){Ie[e]=n-1;break}for(e=0;e<28;++e)for(de[e]=28,n=e;n<28;++n)if(!Se[e][n]){de[e]=n-1;break}for(e=0;e<20;++e)for(ee[e]=20,n=e;n<20;++n)if(!xe[e][n]){ee[e]=n-1;break}}var h,Se,xe,I,te,pe,Ie,de,ee,B1,M1;function vn(e){let n,r,o,l,p,u,_,d,b,v,m,a;e.solution="";const z=ye(new ae(H(e.c),0)),S=ye(new ae(H(e.c),1)),D=ye(new ae(H(e.c),2)),F=R[~~z>>6],M=R[~~S>>6],J=R[~~D>>6];for(e.p1SolsCnt=0,e.arr2idx=0,an(e.p1sols.heap),e.length1=(F<M?F:M)<J?F<M?F:M:J;e.length1<100&&!(J<=e.length1&&Ae(e,~~D>>>6,D&63,e.length1,-1,0)||F<=e.length1&&Ae(e,~~z>>>6,z&63,e.length1,-1,0)||M<=e.length1&&Ae(e,~~S>>>6,S&63,e.length1,-1,0));++e.length1);const x=Qn(e.p1sols,se(Rn,G([Lr,$e,ie]),D1,0,0));x.sort(function(P,N){return P.value-N.value}),n=9;do{e:for(d=x[0].value;d<100;++d)for(u=0;u<x.length&&!(x[u].value>d);++u)if(!(d-x[u].length1>n)&&(fe(e.c1,x[u]),V1(e.ct2,H(e.c1),Ue(be(e.c1).ep)),m=je(e.ct2),a=Be(e.ct2),e.length1=x[u].length1,e.length2=d-x[u].length1,fr(e,m,a,e.length2,28,0)))break e;++n}while(d===100);e.arr2.sort(function(P,N){return P.value-N.value}),_=0,r=13;do{e:for(b=e.arr2[0].value;b<100;++b)for(u=0;u<Math.min(e.arr2idx,100)&&!(e.arr2[u].value>b);++u)if(!(b-e.arr2[u].length1-e.arr2[u].length2>r)&&(p=t1(e.e12,be(e.arr2[u])),G1(e.ct3,H(e.arr2[u]),p^Ue(nr(e.arr2[u]).cp)),o=l1(e.ct3),l=oe(e.e12,10),v=i1(h1(e.e12)),v<=b-e.arr2[u].length1-e.arr2[u].length2&&ur(e,l,o,v,b-e.arr2[u].length1-e.arr2[u].length2,20,0))){_=u;break e}++r}while(b===100);const U=new He(e.arr2[_]);e.length1=U.length1,e.length2=U.length2;const K=b-e.length1-e.length2;for(u=0;u<K;++u)W(U,pe[e.move3[u]]);e.solution=_n(U)}function cn(e,n){let r,o;for(fe(e.c1,e.c),r=0;r<e.length1;++r)W(e.c1,e.move1[r]);switch(n1[n]){case 0:{W(e.c1,24),W(e.c1,35),e.move1[e.length1]=24,e.move1[e.length1+1]=35,e.add1=!0,n=19;break}case 12869:{W(e.c1,18),W(e.c1,29),e.move1[e.length1]=18,e.move1[e.length1+1]=29,e.add1=!0,n=34;break}case 735470:e.add1=!1,n=0}V1(e.ct2,H(e.c1),Ue(be(e.c1).ep));const l=je(e.ct2),p=Be(e.ct2),u=A[l*70+p];return e.c1.value=u+e.length1,e.c1.length1=e.length1,e.c1.add1=e.add1,e.c1.sym=n,++e.p1SolsCnt,e.p1sols.heap.size<500?o=new He(e.c1):(o=Mn(e.p1sols),o.value>e.c1.value&&fe(o,e.c1)),wn(e.p1sols,o),e.p1SolsCnt===1e4}function mn(e){let n;for(fe(e.c2,e.c1),n=0;n<e.length2;++n)W(e.c2,e.move2[n]);if(!on(be(e.c2)))return!1;const r=t1(e.e12,be(e.c2));G1(e.ct3,H(e.c2),r^Ue(nr(e.c2).cp));const o=l1(e.ct3);oe(e.e12,10);const l=i1(h1(e.e12));return e.arr2[e.arr2idx]?fe(e.arr2[e.arr2idx],e.c2):e.arr2[e.arr2idx]=new He(e.c2),e.arr2[e.arr2idx].value=e.length1+e.length2+Math.max(l,q[o]),e.arr2[e.arr2idx].length2=e.length2,++e.arr2idx,e.arr2idx===e.arr2.length}function bn(e){return _r(),e.c=new or,vn(e),e.solution}function Ae(e,n,r,o,l,p){let u,_,d,b,v,m;if(n===0)return o===0&&cn(e,r);for(u=0;u<27;u+=3)if(!(u===l||u===l-9||u===l-18))for(b=0;b<3;++b){if(d=u+b,_=Pe[n][Q[r][d]],v=R[~~_>>>6],v>=o){if(v>o)break;continue}if(m=i[r][_&63],_>>>=6,e.move1[p]=d,Ae(e,_,m,o-1,u,p+1))return!0}return!1}function fr(e,n,r,o,l,p){let u,_,d,b;if(n===0&&A[r]===0)return o===0&&mn(e);for(_=0;_<23;++_){if(Se[l][_]){_=de[_];continue}if(u=Me[n][_],b=Ee[r][_],d=A[u*70+b],d>=o){d>o&&(_=de[_]);continue}if(e.move2[p]=I[_],fr(e,u,b,o-1,_,p+1))return!0}return!1}function ur(e,n,r,o,l,p,u){let _,d,b,v,m,a,z,S,D;if(l===0)return n===0&&r===0;for(ke(e.tempe[u],n),m=0;m<17;++m){if(xe[p][m]){m=ee[m];continue}if(b=ge[r][m],a=q[b],a>=l){a>l&&m<14&&(m=ee[m]);continue}if(v=le(e.tempe[u].edge,m<<3,10),_=~~(v/20160),S=ue[_],D=S&7,S>>=3,d=le(e.tempe[u].edge,m<<3|D,10)%20160,z=en(S*20160+d,o),z>=l){z>l&&m<14&&(m=ee[m]);continue}if(ur(e,v,b,z,l-1,m,u+1))return e.move3[u]=m,!0}return!1}function pr(){let e;for(this.p1sols=new br(new lr),this.move1=g(15),this.move2=g(20),this.move3=g(20),this.c1=new De,this.c2=new De,this.ct2=new o1,this.ct3=new f1,this.e12=new O,this.tempe=g(20),this.arr2=g(100),e=0;e<20;++e)this.tempe[e]=new O}function _r(){E1||(Nr(),ne=g(735471),Vr(),Or(),ne=null,Ur(),Xr(),Jr(),rn(),nn(),sr(),E1=!0)}L(163,1,G([jr]),pr);c.add1=!1;c.arr2idx=0;c.c=null;c.length1=0;c.length2=0;c.p1SolsCnt=0;c.solution="";var E1=!1;function Ue(e){let n,r,o,l;for(l=0,n=0,o=e.length;n<o;++n)for(r=n;r<o;++r)e[n]>e[r]&&(l^=1);return l}function f(e,n,r,o,l,p){let u;switch(p){case 0:{u=e[l],e[l]=e[o],e[o]=e[r],e[r]=e[n],e[n]=u;return}case 1:{u=e[n],e[n]=e[o],e[o]=u,u=e[r],e[r]=e[l],e[l]=u;return}case 2:{u=e[n],e[n]=e[r],e[r]=e[o],e[o]=e[l],e[l]=u;return}}}function gr(){}function dr(e,n,r,o){const l=new gr;return l.typeName=e+n,cr(r!==0?-r:0)&&mr(r!==0?-r:0,l),l.modifiers=4,l.superclass=m1,l.componentType=o,l}function vr(e,n,r,o){const l=new gr;return l.typeName=e+n,cr(r)&&mr(r,l),l.superclass=o,l}function kn(e){const n=ve[e.seedId];return e=null,n}function cr(e){return typeof e=="number"&&e>0}function mr(e,n){let r;if(n.seedId=e,e===2)r=String.prototype;else if(e>0){let o=kn(n);if(o)r=o.prototype;else{o=ve[e]=function(){},o.___clazz$=n;return}}else return;r.___clazz$=n}c.val$outerIter=null;function wn(e,n){if(Bn(e,n))return!0}function yn(e){e.array=se(kr,G([$e,ie]),T1,0,0)}function Cn(e,n){return Le(e.array,e.size++,n),!0}function an(e){e.array=se(kr,G([$e,ie]),T1,0,0),e.size=0}function X(e,n){return e.array[n]}function Sn(e,n){const r=e.array[n];return zn(e.array,n,1),--e.size,r}function re(e,n,r){const o=e.array[n];return Le(e.array,n,r),o}function xn(e,n){let r;for(n.length<e.size&&(n=Mr(n,e.size)),r=0;r<e.size;++r)Le(n,r,e.array[r]);return n.length>e.size&&Le(n,e.size,null),n}function An(){yn(this),this.array.length=500}function zn(e,n,r){e.splice(n,r)}c.size=0;function Ln(e,n){let r,o,l,p;for(o=0,r=e.length-1;o<=r;)if(l=o+(~~(r-o)>>1),p=e[l],p<n)o=l+1;else if(p>n)r=l-1;else return l;return-o-1}function Xe(e){Fn(e,e.length)}function Fn(e,n){let r;for(r=0;r<n;++r)e[r]=-1}function jn(e,n){let r,o,l,p;const u=e.heap.size,_=X(e.heap,n);for(;n*2+1<u&&(r=(o=2*n+1,l=o+1,p=o,l<u&&Oe(X(e.heap,l),X(e.heap,o))<0&&(p=l),p),!(Oe(_,X(e.heap,r))<0));)re(e.heap,n,X(e.heap,r)),n=r;re(e.heap,n,_)}function Bn(e,n){let r,o;for(o=e.heap.size,Cn(e.heap,n);o>0;){if(r=o,o=~~((o-1)/2),Oe(X(e.heap,o),n)<=0)return re(e.heap,r,n),!0;re(e.heap,r,X(e.heap,o))}return re(e.heap,o,n),!0}function Mn(e){if(e.heap.size===0)return null;const n=X(e.heap,0);return En(e),n}function En(e){const n=Sn(e.heap,e.heap.size-1);0<e.heap.size&&(re(e.heap,0,n),jn(e,0))}function Qn(e,n){return xn(e.heap,n)}function br(e){this.heap=new An,this.cmp=e}L(239,1,{},br);c.cmp=null;c.heap=null;var m1=vr("java.lang.","Object",1,null),kr=dr("[Ljava.lang.","Object;",356,m1),Tn=vr("cs.threephase.","FullCube",160,m1),Rn=dr("[Lcs.threephase.","FullCube;",381,Tn),wr,Q1=!1;function yr(){Q1||(Q1=!0,dn(),Dr(),Hr(),Gr(),ir(),Zr(),un(),wr=new pr)}function Un(){yr(),_r()}async function Pn(){yr();const e=Cr.fromString(bn(wr));return(await ar()).concat(e)}export{Un as initialize,Pn as random444Scramble};
