const { getCards } = require("../../utils/storage");
const { isDue } = require("../../utils/srs");
Page({
  onShow() {
    const cards = getCards();
    this.setData({
      totalCount: cards.length,
      dueCount: cards.filter(card => isDue(card)).length,
      learnedCount: cards.filter(card => (card.reviewCount || 0) > 0).length
    });
  },
  startReview() { wx.navigateTo({ url: "/pages/review/review" }); },
  openCards() { wx.navigateTo({ url: "/pages/cards/cards" }); },
  addCard() { wx.navigateTo({ url: "/pages/editor/editor" }); }
});