const { getCards, saveCards, deleteCard } = require("../../utils/storage");
Page({
  onShow() { this.setData({ cards: getCards() }); },
  add() { wx.navigateTo({ url: "/pages/editor/editor" }); },
  edit(e) { wx.navigateTo({ url: "/pages/editor/editor?id=" + e.currentTarget.dataset.id }); },
  remove(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({ title: "删除单词", content: "确定从词库中删除这张闪卡吗？", success: res => {
      if (res.confirm) this.setData({ cards: deleteCard(id) });
    }});
  },
  exportData() {
    const data = JSON.stringify(getCards(), null, 2);
    wx.setClipboardData({ data, success: () => wx.showToast({ title: "JSON 已复制", icon: "success" }) });
  },
  showImport() { this.setData({ importing: true, importText: "" }); },
  onImportInput(e) { this.setData({ importText: e.detail.value }); },
  importData() {
    try {
      const incoming = JSON.parse(this.data.importText);
      if (!Array.isArray(incoming) || incoming.some(c => !c.word || !c.example || !c.meaning)) throw new Error("格式不正确");
      const map = new Map(getCards().map(c => [c.id, c]));
      incoming.forEach(c => map.set(c.id || ("import-" + Date.now() + Math.random()), { ...c, id: c.id || ("import-" + Date.now() + Math.random()) }));
      saveCards(Array.from(map.values()));
      this.setData({ cards: getCards(), importing: false, importText: "" });
      wx.showToast({ title: "导入成功", icon: "success" });
    } catch (err) { wx.showModal({ title: "导入失败", content: "请检查 JSON 格式及必需字段（word、example、meaning）。" }); }
  }
});