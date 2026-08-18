// levels-data.js
const LEVELS = [
  {
    id: "A1", name: "المبتدئ", color: "#4ade80", icon: "🌱",
    sections: [
      { id: "vocabulary", name: "المفردات", total: 150 },
      { id: "reading", name: "فهم القراءة", total: 60 },
      { id: "sentence", name: "معنى الجملة", total: 100 },
      { id: "synonyms", name: "مرادفات ومتضادات", total: 80 },
      { id: "grammar", name: "القواعد بالسياق", total: 80 }
    ]
  },
  {
    id: "A2", name: "مبتدئ متقدم", color: "#38bdf8", icon: "🌿",
    sections: [
      { id: "vocabulary", name: "المفردات", total: 180 },
      { id: "reading", name: "فهم القراءة", total: 80 },
      { id: "sentence", name: "معنى الجملة", total: 120 },
      { id: "synonyms", name: "مرادفات ومتضادات", total: 100 },
      { id: "grammar", name: "القواعد بالسياق", total: 100 }
    ]
  },
  {
    id: "B1", name: "المتوسط", color: "#818cf8", icon: "🌳",
    sections: [
      { id: "vocabulary", name: "المفردات", total: 200 },
      { id: "reading", name: "فهم القراءة", total: 100 },
      { id: "sentence", name: "معنى الجملة", total: 150 },
      { id: "synonyms", name: "مرادفات ومتضادات", total: 120 },
      { id: "grammar", name: "القواعد بالسياق", total: 130 },
      { id: "academic", name: "مفردات أكاديمية", total: 40 }
    ]
  },
  {
    id: "B2", name: "متوسط متقدم", color: "#f472b6", icon: "🍃",
    sections: [
      { id: "vocabulary", name: "المفردات", total: 220 },
      { id: "reading", name: "فهم القراءة", total: 120 },
      { id: "sentence", name: "معنى الجملة", total: 170 },
      { id: "synonyms", name: "مرادفات ومتضادات", total: 140 },
      { id: "grammar", name: "القواعد بالسياق", total: 150 },
      { id: "academic", name: "مفردات أكاديمية", total: 80 }
    ]
  },
  {
    id: "C1", name: "المتقدم", color: "#fb923c", icon: "🌲",
    sections: [
      { id: "vocabulary", name: "المفردات", total: 200 },
      { id: "reading", name: "فهم القراءة", total: 140 },
      { id: "sentence", name: "معنى الجملة", total: 180 },
      { id: "synonyms", name: "مرادفات ومتضادات", total: 150 },
      { id: "grammar", name: "القواعد بالسياق", total: 160 },
      { id: "academic", name: "مفردات أكاديمية", total: 150 }
    ]
  },
  {
    id: "C2", name: "الإتقان الكامل", color: "#facc15", icon: "🏔️",
    sections: [
      { id: "vocabulary", name: "المفردات", total: 180 },
      { id: "reading", name: "فهم القراءة", total: 150 },
      { id: "sentence", name: "معنى الجملة", total: 180 },
      { id: "synonyms", name: "مرادفات ومتضادات", total: 150 },
      { id: "grammar", name: "القواعد بالسياق", total: 150 },
      { id: "academic", name: "مفردات أكاديمية", total: 200 }
    ]
  }
];

function getLevelTotal(levelId) {
  const level = LEVELS.find(l => l.id === levelId);
  if (!level) return 0;
  return level.sections.reduce((sum, s) => sum + s.total, 0);
}

function getSiteTotal() {
  return LEVELS.reduce((sum, l) => sum + getLevelTotal(l.id), 0);
}
