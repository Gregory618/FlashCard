const INTERVALS=[1,2,4,7,15,30,60];
function startOfDay(v){const d=new Date(v||Date.now());d.setHours(0,0,0,0);return d;}
function addDays(v,n){const d=startOfDay(v);d.setDate(d.getDate()+n);return d.getTime();}
function isDue(card,now){return !card.dueAt||card.dueAt<=(now||Date.now());}
function markResult(card,remembered,now){
  const t=now||Date.now(),next=Object.assign({},card);
  next.lastReviewedAt=t;next.reviewCount=(card.reviewCount||0)+1;
  if(remembered){
    const nextStage=Math.min((card.stage==null?-1:card.stage)+1,INTERVALS.length-1);
    next.stage=nextStage;next.dueAt=addDays(t,INTERVALS[nextStage]);
    next.correctCount=(card.correctCount||0)+1;next.lastResult="known";
  }else{
    next.stage=-1;next.dueAt=addDays(t,1);next.lastResult="missed";
  }
  return next;
}
function formatDate(t){if(!t)return"待复习";const d=new Date(t);return(d.getMonth()+1)+"月"+d.getDate()+"日";}
module.exports={INTERVALS,isDue,markResult,formatDate};