export const QuoteApi = (() => {
  async function getQuote() {
    let resp = await fetch("https://api.quotable.io/random");
    let data = JSON.parse(await resp.text());
    return `${data["content"]} - ${data["author"]}`;
  }

  return {
    getQuote,
  };
})();
