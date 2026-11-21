export function isDesktop(): boolean {
  return Boolean(window.cpMentor?.isDesktop)
}

export function notifyDesktop(title: string, body: string, silent = false): void {
  if (window.cpMentor?.notify) {
    void window.cpMentor.notify(title, body, silent)
    return
  }
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    new Notification(title, { body })
  }
}

export async function requestNotificationPermission(): Promise<void> {
  if (isDesktop()) return
  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
    await Notification.requestPermission()
  }
}
