export function timeDifference(time: string) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const timestamp = new Date(time).getTime();
  const current = Date.now();
  const elapsed = current - timestamp;

  const rtf = new Intl.RelativeTimeFormat("kr", { numeric: "auto" });

  if (elapsed < msPerMinute) {
    return rtf.format(-Math.floor(elapsed / 1000), "seconds");
  } else if (elapsed < msPerHour) {
    return rtf.format(-Math.floor(elapsed / msPerMinute), "minutes");
  } else if (elapsed < msPerDay) {
    return rtf.format(-Math.floor(elapsed / msPerHour), "hours");
  } else {
    return new Date(timestamp).toLocaleDateString("kr");
  }
}

export function timeDifferences(time: string, time2?: string) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const timestamp = new Date(time).getTime();
  const current = time2 ? new Date(time2).getTime() : new Date().getTime();
  const elapsed = current - timestamp;

  const careerYear =
    Math.trunc(elapsed / msPerYear) > 0
      ? `${Math.trunc(elapsed / msPerYear)}년 `
      : "";

  const careerMonth =
    Math.trunc((elapsed % msPerYear) / msPerMonth) > 0
      ? `${Math.trunc((elapsed % msPerYear) / msPerMonth)}개월 `
      : "";

  return `${careerYear}${careerMonth}`;
}

export function chk5MFromNow(time: string) {
  let min5 = 300000;
  return new Date().getTime() <= new Date(time).getTime() + min5;
}

interface ITimeFormat {
  time?: string;
  type: "year" | "month" | "day";
}

export function timeFormat({ time, type = "day" }: ITimeFormat) {
  if (!time) return "현재";

  const date = new Date(time);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  switch (type) {
    case "year":
      return year;
    case "month":
      return `${year}.${`${month}`.padStart(2, "0")}`;
    case "day":
      return `${year}.${`${month}`.padStart(2, "0")}.${`${day}`.padStart(
        2,
        "0"
      )}`;
  }
}
