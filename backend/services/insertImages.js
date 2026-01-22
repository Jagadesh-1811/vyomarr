// insertImages service – inserts uploaded image URLs into article content at word‑based positions
// ---------------------------------------------------------------
// Usage: const finalContent = insertImages(originalContent, imageUrls);
// ---------------------------------------------------------------
function getRandomInt(min, max) {
    // inclusive min, exclusive max
    return Math.floor(Math.random() * (max - min)) + min;
}

function insertImages(content, imageUrls) {
    if (!content) content = '';
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) return content;

    // Split content into words while preserving whitespace for later join
    const words = content.split(/\s+/);
    const result = [];
    let index = 0;
    let nextInsertPos = 200; // first insertion after 200 words

    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        // Clamp insertion position to current length
        const insertPos = Math.min(nextInsertPos, words.length);
        // Push words up to insertion point
        while (index < insertPos) {
            result.push(words[index]);
            index++;
        }
        // Insert image tag
        result.push(`<img src="${url}" alt="Article image ${i + 1}" class="article-inserted-image" />`);
        // Determine next insertion offset (70‑100 words)
        const offset = getRandomInt(70, 101);
        nextInsertPos = insertPos + offset;
    }
    // Push remaining words
    while (index < words.length) {
        result.push(words[index]);
        index++;
    }
    // Join with a single space – original spacing is approximated
    return result.join(' ');
}

module.exports = { insertImages };
