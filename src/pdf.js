import {jsPDF} from 'jspdf';
import {companies} from './data.js';
const NAVY='#173D60',TEAL='#217E81',GREY='#566D7D',LIGHT='#EEF4F8',LINE='#D3E0E8';
const url=n=>`${import.meta.env.BASE_URL}brand/${n}`;
async function load(n){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Logo could not be loaded: '+n));i.src=url(n)})}
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16))}
export async function generatePdf(v){
 const d=new jsPDF({unit:'mm',format:'a4',compress:true});const c=companies.find(x=>x.id===v.companyId)||{speed:42,seo:76,lcp:5.8,pages:24,missing:11,broken:9,facebook:'Not assessed',instagram:'Not assessed',youtube:'Not assessed',linkedin:'Not assessed',x:'Not assessed',facebookPosts:0};
 const total=Number(v.commercial.monthlyFee)*Number(v.commercial.durationMonths)+Number(v.commercial.setupFee);const plans=v.draft.plan;const included=plans.slice(0,Math.min(4,Number(v.commercial.durationMonths)));const weights=included.reduce((s,p)=>s+p.weight,0);
 const fees=included.map((p,i)=>i===included.length-1?total-included.slice(0,i).reduce((s,q)=>s+Math.round(total*q.weight/weights),0):Math.round(total*p.weight/weights));
 const images=await Promise.all(['irma.png','facebook.png','instagram.png','x.png','youtube.png','linkedin.png','website.png'].map(load));
 const text=(s,x,y,size=9,bold=false,color=NAVY)=>{d.setTextColor(...rgb(color));d.setFont('helvetica',bold?'bold':'normal');d.setFontSize(size);d.text(String(s),x,y)};
 const para=(s,x,y,w,size=8.2,color=GREY)=>{d.setTextColor(...rgb(color));d.setFont('helvetica','normal');d.setFontSize(size);const a=d.splitTextToSize(String(s),w);d.text(a,x,y);return a.length*size*.39};
 const box=(x,y,w,h,fill='#FFFFFF')=>{d.setFillColor(...rgb(fill));d.setDrawColor(...rgb(LINE));d.setLineWidth(.2);d.roundedRect(x,y,w,h,2,2,'FD')};
 const panel=(n,title,x,y,w,h)=>{box(x,y,w,h);box(x,y,w,9,LIGHT);d.setFillColor(...rgb(NAVY));d.circle(x+4.5,y+4.5,3,'F');text(n,x+3.5,y+5.6,8,true,'#FFFFFF');text(title,x+10,y+5.6,8.4,true)};
 const header=(subtitle,page)=>{
  if(v.brand.channel==='white_label'){box(9,9,39,19,'#F1EFF8');text(v.brand.name,12,19,12,true,v.brand.accent)}else d.addImage(images[0],'PNG',9,8,42,20);
  text(v.companyName,58,14,16,true);text(subtitle,58,22,9.4,true,TEAL);text(`Illustrative demo | ${v.classification.toLowerCase()} company | v${v.version} | ${page} / 2`,58,28,7,false,GREY);
  box(9,33,192,7,LIGHT);text('SYNTHETIC DATA - NO LIVE AUDIT OR EMAIL',12,37.8,6.5,true);text(`Provider: ${v.brand.name}`,123,37.8,6.5,true,TEAL)
 };
 header(v.draft.title.replace('120-day',`${Math.min(4,Number(v.commercial.durationMonths))*30}-day`),1);
 panel(1,'COMPANY & OBJECTIVE',9,44,192,22);text(v.companyName,13,58,9,true);para(v.brief.industry+' | '+v.brief.primaryMarket,103,58,90,8);
 panel(2,'SOCIAL & WEBSITE PRESENCE',9,70,192,35);
 const socials=[['Facebook',c.facebook],['Instagram',c.instagram],['X',c.x],['YouTube',c.youtube],['LinkedIn',c.linkedin],['Website','Present']];
 socials.forEach(([name,status],i)=>{let x=13+i*31.4;d.addImage(images[i+1],'PNG',x,82,8,8);text(name,x,95,7.4,true);text(status,x,100,6.6,false,GREY)});
 panel(3,'WEBSITE AUDIT',9,109,94,47);panel(4,'WHAT WE WILL IMPROVE',107,109,94,47);
 [['Mobile speed',`${c.speed} / 100`],['SEO check',`${c.seo} / 100`],['Content load time',`${c.lcp} seconds`],['Page issues',`${c.missing} descriptions / ${c.broken} links`]].forEach(([l,r],i)=>{text(l,13,125+i*7,8);text(r,58,125+i*7,8,true,TEAL)});
 para('Make the website easier to use, clarify your services and build a consistent presence. Track enquiries so the next decisions use evidence.',112,125,83,9);
 panel(5,'YOUR DELIVERY PLAN',9,160,192,83);text(`Agency fee: $${total.toLocaleString()}`,153,166,7.4,true,TEAL);
 included.forEach((p,i)=>{const w=180/included.length-2,x=13+i*(182/included.length);box(x,173,w,66);text(p.period,x+2,179,7.6,true);text('$'+fees[i].toLocaleString(),x+2,185,9,true,TEAL);let y=191; y+=para(p.title,x+2,y,w-4,8,NAVY);y+=3;para(p.summary,x+2,y,w-4,7.1);text('IRMA WORKFLOW',x+2,230,5.4,true,TEAL);para(p.agent,x+2,234,w-4,6.2,NAVY)});
 panel(6,'WHAT YOU RECEIVE',9,247,192,23);para(v.draft.scope,13,261,184,8.2);
 para('Illustrative proposal only. Not located is not confirmed absent. Client approvals and account access are required. Agency fees exclude IRMA usage, media, taxes and external tools. No guaranteed traffic, funding or sales results.',9,278,192,7);
 d.addPage();header('Deal summary & proposed payment plan',2);
 panel(1,'SEPARATE SERVICE FEES & IRMA BUDGET',9,44,192,34);
 text('Agency service fees',13,59,8,true);text('$'+total.toLocaleString(),13,69,17,true);
 text('IRMA tools & usage budget',108,59,8,true);text(v.commercial.irmaBudget==null||v.commercial.irmaBudget===''?'To be estimated':'$'+Number(v.commercial.irmaBudget).toLocaleString(),108,69,14,true,TEAL);
 para(`Client payments go externally to ${v.brand.name}. The provider funds IRMA usage separately through its existing account.`,10,87,190,8.3);
 panel(2,'PROPOSED MILESTONE PAYMENTS',9,98,192,75);
 text('Period',13,115,8,true);text('Work',48,115,8,true);text('Agency fee',128,115,8,true);text('IRMA allocation',161,115,8,true);
 included.forEach((p,i)=>{const y=124+i*10;text(p.period,13,y,7.4);para(p.title,48,y,76,7.5);text('$'+fees[i].toLocaleString(),131,y,8,true,TEAL);text(v.commercial.irmaBudget==null||v.commercial.irmaBudget===''?'Not yet quoted':'To be allocated',162,y,7,false,GREY)});
 para('Timing and IRMA allocations must be agreed before each stage. No payment is requested by this first proposal copy.',12,168,185,7.1);
 panel(3,'WHAT HAPPENS AFTER YOU REPLY',9,178,192,29);
 para('Discuss the priorities, agree the scope and full costs, then receive a formal agreement through DocuSign if you wish to proceed.',13,194,183,8.6);
 panel(4,'SCOPE & RESPONSIBILITIES',9,212,192,30);
 para(v.commercial.terms+' Client provides account access, brand materials and timely approvals. Extra work requires a separate quote.',13,228,182,7.7);
 panel(5,'ILLUSTRATIVE SIGNATURE LAYOUT - FOR LATER',9,247,192,25);
 text('Provider signature placeholder',13,261,8,false,GREY);text('Client signature space',112,261,8,false,GREY);d.setDrawColor(...rgb(LINE));d.line(13,267,93,267);d.line(112,267,194,267);
 para('For discussion only. Not signed, paid or sent. This demo uses fictional companies, sample costs and illustrative audit data. DocuSign invitations and external payments are separate later actions.',9,280,192,7);
 d.setProperties({title:`${v.companyName} proposal v${v.version}`,author:v.brand.name,subject:'Synthetic PAG workflow demonstration',creator:'PAG mockup'});
 return {blob:d.output('blob'),filename:`PAG-${v.classification.toLowerCase()}-${v.companyId}-v${v.version}.pdf`};
}
export async function downloadPdf(version){const {blob,filename}=await generatePdf(version);const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(u),5000);return {blob,filename};}
