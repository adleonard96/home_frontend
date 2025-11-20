export default class DateTimeUtility {
  private static padZero(dayPortion: number) {
    if (dayPortion < 10) {
      return '0' + dayPortion;
    } else {
      return `${dayPortion}`;
    }
  }
  public static UtcStringWithoutOffset(date: Date) {
    return `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(
      date.getDate()
    )}T${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())}`;
  }
}
