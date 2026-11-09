const { getCards, saveCards } = require("../../utils/storage");
const { isDue, nextReview } = require("../../utils/srs");
Page({
  onLoad() {
    const cards = getCards();
    this.queue = cards.filter(card => isDue(card)).sort((a,b) => (a.nextReviewAt || 0) - (b.nextReviewAt || 0));
    this.index = 0;
    this.showCurrent();
  },
  showCurrent() {
    const card = this.queue[this.index];
    if (!card) { this.setData({ card: null, queueLength: this.queue.length }); return; }
    this.setData({
      card, flipped: false, position: this.index + 1, queueLength: this.queue.length,
      progress: Math.round((this.index / Math.max(this.queue.length, 1)) * 100)
    });
  },
  flip() { this.setData({ flipped: !this.data.flipped }); },
  grade(e) {
    const remembered = e.currentTarget.dataset.remembered === "true";
    const card = this.queue[this.index];
    const update = nextReview(card, remembered);
    const cards = getCards().map(item => item.id === card.id ? { ...item, ...update } : item);
    saveCards(cards);
    this.index += 1;
    this.showCurrent();
  },
  backHome() { wx.navigateBack({ delta: 1 }); }
});