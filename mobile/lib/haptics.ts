import * as Haptics from "expo-haptics";
// Light confirmation for meaningful completed actions only (seat requested, group joined, post published).
// Never call this for ordinary taps. Failures (web, unsupported devices) are ignored.
export function hapticSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
