import { button } from './helpers';

export interface Training {lesson:number; step:number; practice:'half'|'full'|'timed'; error:boolean}

export function trainingMarkup(training:Training, instruction?:string) {
  const first=['Take the flight plan.','Open the Mission Manual.','Find Earth in Routes.','Take both supply sheets.','Open Inventory.','Take APPROVE, then stamp a sheet.'];
  const text=instruction ?? (training.lesson===1?first[training.step]:training.lesson===2?'Mars needs more food. Return this plan.':training.lesson===3?(training.practice==='half'?'Set support to 50%, then confirm.':training.practice==='full'?'Set support to 100%, then confirm.':'Choose support and confirm in 30 seconds.'):'Choose a plan, then approve it.');
  return `<div class="training-heading"><span>MISSION ${training.lesson} / 4</span>${button('Repeat','repeat-lesson')}${button('Exit','exit-training')}</div><p>${text}</p><div class="training-progress" role="img" aria-label="Lesson ${training.lesson} of 4">${[1,2,3,4].map(n=>`<i class="${n<=training.lesson?'active':''}"></i>`).join('')}</div>`;
}
