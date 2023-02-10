export function extractContent(htmlText: string) {
  var span = document.createElement("span");
  span.innerHTML = htmlText;
  return span.textContent || span.innerText;
}
