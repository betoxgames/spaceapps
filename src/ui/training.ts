import { button } from './helpers';

export interface Training {lesson:number; step:number; practice:'half'|'full'|'timed'; error:boolean}

export function trainingMarkup(training:Training) {
  const first=['Take the flight plan from the tray, or use Read the flight plan in the manual.','Open the Mission Manual. Press B or use the book at the left.','Open Routes and find Earth yourself. The book will never choose for you.','Take both resource sheets. Compare all five requests with Earth’s minimums.','Open Stock & log in the manual, then Inventory. The stock must cover the full request.','Take APPROVE and release it on a sheet. Every request equals its minimum.'];
  const instruction=training.lesson===1?first[training.step]:training.lesson===2?'The next route is Mars. Food requested: 6,900 kg. Find its minimum in the manual. Return the proposal if something is missing.':training.lesson===3?(training.practice==='half'?'Practice without a clock: select 50% and test the amount. How many kilograms is that?':training.practice==='full'?'Now select 100%. Full support guarantees recovery. Test it, then try with the clock.':'The clock is running. Contribution starts at zero. Choose your amount and confirm within 30 seconds.'):'The base also needs resources. Read both options, check Inventory in the manual and stamp the chosen internal order.';
  return `<div class="training-heading"><span>TRAINING / ${training.lesson} OF 4</span>${button('Repeat','repeat-lesson')}${button('Exit','exit-training')}</div><p>${instruction}</p><div class="training-progress" role="img" aria-label="Lesson ${training.lesson} of 4">${[1,2,3,4].map(n=>`<i class="${n<=training!.lesson?'active':''}"></i>`).join('')}</div>`;
}
