/* notifications.js */

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleLocalReminder(title, body, delayMs) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  setTimeout(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
      });
    } else {
      new Notification(title, { body, icon: '/icons/icon-192.png' });
    }
  }, delayMs);
}

export function scheduleDaily(timeStr, session) {
  // timeStr = "HH:MM"
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target - now;
  const sessionLabel = session === 'morning' ? 'Morning' : 'Evening';
  scheduleLocalReminder(
    "Grandma's Meds 💙",
    `Time for your ${sessionLabel} medications! You've got this! 🌟`,
    delay
  );
}

export function sendFamilyNotification(familyMembers, message) {
  // In production: POST to your backend/Netlify function which sends SMS/email
  // Here we log to console and show a browser notification as demo
  console.log('Family notification:', message, 'To:', familyMembers);
  // Could integrate with Twilio (Netlify function) or EmailJS here
}
