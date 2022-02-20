import formatDistanceToNow from "date-fns/formatDistanceToNow";

export function main() {
  const originalDocumentTitle = window.document.title;
  let intervalId: number;

  function onBlur() {
    const blurredAt = new Date();

    intervalId = window.setInterval(() => {
      window.document.title = `${originalDocumentTitle} (Last visited: ${formatDistanceToNow(
        blurredAt
      )} ago)`;
    }, 60000);
  }

  function onFocus() {
    window.clearInterval(intervalId);
    window.document.title = originalDocumentTitle;
  }

  window.addEventListener("blur", onBlur);
  window.addEventListener("focus", onFocus);

  return () => {
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("focus", onFocus);
  };
}

main();
