const deadline = new Date('2024-07-20T23:59:00');
const now = new Date();

const timeRemaining = deadline - now;

const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

console.log(`Time remaining: ${days} days, ${hours} hours, and ${minutes} minutes.`);