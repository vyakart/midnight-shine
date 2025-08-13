/* Microblog data (shared) */
(function(){
  'use strict';
  if (window.microblogPosts && Array.isArray(window.microblogPosts) && window.microblogPosts.length) return;
  window.microblogPosts = [
    {
      id: 1,
      slug: "innocence-beginners-mindset",
      gradients: ["#FFD93D", "#FF6B6B", "#C73E1D"],
      tagCode: "V-0001",
      tagName: "Value",
      title: "Innocence — a Beginner’s Mindset",
      content: "Curiosity is my compass. I approach every project as if it were my first, free of bias, full of wonder, and open to possibility. This innocence fuels experimentation and keeps my work fresh, inviting a sense of discovery.",
      author: "Nishit",
      timestamp: "now"
    },
    {
      id: 2,
      slug: "integrity-doing-the-right-thing",
      gradients: ["#667EEA", "#764BA2", "#F093FB"],
      tagCode: "V-0002",
      tagName: "Value",
      title: "Integrity — doing the right thing when no one’s watching",
      content: "My actions align with my words, and my decisions reflect my deepest beliefs, even when it's difficult or unpopular...",
      fullContent: "My actions align with my words, and my decisions reflect my deepest beliefs, even when it's difficult or unpopular. I take ownership of my mistakes, honor my commitments, and speak truthfully with kindness. Integrity is my compass—it guides me when the path isn't clear and keeps me grounded in who I want to be.",
      author: "Nishit",
      timestamp: "now"
    },
    {
      id: 3,
      slug: "care-design-with-empathy",
      gradients: ["#11998E", "#38EF7D", "#FC5C7D"],
      tagCode: "V-0003",
      tagName: "Value",
      title: "Care — design with empathy, craft with love",
      content: "Great experiences start with listening. As someone great said, “Amongst real people there are no hierarchies.” I cater to needs, contexts, and emotions, then build thoughtfully, prioritizing inclusivity and sustainability. Every small detail is a quiet act of care.",
      author: "Nishit",
      timestamp: "now"
    },
    {
      id: 4,
      slug: "resilience-iterate-adapt-grow",
      gradients: ["#1E3C72", "#7E57C2", "#F953C6"],
      tagCode: "V-0004",
      tagName: "Value",
      title: "Resilience — iterate, adapt, grow",
      content: "I've learned that resilience isn't about avoiding difficulty, but about developing the inner strength to navigate it with grace. I find ways to grow from setbacks, to maintain hope during uncertain times, and to support others facing their own struggles. Progress isn’t a straight line—it’s a resilient loop of learning.",
      author: "Nishit",
      timestamp: "now"
    }
  ];
})();