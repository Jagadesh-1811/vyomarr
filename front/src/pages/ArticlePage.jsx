import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Helper function for relative date formatting
const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`

  // After 7 days, show the date
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function ArticlePage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const contentType = searchParams.get('type') || 'mystery' // 'mystery' or 'whatif'

  const { user } = useAuth()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [readingProgress, setReadingProgress] = useState(0)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null) // Track which comment is being replied to

  // Fetch article data from backend
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        setError(null)
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

        // Determine which API endpoint to use based on content type
        const endpoint = contentType === 'whatif'
          ? `${API_URL}/api/whatif/${id}`
          : `${API_URL}/api/spacemysteries/${id}`

        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error('Article not found')
        }

        const data = await response.json()

        // Transform data to common format
        const heroImageUrl = data.imageUrl || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1920';

        // Filter out hero image from content images and only include images with descriptions
        const contentImages = (data.images || [])
          .filter(img => img.url !== data.imageUrl && img.url !== heroImageUrl)
          .filter(img => img.description && img.description.trim() !== '');

        const transformedArticle = {
          id: data._id,
          title: data.title,
          subHeading: data.subHeading || '',
          category: data.category,
          categoryLabel: data.categoryLabel || data.category?.toUpperCase() || 'ARTICLE',
          description: data.description,
          content: data.content || data.description,
          author: contentType === 'whatif'
            ? { name: data.authorName || 'Anonymous', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' }
            : { name: data.author || 'Vyomarr Team', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150' },
          date: getRelativeTime(data.createdAt),
          readTime: data.readTime || '5 min read',
          views: '0 views',
          heroImage: heroImageUrl,
          heroCaption: `Exploring: ${data.title}`,
          tags: [
            { name: data.category || 'Space', color: 'orange' }
          ],
          votes: data.votes || 0,
          type: contentType,
          // Include gallery images from backend (filtered)
          images: contentImages,
          // Include YouTube embed if available
          youtubeEmbed: data.youtubeEmbed || null
        }

        setArticle(transformedArticle)
        setLikeCount(transformedArticle.votes)
      } catch (err) {
        console.error('Error fetching article:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchArticle()
    }
  }, [id, contentType])

  // Fetch comments from backend
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const response = await fetch(`${API_URL}/api/comments/post/${id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Transform backend comments to match frontend format
            const transformedComments = result.data.map(c => ({
              id: c._id,
              author: c.authorName,
              time: getRelativeTime(c.createdAt),
              text: c.text,
              replies: (c.replies || []).map(r => ({
                id: r._id,
                author: r.authorName,
                time: getRelativeTime(r.createdAt),
                text: r.text
              }))
            }))
            setComments(transformedComments)
          }
        }
      } catch (err) {
        console.error('Error fetching comments:', err)
      }
    }

    fetchComments()
  }, [id])

  // Check if article is liked/saved by user
  useEffect(() => {
    const checkLikedSavedStatus = async () => {
      if (!user || !id) return
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

        // Check saved status
        const savedRes = await fetch(`${API_URL}/api/users/${user.uid}/saved-articles/check/${id}`)
        if (savedRes.ok) {
          const savedData = await savedRes.json()
          if (savedData.success) setIsSaved(savedData.isSaved)
        }

        // Check liked status - fetch all liked and check if current article is in it
        const likedRes = await fetch(`${API_URL}/api/users/${user.uid}/dashboard`)
        if (likedRes.ok) {
          const likedData = await likedRes.json()
          if (likedData.success && likedData.data?.likedArticles) {
            const isArticleLiked = likedData.data.likedArticles?.some(
              item => item.articleId?.toString() === id
            )
            setIsLiked(isArticleLiked || false)
          }
        }
      } catch (err) {
        console.error('Error checking liked/saved status:', err)
      }
    }

    checkLikedSavedStatus()
  }, [user, id])

  // Reading progress scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const articleElement = document.querySelector('.article-content')
      if (!articleElement) return
      const articleTop = articleElement.offsetTop
      const articleHeight = articleElement.offsetHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY
      const progress = Math.min(Math.max((scrollY - articleTop + windowHeight * 0.5) / articleHeight, 0), 1)
      setReadingProgress(progress * 100)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLike = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    if (!user) {
      alert('Please login to like articles')
      return
    }

    try {
      if (isLiked) {
        // Unlike
        await fetch(`${API_URL}/api/users/${user.uid}/liked-articles/${id}`, {
          method: 'DELETE'
        })
      } else {
        // Like
        await fetch(`${API_URL}/api/users/${user.uid}/liked-articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId: id,
            articleType: contentType === 'mystery' ? 'article' : 'whatif'
          })
        })
      }
      setIsLiked(!isLiked)
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const toggleSave = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

    if (!user) {
      alert('Please login to save articles')
      return
    }

    try {
      if (isSaved) {
        // Unsave
        await fetch(`${API_URL}/api/users/${user.uid}/saved-articles/${id}`, {
          method: 'DELETE'
        })
      } else if (article) {
        // Save
        await fetch(`${API_URL}/api/users/${user.uid}/saved-articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId: id,
            title: article.title,
            excerpt: article.description?.substring(0, 150),
            image: article.heroImage,
            category: article.category,
            author: article.author.name,
            url: `/article/${id}?type=${contentType}`
          })
        })
      }
      setIsSaved(!isSaved)
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  const handleSubmitComment = async () => {
    if (!comment.trim()) return

    setIsSubmittingComment(true)
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      // Prepare comment data for API
      const commentData = {
        postId: id,
        postType: contentType === 'mystery' ? 'article' : 'whatif',
        userId: user?.uid || null,
        userEmail: user?.email || null,
        authorName: user?.displayName || 'Anonymous',
        text: comment,
        parentCommentId: replyingTo !== null ? comments[replyingTo]?.id : null
      }

      // POST to backend
      const response = await fetch(`${API_URL}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const newComment = {
          id: result.data._id,
          author: user?.displayName || 'Anonymous',
          time: 'Just now',
          text: comment,
          replies: []
        }

        if (replyingTo !== null) {
          // Add reply to existing comment in UI
          setComments(prev => prev.map((c, i) => {
            if (i === replyingTo) {
              return {
                ...c,
                replies: [...(c.replies || []), {
                  id: result.data._id,
                  author: user?.displayName || 'Anonymous',
                  time: 'Just now',
                  text: comment
                }]
              }
            }
            return c
          }))
          setReplyingTo(null)
        } else {
          // Add new parent comment to UI
          setComments([newComment, ...comments])
        }
        setComment('')
      } else {
        console.error('Error saving comment:', result.error)
        alert('Failed to post comment. Please try again.')
      }
    } catch (err) {
      console.error('Error posting comment:', err)
      alert('Failed to post comment. Please try again.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleReplyClick = (index) => {
    setReplyingTo(index)
    // Scroll to comment form
    document.querySelector('.comment-form textarea')?.focus()
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setComment('')
  }

  if (loading) {
    return (
      <div className="article-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading article...</p>
        </div>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: var(--color-mist-gray);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--color-space-orange);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="article-page">
        <div className="error-container">
          <h2>Article Not Found</h2>
          <p>{error || 'The article you are looking for does not exist.'}</p>
          <Link to={contentType === 'whatif' ? '/what-if' : '/space-mysteries'} className="back-btn">
            ← Back to {contentType === 'whatif' ? 'What If Scenarios' : 'Space Mysteries'}
          </Link>
        </div>
        <style>{`
          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            text-align: center;
            padding: 40px;
          }
          .error-container h2 {
            color: var(--color-cosmic-white);
            font-size: 2rem;
            margin-bottom: 16px;
          }
          .error-container p {
            color: var(--color-mist-gray);
            margin-bottom: 24px;
          }
          .back-btn {
            padding: 12px 24px;
            background: var(--color-space-orange);
            color: white;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 600;
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <div className="article-page">
        <div className="article-layout">
          <article>
            {/* Header */}
            <header className="article-header">
              {/* Breadcrumb */}
              <nav className="breadcrumb">
                <Link to="/">Home</Link>
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                <Link to={contentType === 'whatif' ? '/what-if' : '/space-mysteries'}>
                  {contentType === 'whatif' ? 'What If' : 'Mysteries'}
                </Link>
                <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                <span className="current">{article.title.length > 30 ? article.title.substring(0, 30) + '...' : article.title}</span>
              </nav>

              <h1>{article.title}</h1>

              {/* Subtitle/Sub Heading */}
              {article.subHeading && (
                <p className="article-subtitle">{article.subHeading}</p>
              )}

              {/* Meta */}
              <div className="article-meta">
                <div className="author">
                  {article.author.name?.toLowerCase().includes('vyomarr') ? (
                    <div className="author-meta-logo">
                      <img src="/assets/images/logo.png" alt="Vyomarr Team" />
                    </div>
                  ) : (
                    <div className="author-meta-icon">
                      {article.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  <span>{article.author.name}</span>
                </div>
                <span>•</span>
                <time>{article.date}</time>
                <span>•</span>
                <span className="read-time">
                  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                  {article.readTime}
                </span>
              </div>

              {/* Tags */}
              <div className="article-tags">
                <span className="tag tag-type">{contentType === 'whatif' ? 'What If Theory' : 'Space Mystery'}</span>
                {article.tags.map((tag, i) => (
                  <span key={i} className={`tag tag-${tag.color}`}>{tag.name}</span>
                ))}
              </div>

              {/* Actions Bar */}
              <div className="article-actions-bar">
                <div className="actions-left">
                  <button className={`action-btn ${isLiked ? 'active' : ''}`} onClick={toggleLike}>
                    {isLiked ? (
                      <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    )}
                    <span>{likeCount}</span>
                  </button>
                  <button className={`action-btn ${isSaved ? 'active' : ''}`} onClick={toggleSave}>
                    {isSaved ? (
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    )}
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
                <div className="social-links">
                  <span>Follow:</span>
                  <a href="https://instagram.com/vyomarr" target="_blank" rel="noopener noreferrer" title="Instagram">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  </a>
                  <a href="https://youtube.com/@vyomarr" target="_blank" rel="noopener noreferrer" title="YouTube">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  </a>
                  <a href="https://discord.gg/vyomarr" target="_blank" rel="noopener noreferrer" title="Discord">
                    <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                  </a>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="prose article-content">
              <figure className="hero-figure">
                <img src={article.heroImage} alt={article.title} />
                <figcaption>{article.heroCaption}</figcaption>
              </figure>

              {/* Article Description/Content with images distributed evenly */}
              {/* Inline heading syntax: Lines starting with !! are rendered as headings */}
              <div className="article-body">
                {(() => {
                  const content = article.content || '';
                  const images = (article.images && Array.isArray(article.images)) ? article.images : [];

                  // Check if content contains HTML tags (from rich text editor)
                  const isHtmlContent = /<[a-z][\s\S]*>/i.test(content);
                  // Check if content already has images embedded (legacy backend behavior or user added in rich text)
                  const hasEmbeddedImages = /<img/i.test(content);

                  // If content is HTML (from rich text editor), render it with images distributed
                  if (isHtmlContent) {
                    // If images are already embedded, do not try to inject them again to avoid duplicates
                    if (hasEmbeddedImages) {
                      return (
                        <div className="rich-text-content">
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        </div>
                      );
                    }

                    // Strip HTML to get plain text for word counting
                    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                    const totalWords = plainText.split(/\s+/).length;

                    // If we have images and substantial content, split HTML into sections
                    if (images.length > 0 && totalWords > 50) {
                      const wordsPerSection = Math.floor(totalWords / (images.length + 1));

                      // Split content by paragraphs (HTML block elements)
                      const htmlParts = content.split(/(<\/(?:p|h1|h2|h3|h4|h5|h6|div|blockquote|ul|ol|li)>)/gi);

                      const elements = [];
                      let currentWordCount = 0;
                      let imgIdx = 0;
                      let accumulatedHtml = '';

                      for (let i = 0; i < htmlParts.length; i++) {
                        const part = htmlParts[i];
                        accumulatedHtml += part;

                        // Count words in this part (strip HTML for counting)
                        const partText = part.replace(/<[^>]*>/g, ' ').trim();
                        currentWordCount += partText.split(/\s+/).filter(w => w).length;

                        // Insert image if we've passed the threshold
                        if (imgIdx < images.length && currentWordCount >= wordsPerSection * (imgIdx + 1)) {
                          // Push accumulated HTML
                          if (accumulatedHtml.trim()) {
                            elements.push(
                              <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: accumulatedHtml }} />
                            );
                            accumulatedHtml = '';
                          }

                          // Push image
                          const imgDescription = images[imgIdx].description;
                          elements.push(
                            <figure className="inline-figure" key={`img-${imgIdx}`}>
                              <img src={images[imgIdx].url} alt={imgDescription || `Article visual ${imgIdx + 1}`} />
                              <figcaption>{imgDescription || `Visual ${imgIdx + 1} of ${images.length}`}</figcaption>
                            </figure>
                          );
                          imgIdx++;
                        }
                      }

                      // Push remaining accumulated HTML
                      if (accumulatedHtml.trim()) {
                        elements.push(
                          <div key="html-final" dangerouslySetInnerHTML={{ __html: accumulatedHtml }} />
                        );
                      }

                      // Push remaining images at the end
                      while (imgIdx < images.length) {
                        const imgDescription = images[imgIdx].description;
                        elements.push(
                          <figure className="inline-figure" key={`img-end-${imgIdx}`}>
                            <img src={images[imgIdx].url} alt={imgDescription || `Article visual ${imgIdx + 1}`} />
                            <figcaption>{imgDescription || `Visual ${imgIdx + 1} of ${images.length}`}</figcaption>
                          </figure>
                        );
                        imgIdx++;
                      }

                      return <div className="rich-text-content">{elements}</div>;
                    }

                    // No images or short content - just render HTML with images at end
                    return (
                      <div className="rich-text-content">
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                        {images.length > 0 && images.map((img, idx) => (
                          <figure className="inline-figure" key={`img-${idx}`}>
                            <img src={img.url} alt={img.description || `Article visual ${idx + 1}`} />
                            <figcaption>{img.description || `Visual ${idx + 1} of ${images.length}`}</figcaption>
                          </figure>
                        ))}
                      </div>
                    );
                  }

                  // For plain text content (legacy), use the existing logic
                  // Helper function to render a line (check for !! heading syntax)
                  const renderLine = (line, key) => {
                    const trimmedLine = line.trim();
                    // Check if line starts with !! (inline heading syntax)
                    if (trimmedLine.startsWith('!!')) {
                      const headingText = trimmedLine.slice(2).trim();
                      return (
                        <h3 key={key} className="inline-heading">
                          <span className="heading-symbol">✦</span> {headingText}
                        </h3>
                      );
                    }
                    return <p key={key}>{line}</p>;
                  };

                  // If no images, just render content as paragraphs/headings
                  if (images.length === 0) {
                    return content.split('\n').filter(p => p.trim()).map((paragraph, i) =>
                      renderLine(paragraph, `p-${i}`)
                    );
                  }

                  // Split content by paragraphs
                  const paragraphs = content.split('\n').filter(p => p.trim());
                  const totalWords = content.split(/\s+/).length;

                  // Calculate word interval for image insertion
                  const wordsPerImage = Math.max(50, Math.floor(totalWords / (images.length + 1)));

                  const elements = [];
                  let wordCount = 0;
                  let imgIdx = 0;

                  paragraphs.forEach((paragraph, i) => {
                    const paragraphWords = paragraph.split(/\s+/).length;

                    // Add paragraph or heading
                    elements.push(renderLine(paragraph, `p-${i}`));
                    wordCount += paragraphWords;

                    // Insert image if we've passed the threshold
                    if (imgIdx < images.length && wordCount >= wordsPerImage * (imgIdx + 1)) {
                      const imgDescription = images[imgIdx].description;
                      elements.push(
                        <figure className="inline-figure" key={`img-${imgIdx}`}>
                          <img src={images[imgIdx].url} alt={imgDescription || `Article visual ${imgIdx + 1}`} />
                          <figcaption>{imgDescription || `Visual ${imgIdx + 1} of ${images.length}`}</figcaption>
                        </figure>
                      );
                      imgIdx++;
                    }
                  });

                  // If there are remaining images that weren't inserted, add them at the end
                  while (imgIdx < images.length) {
                    const imgDescription = images[imgIdx].description;
                    elements.push(
                      <figure className="inline-figure" key={`img-${imgIdx}`}>
                        <img src={images[imgIdx].url} alt={imgDescription || `Article visual ${imgIdx + 1}`} />
                        <figcaption>{imgDescription || `Visual ${imgIdx + 1} of ${images.length}`}</figcaption>
                      </figure>
                    );
                    imgIdx++;
                  }

                  return elements;
                })()}
              </div>

              {/* Author Info Box with Vyomarr Logo */}
              <div className="author-box">
                {article.author.name?.toLowerCase().includes('vyomarr') ? (
                  <div className="author-logo">
                    <img src="/assets/images/logo.png" alt="Vyomarr Team" />
                  </div>
                ) : (
                  <div className="author-icon">
                    {article.author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
                <div>
                  <h4>Published by {article.author.name}</h4>
                  <p>Thank you for reading this {contentType === 'whatif' ? 'What If theory' : 'Space Mystery article'}. Share your thoughts in the comments below!</p>
                </div>
              </div>
            </div>

            {/* Back Navigation */}
            <div className="back-navigation">
              <Link to={contentType === 'whatif' ? '/what-if' : '/space-mysteries'} className="back-link">
                ← Back to {contentType === 'whatif' ? 'What If Scenarios' : 'Space Mysteries'}
              </Link>
            </div>
            {/* YouTube Embed (if present) */}
            {article.youtubeEmbed && (
              <div className="youtube-embed-container">
                <h3 className="youtube-section-title">Watch Video</h3>
                <div className="youtube-embed-wrapper">
                  <div dangerouslySetInnerHTML={{ __html: article.youtubeEmbed }} />
                </div>
              </div>
            )}
          </article>
        </div>

        {/* Comments Section */}
        <section className="comments-section-wrapper">
          <div className="comments-container">
            <h2>Comments</h2>

            {/* Comment Form - Only for logged-in users */}
            {user ? (
              <div className="comment-form">
                <div className="user-avatar">{user?.displayName?.[0] || 'U'}</div>
                <div className="form-content">
                  {replyingTo !== null && (
                    <div className="replying-to">
                      <span>Replying to <strong>{comments[replyingTo]?.author}</strong></span>
                      <button onClick={cancelReply} className="cancel-reply">✕ Cancel</button>
                    </div>
                  )}
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder={replyingTo !== null ? "Write your reply..." : "Share your thoughts on this article..."}
                    rows={3}
                  />
                  <button
                    className="btn-submit"
                    onClick={handleSubmitComment}
                    disabled={isSubmittingComment || !comment.trim()}
                  >
                    {isSubmittingComment ? 'Posting...' : replyingTo !== null ? 'Post Reply' : 'Post Comment'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="login-to-comment">
                <p>Please <Link to="/login" className="login-link">login</Link> to post a comment.</p>
              </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((c, i) => (
                  <div key={c.id || i} className="comment-card">
                    <div className="comment-avatar">{c.author?.[0] || 'U'}</div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <h4>{c.author}</h4>
                        <span>•</span>
                        <time>{c.time}</time>
                      </div>
                      <p>{c.text}</p>
                      <div className="comment-actions">
                        <button
                          className={replyingTo === i ? 'active' : ''}
                          onClick={() => handleReplyClick(i)}
                        >
                          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
                            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Reply
                        </button>
                      </div>

                      {/* Nested Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="replies-list">
                          {c.replies.map((reply, ri) => (
                            <div key={reply.id || ri} className="reply-card">
                              <div className="reply-avatar">{reply.author?.[0] || 'U'}</div>
                              <div className="reply-content">
                                <div className="reply-header">
                                  <h5>{reply.author}</h5>
                                  <span>•</span>
                                  <time>{reply.time}</time>
                                </div>
                                <p>{reply.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        /* Reading Progress Bar */
        .reading-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
          z-index: 9999;
          transition: width 0.1s linear;
          box-shadow: 0 0 10px rgba(252, 76, 0, 0.5);
        }

        .article-page { min-height: 100vh; }

        .article-layout {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px 1rem 2rem;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: var(--color-mist-gray);
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .breadcrumb svg { width: 16px; height: 16px; }
        .breadcrumb a { color: var(--color-mist-gray); text-decoration: none; }
        .breadcrumb a:hover { color: var(--color-space-orange); }
        .breadcrumb .current { color: var(--color-cosmic-white); }

        .article-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          line-height: 1.2;
          margin-bottom: 12px;
          color: var(--color-cosmic-white);
        }

        .article-subtitle {
          font-family: var(--font-body);
          font-size: 1.25rem;
          font-style: italic;
          font-weight: 500;
          color: var(--color-space-orange);
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          color: var(--color-mist-gray);
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .article-meta .author {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .article-meta .author .author-meta-icon,
        .article-meta .author .author-meta-logo {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-space-orange), #ff6a2b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          overflow: hidden;
        }

        .article-meta .author .author-meta-logo {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .article-meta .author .author-meta-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 4px;
        }

        .article-meta .author span { color: var(--color-cosmic-white); font-weight: 500; }

        .article-meta .read-time {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .article-meta svg { width: 16px; height: 16px; }

        .article-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .tag {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .tag-type { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
        .tag-orange { background: rgba(252, 76, 0, 0.2); color: #fc4c00; }
        .tag-yellow { background: rgba(234, 179, 8, 0.2); color: #eab308; }
        .tag-green { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .tag-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .article-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 16px;
          padding: 16px 24px;
          margin: 24px 0;
        }

        .actions-left { display: flex; gap: 16px; }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--color-mist-gray);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }

        .action-btn svg { width: 20px; height: 20px; transition: transform 0.3s; }
        .action-btn:hover, .action-btn.active { color: var(--color-space-orange); }

        .social-links {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-mist-gray);
          font-size: 0.9rem;
        }

        .social-links a {
          padding: 8px;
          color: var(--color-mist-gray);
          transition: all 0.3s;
        }

        .social-links a:hover { color: var(--color-space-orange); }
        .social-links svg { width: 16px; height: 16px; }

        .prose { max-width: 100%; }

        .prose .hero-figure {
          margin-bottom: 32px;
          border-radius: 16px;
          overflow: hidden;
        }

        .prose .hero-figure img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
        }

        .prose figcaption {
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-mist-gray);
          padding: 12px;
          font-family: var(--font-tech);
          font-style: italic;
        }

        .article-body p {
          font-family: var(--font-tech);
          font-style: italic;
          color: var(--color-cosmic-white);
          line-height: 1.8;
          margin-bottom: 24px;
          font-size: 1.1rem;
        }

        /* Inline Heading Style (!! syntax) */
        .article-body .inline-heading {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-cosmic-white);
          margin: 48px 0 24px;
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(252, 76, 0, 0.1), rgba(139, 92, 246, 0.1));
          border-left: 4px solid var(--color-space-orange);
          border-radius: 0 12px 12px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }

        .article-body .inline-heading::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(252, 76, 0, 0.05));
          pointer-events: none;
        }

        .article-body .inline-heading .heading-symbol {
          color: var(--color-space-orange);
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .article-body .inline-figure {
          margin: 32px auto;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .article-body .inline-figure img {
          width: 100%;
          max-height: 500px;
          object-fit: cover;
          display: block;
        }

        .article-body .inline-figure figcaption {
          padding: 16px 20px;
          text-align: center;
          font-size: 0.95rem;
          color: var(--color-cosmic-white);
          background: linear-gradient(135deg, rgba(252, 76, 0, 0.08), rgba(139, 92, 246, 0.05));
          font-family: var(--font-tech);
          font-style: italic;
          border-top: 1px solid rgba(252, 76, 0, 0.3);
          line-height: 1.6;
        }



        /* Style for legacy backend-inserted images */
        .article-inserted-image {
          max-width: 100%;
          border-radius: 16px;
          margin: 32px auto;
          display: block;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Rich Text Content Styling (from ReactQuill/HTML editor) */
        .article-body .rich-text-content {
          color: var(--color-cosmic-white);
          line-height: 1.8;
          font-size: 1.1rem;
        }

        .article-body .rich-text-content h1 {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-cosmic-white);
          margin: 48px 0 24px;
          border-bottom: 2px solid var(--color-space-orange);
          padding-bottom: 12px;
        }

        .article-body .rich-text-content h2 {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-cosmic-white);
          margin: 40px 0 20px;
          padding-left: 16px;
          border-left: 4px solid var(--color-space-orange);
        }

        .article-body .rich-text-content h3 {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--color-cosmic-white);
          margin: 32px 0 16px;
        }

        .article-body .rich-text-content p {
          font-family: var(--font-tech);
          color: var(--color-cosmic-white);
          line-height: 1.8;
          margin-bottom: 20px;
          font-size: 1.1rem;
        }

        .article-body .rich-text-content blockquote {
          margin: 32px 0;
          padding: 20px 24px;
          background: linear-gradient(135deg, rgba(252, 76, 0, 0.1), rgba(139, 92, 246, 0.05));
          border-left: 4px solid var(--color-space-orange);
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: var(--color-mist-gray);
        }

        .article-body .rich-text-content ul,
        .article-body .rich-text-content ol {
          margin: 20px 0;
          padding-left: 24px;
          color: var(--color-cosmic-white);
        }

        .article-body .rich-text-content li {
          margin-bottom: 8px;
          line-height: 1.7;
        }

        .article-body .rich-text-content a {
          color: var(--color-space-orange);
          text-decoration: underline;
        }

        .article-body .rich-text-content a:hover {
          color: #ff6a2b;
        }

        .article-body .rich-text-content strong {
          font-weight: 700;
          color: var(--color-cosmic-white);
        }

        .article-body .rich-text-content em {
          font-style: italic;
        }

        /* YouTube Embed Container */
        .youtube-embed-container {
          margin: 48px 0 32px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        .youtube-section-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--color-cosmic-white);
          margin-bottom: 20px;
          text-align: center;
        }

        .youtube-embed-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          overflow: hidden;
          border-radius: 12px;
          background: #000;
        }

        .youtube-embed-wrapper iframe,
        .youtube-embed-wrapper video,
        .youtube-embed-wrapper embed {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 12px;
        }

        .author-box {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          margin-top: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .author-box .author-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-space-orange), #ff6a2b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
          box-shadow: 0 4px 15px rgba(252, 76, 0, 0.4);
        }

        .author-box .author-logo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .author-box .author-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .author-box h4 {
          color: var(--color-cosmic-white);
          margin-bottom: 8px;
        }

        .author-box p {
          color: var(--color-mist-gray);
          font-size: 0.9rem;
          margin: 0;
        }

        .back-navigation {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--color-mist-gray);
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s;
        }

        .back-link:hover {
          background: var(--color-space-orange);
          color: white;
          border-color: var(--color-space-orange);
        }

        .comments-section-wrapper {
          background: rgba(0, 11, 73, 0.9);
          padding: 64px 24px;
        }

        .comments-container {
          max-width: 800px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 32px;
          padding: 40px;
        }

        .comments-container h2 {
          font-size: 1.5rem;
          margin-bottom: 24px;
          color: var(--color-cosmic-white);
        }

        .comment-form {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(252, 76, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-space-orange);
          font-weight: 700;
          flex-shrink: 0;
        }

        .form-content { flex: 1; }

        .form-content textarea {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: var(--color-cosmic-white);
          font-family: var(--font-body);
          resize: none;
          margin-bottom: 12px;
        }

        .form-content textarea:focus {
          outline: none;
          border-color: var(--color-space-orange);
        }

        .form-content .btn-submit {
          float: right;
          padding: 10px 24px;
          background: var(--color-space-orange);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .form-content .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comments-list { display: flex; flex-direction: column; gap: 16px; }

        .no-comments {
          text-align: center;
          padding: 40px;
          color: var(--color-mist-gray);
        }

        .login-to-comment {
          text-align: center;
          padding: 32px 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          margin-bottom: 32px;
        }

        .login-to-comment p {
          color: var(--color-mist-gray);
          font-size: 1rem;
          margin: 0;
        }

        .login-to-comment .login-link {
          color: var(--color-space-orange);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }

        .login-to-comment .login-link:hover {
          text-decoration: underline;
        }

        .comment-card {
          display: flex;
          gap: 16px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 24px;
        }

        .comment-card .comment-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-space-orange), #ff6a2b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .comment-content { flex: 1; }

        .comment-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .comment-header h4 {
          font-size: 0.9rem;
          color: var(--color-cosmic-white);
        }

        .comment-header time {
          font-size: 0.75rem;
          color: var(--color-mist-gray);
          font-family: var(--font-tech);
        }

        .comment-content p {
          font-size: 0.9rem;
          color: var(--color-mist-gray);
          line-height: 1.6;
          margin-bottom: 12px;
        }

        .comment-actions {
          display: flex;
          gap: 16px;
        }

        .comment-actions button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--color-mist-gray);
          font-size: 0.75rem;
          cursor: pointer;
        }

        .comment-actions button:hover { color: var(--color-space-orange); }
        .comment-actions button.active { color: var(--color-space-orange); }
        .comment-actions svg { width: 14px; height: 14px; }

        /* Reply Indicator */
        .replying-to {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(252, 76, 0, 0.1);
          border: 1px solid rgba(252, 76, 0, 0.3);
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 12px;
          font-size: 0.85rem;
          color: var(--color-space-orange);
        }

        .replying-to strong { color: var(--color-cosmic-white); }

        .cancel-reply {
          background: none;
          border: none;
          color: var(--color-mist-gray);
          cursor: pointer;
          padding: 4px 8px;
          font-size: 0.8rem;
          border-radius: 4px;
        }

        .cancel-reply:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f87171;
        }

        /* Nested Replies */
        .replies-list {
          margin-top: 16px;
          padding-left: 20px;
          border-left: 2px solid rgba(252, 76, 0, 0.3);
        }

        .reply-card {
          display: flex;
          gap: 12px;
          padding: 12px 0;
        }

        .reply-card:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .reply-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          flex-shrink: 0;
        }

        .reply-content { flex: 1; }

        .reply-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .reply-header h5 {
          font-size: 0.8rem;
          color: var(--color-cosmic-white);
          margin: 0;
          font-weight: 600;
        }

        .reply-header time {
          font-size: 0.7rem;
          color: var(--color-mist-gray);
        }

        .reply-content p {
          font-size: 0.85rem;
          color: var(--color-mist-gray);
          line-height: 1.5;
          margin: 0;
        }

        @media (max-width: 768px) {
          .article-actions-bar { flex-direction: column; gap: 16px; }
          .comment-form { flex-direction: column; }
          .author-box { flex-direction: column; text-align: center; }
        }
      `}</style>
    </>
  )
}
