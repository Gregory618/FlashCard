const INTERVALS = [1, 2, 4, 7, 15, 30, 60];

function nextReview(card, remembered, now = Date.now()) {
  const stage = Number.isInteger(card.stage) ? card.stage : 0;
  if (!remembered) {
    return { stage: 0, nextReviewAt: now + 24 * 60 * 60 * 1000, lastResult: "again", reviewCount: (card.reviewCount || 0) + 1 };
  }
  const nextStage = Math.min(stage + 1, INTERVALS.length - 1);
  const days = INTERVALS[nextStage];
  return {
    stage: nextStage,
    nextReviewAt: now + days * 24 * 60 * 60 * 1000,
    lastResult: "remembered",
    reviewCount: (card.reviewCount || 0) + 1
  };
}

function isDue(card, now = Date.now()) {
  return !card.nextReviewAt || card.nextReviewAt <= now;
}

function formatDate(timestamp) {
  if (!timestamp) return "Not scheduled";
  const d = new Date(timestamp);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

module.exports = { INTERVALS, nextReview, isDue, formatDate };