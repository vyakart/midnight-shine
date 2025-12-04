/* Microblog data (loaded from JSON) */
(function(){
  'use strict';
  if (window.microblogPosts && Array.isArray(window.microblogPosts) && window.microblogPosts.length) return;

  // Fetch posts from JSON file
  fetch('/data/microblog/posts.json')
    .then(response => response.json())
    .then(data => {
      const gradientSets = [
        ["#FFD93D", "#FF6B6B", "#C73E1D"],
        ["#667EEA", "#764BA2", "#F093FB"],
        ["#11998E", "#38EF7D", "#FC5C7D"],
        ["#1E3C72", "#7E57C2", "#F953C6"],
        ["#FA8BFF", "#2BD2FF", "#2BFF88"],
        ["#FF6B9D", "#C239B3", "#1E3C72"]
      ];

      window.microblogPosts = data.posts.map((post, index) => {
        // Extract title from HTML content
        const titleMatch = post.content.html.match(/<h2[^>]*>(.*?)<\/h2>/);
        const title = titleMatch ? titleMatch[1] : post.content.text.split('—')[0].trim();

        // Extract first paragraph or use text content
        const excerptMatch = post.content.html.match(/<p[^>]*>(.*?)<\/p>/);
        const excerpt = excerptMatch ? excerptMatch[1].replace(/<[^>]*>/g, '') : post.content.text.substring(0, 200);

        // Create slug from ID
        const slug = post.id;

        // Assign gradients cyclically
        const gradients = gradientSets[index % gradientSets.length];

        // Determine tag based on tags
        const tags = post.metadata.tags || [];
        const tagName = tags.length > 0 ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1) : "Post";
        const tagCode = `P-${String(index + 1).padStart(4, '0')}`;

        // Format timestamp
        const date = new Date(post.timestamp);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        return {
          id: index + 1,
          slug: slug,
          gradients: gradients,
          tagCode: tagCode,
          tagName: tagName,
          title: title,
          content: excerpt.length > 160 ? excerpt.substring(0, 160) + '...' : excerpt,
          fullContent: post.content.html,
          author: "Nishit",
          timestamp: formattedDate
        };
      });

      // Trigger a custom event to notify that posts are loaded
      window.dispatchEvent(new CustomEvent('microblogPostsLoaded'));
    })
    .catch(error => {
      console.error('Error loading microblog posts:', error);
      window.microblogPosts = [];
    });
})();