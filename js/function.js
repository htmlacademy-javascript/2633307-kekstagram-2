const checkStringLength = (str, maxLength) => str.length <= maxLength;
checkStringLength('Hello, world!', 20); // true

function isPalindrome(str) {
  const cleanedStr = str.toLowerCase().replace(/[^a-zа-яё0-9]/g, '');
  const length = cleanedStr.length;
  for (let i = 0; i < Math.floor(length / 2); i++) {
    if (cleanedStr[i] !== cleanedStr[length - 1 - i]) {
      return false;
    }
  }
  return true;
}
isPalindrome('топот');

const extractDigits = (str) => {
  if (typeof str !== 'string') {
    return NaN;
  }
  const digits = str.match(/\d/g);
  return digits ? parseInt(digits.join(''), 10) : NaN;
};
extractDigits('a1b2c3'); // 123

const isMeetingWithinWorkday = (workStart, workEnd, meetingStart, meetingDuration) => {
  const minuts = 60;
    const timeToMinutes = (timeStr) => {
        if (!timeStr) {
      return 0;
}
        return timeStr.split(':').reduce((hours, minutes) => +hours * minuts + (+minutes || 0));
    };

    return timeToMinutes(meetingStart) >= timeToMinutes(workStart) &&
           timeToMinutes(meetingStart) + meetingDuration <= timeToMinutes(workEnd);
};
isMeetingWithinWorkday(); // true
