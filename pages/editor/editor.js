const { getCards, upsertCard } = require("../../utils/storage");
Page({
  onLoad(options) {
    this.cardId = options.id || "";
    if (this.cardId) {
      const card = getCards().find(item => item.id === this.cardId);
      if (card) this.setData({ ...card, synonymsText: (card.synonyms || []).join(", ") });
    }
  },
  input(e) { this.setData({ [e.currentTarget.dataset.field]: e.detail.value }); },
  save() {
    const { word, example, meaning, synonymsText, notes } = this.data;
    if (!word || !example || !meaning) {
      wx.showToast({ title: "请填写单词、英文例句和中文释义", icon: "none" }); return;
    }
    const old = this.cardId ? getCards().find(c => c.id === this.cardId) : null;
    upsertCard({
      ...(old || {}), id: this.cardId || ("card-" + Date.now()),
      word: word.trim(), example: example.trim(), meaning: meaning.trim(),
      synonyms: (synonymsText || "").split(",").map(s => s.trim()).filter(Boolean),
      notes: (notes || "").trim(),
      createdAt: old ? old.createdAt : Date.now(),
      stage: old ? old.stage : 0,
      nextReviewAt: old ? old.nextReviewAt : Date.now() + 24 * 60 * 60 * 1000,
      reviewCount: old ? old.reviewCount : 0
    });
    wx.showToast({ title: "保存成功", icon: "success" });
    setTimeout(() => wx.navigateBack(), 400);
  }
});