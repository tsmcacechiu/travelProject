export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "你的時間有限，別浪費在過別人的生活。", author: "Steve Jobs" },
  { text: "別等待。時機永遠不會恰到好處。", author: "Napoleon Hill" },
  { text: "生命不在於長短，而在於深度。", author: "Ralph Waldo Emerson" },
  { text: "死亡不是最大的損失，讓靈魂在活著的時候消亡才是。", author: "Norman Cousins" },
  { text: "每一天都是你剩下的生命中的第一天。", author: "American Proverb" },
  { text: "我們所擁有的只有現在。", author: "Marcus Aurelius" },
  { text: "別數你活了多少天，而要讓每一天都值得被數。", author: "Unknown" },
  { text: "有一天你會醒來，發現已沒有時間去做你一直想做的事。", author: "Paulo Coelho" },
  { text: "最終，重要的不是你活了多少歲，而是你的歲月裡有多少生命。", author: "Abraham Lincoln" },
  { text: "時間是我們最稀缺的資源，而如果無法管理它，就什麼都管不了。", author: "Peter Drucker" },
];

export function randomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
