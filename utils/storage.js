const KEY = "english_flashcard_cards_v1";
const seed = require("../data/seed");

function getCards() {
  const saved = wx.getStorageSync(KEY);
  if (Array.isArray(saved)) return saved;
  wx.setStorageSync(KEY, seed);
  return seed;
}
function saveCards(cards) {
  wx.setStorageSync(KEY, cards);
}
function upsertCard(card) {
  const cards = getCards();
  const index = cards.findIndex(item => item.id === card.id);
  if (index >= 0) cards[index] = card;
  else cards.unshift(card);
  saveCards(cards);
  return cards;
}
function deleteCard(id) {
  const cards = getCards().filter(card => card.id !== id);
  saveCards(cards);
  return cards;
}
module.exports = { getCards, saveCards, upsertCard, deleteCard };