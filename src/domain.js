export const clone=x=>JSON.parse(JSON.stringify(x));
export const addDays=(d,n)=>{const a=new Date(d+'T12:00:00Z');a.setUTCDate(a.getUTCDate()+n);return a.toISOString().slice(0,10)};
export const money=x=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(Number(x)||0);
export const uid=prefix=>`${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
export const unitCost=p=>0.1415+(p.simulation?2.4:0);
export function estimate(p,pools){
 const selected=pools.filter(x=>p.poolIds.includes(x.id)&&x.connected);
 const capacity=selected.reduce((s,x)=>s+x.mailboxes*x.daily,0);
 const effective=Math.min(Number(p.daily),capacity,Number(p.preparationDaily));
 return {capacity,effective,initialDays:effective>0?Math.ceil(p.companies/effective):null,maxEmails:p.companies*p.maxTouches,extraMailboxes:Math.max(0,Math.ceil(p.daily/50)-selected.reduce((s,x)=>s+x.mailboxes,0)),cost:p.total*unitCost(p)};
}
export function programmeErrors(p,pools){const e=[];const n=Number(p.companies);if(!p.name.trim())e.push('Programme name is required.');if(!Number.isInteger(n)||n<1||n>50000)e.push('Choose 1 to 50,000 synthetic companies for this demo.');if(Number(p.total)<n)e.push('Total email allowance must cover the first email to each selected company.');if(!Number.isInteger(Number(p.maxTouches))||p.maxTouches<1||p.maxTouches>5)e.push('Use one to five total emails per company.');if(p.start>p.end)e.push('End date must be on or after the start date.');if(Number(p.daily)<1||Number(p.preparationDaily)<1)e.push('Daily sending and preparation limits must be positive.');if(!estimate(p,pools).effective)e.push('Select at least one connected sender pool.');if(!p.weekdays.length)e.push('Choose at least one sending day.');if(Number(p.budget)<0.1415)e.push('Approve a usable operational budget.');if(!p.approved)e.push('Approve the programme rules before launch.');return e;}
export function createProgramme(input,pools){const p={...clone(input),companies:Number(input.companies),total:Number(input.total),daily:Number(input.daily),preparationDaily:Number(input.preparationDaily),budget:Number(input.budget),maxTouches:Number(input.maxTouches)};const errors=programmeErrors(p,pools);if(errors.length)throw Error(errors.join(' '));return {...p,id:uid('programme'),status:'Active',clock:p.start,groups:[{first:0,count:p.companies,touches:0,due:p.start,last:null,state:'active'}],totalSent:0,newCompanies:0,spend:0,timeline:[],exceptions:[]};}
export function runDay(original,pools,day=original.clock){
 const p=clone(original);if(p.status!=='Active')return p;
 if(day>p.end){p.status='Ended';p.timeline.unshift({day,count:0,message:'Hard end date reached. All sends stopped; extension requires approval.'});return p;}
 p.clock=addDays(day,1);
 if(day<p.start||!p.weekdays.includes(new Date(day+'T12:00:00Z').getUTCDay())){p.timeline.unshift({day,count:0,message:'Outside approved sending days. No sends.'});return p;}
 const used=p.timeline.filter(x=>x.day===day).reduce((s,x)=>s+x.count,0);
 const e=estimate(p,pools);let room=Math.max(0,Math.min(e.effective-used,p.total-p.totalSent,Math.floor((p.budget-p.spend+1e-8)/unitCost(p))));let sent=0,firsts=0;
 const next=[];
 for(const g of p.groups){
  if(g.state!=='active'||g.due>day||g.touches>=p.maxTouches||room<=0){next.push(g);continue;}
  const take=Math.min(g.count,room);const touches=g.touches+1;
  next.push({...g,count:take,touches,last:day,due:addDays(day,14),state:touches>=p.maxTouches?'exhausted':'active'});
  if(take<g.count)next.push({...g,first:g.first+take,count:g.count-take});
  room-=take;sent+=take;if(g.touches===0)firsts+=take;
 }
 p.groups=next;p.totalSent+=sent;p.newCompanies+=firsts;p.spend=Number((p.spend+sent*unitCost(p)).toFixed(4));
 p.timeline.unshift({day,count:sent,message:sent?`${sent.toLocaleString()} company-specific research, PDF preparation and email handoffs simulated. Next follow-up: 14 days after actual send.`:'No eligible sends, or capacity / budget / total allowance reached.'});
 if(p.totalSent>=p.total)p.status='Allowance reached';else if(p.budget-p.spend<unitCost(p))p.status='Budget hold';
 else if(p.groups.every(g=>g.state!=='active'))p.status='Completed';
 return p;
}
export function changeCompany(original,index,changes){const p=clone(original);p.groups=p.groups.flatMap(g=>{if(index<g.first||index>=g.first+g.count)return[g];const parts=[];if(index>g.first)parts.push({...g,count:index-g.first});parts.push({...g,first:index,count:1,...changes});if(index+1<g.first+g.count)parts.push({...g,first:index+1,count:g.first+g.count-index-1});return parts});return p;}
export function recordReply(p,index){return changeCompany(p,index,{state:'replied'});}
export function releaseHeldCompany(p,index){const g=p.groups.find(x=>index>=x.first&&index<x.first+x.count);if(!g||g.state!=='held')throw Error('Only a held preparation can be released.');return changeCompany(p,index,{state:'active',due:g.due>p.clock?g.due:p.clock});}
export function overrideOccurrence(p,index,date){if(date>p.end)throw Error('Selected occurrence is after the programme end date.');const g=p.groups.find(x=>index>=x.first&&index<x.first+x.count);if(!g||g.state!=='active')throw Error('Only an active company occurrence can be replaced.');return changeCompany(p,index,{due:date});}
export function manualOccurrence(p,index,day){const g=p.groups.find(x=>index>=x.first&&index<x.first+x.count);if(day>p.end||!g||g.state!=='active'||g.touches>=p.maxTouches)throw Error('This company is not eligible for another occurrence.');if(p.totalSent>=p.total||p.spend+unitCost(p)>p.budget)throw Error('Programme allowance or budget exhausted.');const changed=changeCompany(p,index,{touches:g.touches+1,last:day,due:addDays(day,14),state:g.touches+1>=p.maxTouches?'exhausted':'active'});changed.totalSent++;changed.newCompanies+=g.touches===0?1:0;changed.spend=Number((changed.spend+unitCost(p)).toFixed(4));changed.timeline.unshift({day,count:1,message:'Manual send replaced this company’s next occurrence. Its follow-up moved by 14 days; other companies unchanged.'});return changed;}
export function approveVersion(proposal,brand){if(!proposal.companyName.trim()||!proposal.objective.trim()||!proposal.draft.scope.trim())throw Error("Company, objective and approved scope are required.");if(!Number.isInteger(Number(proposal.commercial.durationMonths))||Number(proposal.commercial.durationMonths)<1)throw Error("Confirm a valid engagement duration.");if(!proposal.reportReady)throw Error('Finish research and draft generation first.');if(!Object.values(proposal.checks).every(Boolean))throw Error('Complete all three review confirmations.');if(proposal.brief.simulationEnabled&&!proposal.simulationSelected)throw Error('Complete and select a simulation before approval.');if(proposal.commercial.monthlyFee===''||Number(proposal.commercial.monthlyFee)<0)throw Error('Confirm valid commercial terms.');return {id:uid('version'),version:proposal.approved.length+1,companyName:proposal.companyName,companyId:proposal.companyId,classification:proposal.classification,journey:proposal.journey,offerTemplate:proposal.offerTemplate,brief:clone(proposal.brief),draft:clone(proposal.draft),commercial:clone(proposal.commercial),brand:clone(brand),simulationSelected:proposal.simulationSelected,createdAt:new Date().toISOString()};}
