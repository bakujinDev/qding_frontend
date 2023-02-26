import { toast } from "react-toastify";

export function extractContent(htmlText: string) {
  var span = document.createElement("span");
  span.innerHTML = htmlText;
  return span.textContent || span.innerText;
}

export const commentRuleList = [
  "게시물과 관련된 정보에 대해 작성해주세요",
  "게시물에 대한 평가는 추천기능을 활용해주세요",
];

export function onClickShareBtn(url: string) {
  window.navigator.clipboard.writeText(url);
  toast("페이지 링크가 복사되었어요");
}
