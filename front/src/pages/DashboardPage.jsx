import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('publications')
  const [savedArticles, setSavedArticles] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(true)
  const [errorSaved, setErrorSaved] = useState(null)
  const [likedArticles, setLikedArticles] = useState([])
  const [loadingLiked, setLoadingLiked] = useState(true)
  const [errorLiked, setErrorLiked] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    // Sync user to database first (ensures user exists in MongoDB)
    const syncUserToDatabase = async () => {
      try {
        await fetch(`${API_URL}/api/users/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firebaseUid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          })
        });
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    // Fetch saved articles from database
    const fetchSavedArticles = async () => {
      setLoadingSaved(true)
      setErrorSaved(null)
      try {
        const response = await fetch(`${API_URL}/api/users/${user.uid}/saved-articles`)
        const data = await response.json()

        // Handle both success and 404 (no articles) cases
        if (data.success || response.status === 404) {
          const transformed = (data.data || []).map(article => ({
            id: article.articleId || article._id,
            title: article.title,
            excerpt: article.excerpt,
            image: article.image,
            category: article.category,
            author: article.author,
            url: article.url,
            savedAt: article.savedAt
          }))
          setSavedArticles(transformed)
        } else {
          throw new Error(data.error || 'Failed to fetch saved articles')
        }
      } catch (error) {
        console.error('Error fetching saved articles:', error)
        setErrorSaved(error.message)
      } finally {
        setLoadingSaved(false)
      }
    }

    // Fetch liked articles from database
    const fetchLikedArticles = async () => {
      setLoadingLiked(true)
      setErrorLiked(null)
      try {
        const response = await fetch(`${API_URL}/api/users/${user.uid}/liked-articles`)
        const data = await response.json()

        // Handle both success and 404 (no articles) cases
        if (data.success || response.status === 404) {
          const transformed = (data.data || []).map(item => ({
            id: item.articleId?.toString() || item.articleId,
            title: item.article?.title || 'Untitled',
            excerpt: item.article?.description?.substring(0, 150) || '',
            image: item.article?.imageUrl || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=800',
            category: item.article?.category || 'ARTICLE',
            likedAt: item.likedAt,
            articleType: item.articleType
          }))
          setLikedArticles(transformed)
        } else {
          throw new Error(data.error || 'Failed to fetch liked articles')
        }
      } catch (error) {
        console.error('Error fetching liked articles:', error)
        setErrorLiked(error.message)
      } finally {
        setLoadingLiked(false)
      }
    }

    // Run sync first, then fetch data
    const initDashboard = async () => {
      await syncUserToDatabase();
      fetchSavedArticles();
      fetchLikedArticles();
    };

    initDashboard();
  }, [user, navigate, API_URL])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const unsaveArticle = async (articleId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.uid}/saved-articles/${articleId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setSavedArticles(prev => prev.filter(a => a.id !== articleId))
      }
    } catch (error) {
      console.error('Error unsaving article:', error)
    }
  }

  const unlikeArticle = async (articleId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${user.uid}/liked-articles/${articleId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setLikedArticles(prev => prev.filter(a => a.id !== articleId))
      }
    } catch (error) {
      console.error('Error unliking article:', error)
    }
  }

  const getTimeSince = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago'
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago'
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago'
    return Math.floor(seconds / 604800) + ' weeks ago'
  }

  if (!user) return null

  const getInitial = () => {
    if (user.displayName) return user.displayName.charAt(0).toUpperCase()
    if (user.email) return user.email.charAt(0).toUpperCase()
    return 'E'
  }

  const displayName = user.displayName || user.email?.split('@')[0] || 'Explorer'

  // Publications: Fetch user's What If theories from backend
  const [publications, setPublications] = useState([]);
  const [loadingPublications, setLoadingPublications] = useState(true);
  const [errorPublications, setErrorPublications] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    setLoadingPublications(true);
    setErrorPublications(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    fetch(`${API_URL}/api/whatif/user/${encodeURIComponent(user.email)}`)
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch publications'))
      .then(data => {
        // Transform backend data to match frontend expectations
        const transformed = (Array.isArray(data) ? data : []).map(theory => ({
          id: theory._id,
          title: theory.title,
          image: theory.imageUrl || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=800',
          status: theory.status, // 'pending', 'approved', or 'rejected'
          excerpt: theory.description?.substring(0, 150) + (theory.description?.length > 150 ? '...' : ''),
          votes: theory.votes || 0,
          timeAgo: getTimeSince(theory.createdAt),
          category: theory.category,
          rejectionReason: theory.rejectionReason
        }));
        setPublications(transformed);
      })
      .catch(err => setErrorPublications(err.toString()))
      .finally(() => setLoadingPublications(false));
  }, [user?.email]);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="avatar-container">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="avatar-photo" referrerPolicy="no-referrer" />
              ) : (
                <div className="avatar">{getInitial()}</div>
              )}
            </div>
            <div className="profile-info">
              <h1>{displayName}</h1>
              <p>{user.email}</p>
              <p className="join-date">
                <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Joined December 2025
              </p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-value">{publications.length}</div>
                <div className="stat-label">Publications</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{savedArticles.length}</div>
                <div className="stat-label">Saved</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{likedArticles.length}</div>
                <div className="stat-label">Likes</div>
              </div>
            </div>
            <div className="logout-container">
              <button onClick={handleLogout} className="logout-btn">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'publications' ? 'active' : ''}`}
              onClick={() => setActiveTab('publications')}
            >
              My Publications
            </button>
            <button
              className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
              Saved Articles
            </button>
            <button
              className={`tab-btn ${activeTab === 'liked' ? 'active' : ''}`}
              onClick={() => setActiveTab('liked')}
            >
              <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
              Liked Articles
            </button>
          </div>

          {/* Publications Tab */}
          {activeTab === 'publications' && (
            <div className="tab-content">
              <h2 className="section-title">
                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                Your What If Theories
              </h2>
              {loadingPublications ? (
                <div className="loading-state">Loading your theories...</div>
              ) : errorPublications ? (
                <div className="error-state">{errorPublications}</div>
              ) : publications.length === 0 ? (
                <div className="empty-state">
                  <h3>No Theories Yet</h3>
                  <p>Share your cosmic "What If" ideas with the universe!</p>
                </div>
              ) : (
                <div className="cards-grid">
                  {publications.map(pub => (
                    <article key={pub.id} className="dashboard-card">
                      <img src={pub.image} alt={pub.title} className="card-image" />
                      <div className={`card-tag ${pub.status}`}>
                        {pub.status === 'approved' ? (
                          <><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Approved</>
                        ) : pub.status === 'rejected' ? (
                          <><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg> Rejected</>
                        ) : (
                          <><svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg> Pending Review</>
                        )}
                      </div>
                      <h3 className="card-title">{pub.title}</h3>
                      <p className="card-excerpt">{pub.excerpt}</p>
                      {pub.status === 'rejected' && pub.rejectionReason && (
                        <div className="rejection-reason">
                          <strong>Rejection Reason:</strong> {pub.rejectionReason}
                        </div>
                      )}
                      <div className="card-meta">
                        <span>
                          {pub.status === 'approved' ? (
                            <><svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg> {pub.votes} votes</>
                          ) : (
                            <><svg fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> {pub.status === 'pending' ? 'Awaiting Review' : 'Not Published'}</>
                          )}
                        </span>
                        <span>
                          <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                          {pub.timeAgo}
                        </span>
                      </div>
                      {pub.status === 'approved' && (
                        <Link to={`/article/${pub.id}?type=whatif`} className="read-more">View Article →</Link>
                      )}
                    </article>
                  ))}
                </div>
              )}
              <div className="cta-center">
                <Link to="/submit-theory" className="btn-primary">
                  Submit New Theory
                </Link>
              </div>
            </div>
          )}

          {/* Saved Articles Tab */}
          {activeTab === 'saved' && (
            <div className="tab-content">
              <h2 className="section-title">
                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                Your Saved Articles
              </h2>
              {loadingSaved ? (
                <div className="loading-state">Loading your saved articles...</div>
              ) : errorSaved ? (
                <div className="error-state">{errorSaved}</div>
              ) : savedArticles.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                  <h3>No Saved Articles Yet</h3>
                  <p>Save articles you want to read later by clicking the Save button on any article.</p>
                  <Link to="/space-mysteries" className="explore-btn">
                    <span className="explore-icon">🧭</span>
                    Explore Articles
                  </Link>
                </div>
              ) : (
                <>
                  <div className="cards-grid">
                    {savedArticles.map(article => (
                      <article key={article.id} className="dashboard-card">
                        <button
                          className="favorite-btn active"
                          onClick={() => unsaveArticle(article.id)}
                          title="Remove from saved"
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                        </button>
                        <img src={article.image} alt={article.title} className="card-image" />
                        <div className="card-category">{article.category || 'ARTICLE'}</div>
                        <h3 className="card-title">{article.title}</h3>
                        <p className="card-excerpt">{article.excerpt}</p>
                        <div className="card-meta">
                          <span>{article.author}</span>
                          <span>Saved {getTimeSince(article.savedAt)}</span>
                        </div>
                        <Link to={article.url || '#'} className="read-more">Read Article →</Link>
                      </article>
                    ))}
                  </div>
                  <div className="cta-center">
                    <Link to="/space-mysteries" className="btn-primary">
                      Discover More Articles
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Liked Articles Tab */}
          {activeTab === 'liked' && (
            <div className="tab-content">
              <h2 className="section-title">
                <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                Your Liked Articles
              </h2>
              {loadingLiked ? (
                <div className="loading-state">Loading your liked articles...</div>
              ) : errorLiked ? (
                <div className="error-state">{errorLiked}</div>
              ) : likedArticles.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                  <h3>No Liked Articles Yet</h3>
                  <p>Like articles you enjoy to keep track of your favorites!</p>
                  <Link to="/space-mysteries" className="explore-btn">
                    <span className="explore-icon">🧭</span>
                    Explore Articles
                  </Link>
                </div>
              ) : (
                <>
                  <div className="cards-grid">
                    {likedArticles.map(article => (
                      <article key={article.id} className="dashboard-card">
                        <button
                          className="favorite-btn active liked"
                          onClick={() => unlikeArticle(article.id)}
                          title="Remove from liked"
                        >
                          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                        </button>
                        <img src={article.image} alt={article.title} className="card-image" />
                        <div className="card-category">{article.category || 'ARTICLE'}</div>
                        <h3 className="card-title">{article.title}</h3>
                        <p className="card-excerpt">{article.excerpt}</p>
                        <div className="card-meta">
                          <span>
                            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            Liked
                          </span>
                          <span>Liked {getTimeSince(article.likedAt)}</span>
                        </div>
                        <Link to={`/article/${article.id}?type=${article.articleType === 'whatif' ? 'whatif' : 'mystery'}`} className="read-more">Read Article →</Link>
                      </article>
                    ))}
                  </div>
                  <div className="cta-center">
                    <Link to="/space-mysteries" className="btn-primary">
                      Discover More Articles
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
                .dashboard-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 24px;
                }

                .dashboard {
                    padding-top: 100px;
                    padding-bottom: 60px;
                }

                /* Profile Header */
                .profile-header {
                    background: rgba(30, 35, 55, 0.4);
                    backdrop-filter: blur(24px) saturate(120%);
                    -webkit-backdrop-filter: blur(24px) saturate(120%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    padding: 32px;
                    margin-bottom: 32px;
                    display: flex;
                    align-items: center;
                    gap: 24px;
                    flex-wrap: wrap;
                    position: relative;
                }

                .avatar-container {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    overflow: hidden;
                    flex-shrink: 0;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                }

                .avatar-photo {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, var(--color-space-orange), #e04400);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    font-family: var(--font-heading);
                    font-weight: 700;
                    color: var(--color-cosmic-white);
                }

                .profile-info {
                    flex: 1;
                    min-width: 200px;
                }

                .profile-info h1 {
                    font-size: 1.75rem;
                    margin-bottom: 4px;
                    color: var(--color-cosmic-white);
                }

                .profile-info p {
                    color: var(--color-mist-gray);
                    font-size: 0.95rem;
                }

                .join-date {
                    font-family: var(--font-tech);
                    font-size: 0.8rem !important;
                    margin-top: 4px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .calendar-icon {
                    width: 14px;
                    height: 14px;
                    color: var(--color-space-orange);
                }

                .profile-stats {
                    display: flex;
                    gap: 32px;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-family: var(--font-heading);
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--color-space-orange);
                }

                .stat-label {
                    font-family: var(--font-tech);
                    font-size: 0.75rem;
                    color: var(--color-mist-gray);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .logout-container {
                    margin-left: auto;
                }

                .logout-btn {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-family: var(--font-body);
                    font-size: 0.9rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logout-btn svg {
                    width: 18px;
                    height: 18px;
                }

                .logout-btn:hover {
                    background: #ef4444;
                    color: white;
                }

                /* Tab Navigation */
                .tab-navigation {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 32px;
                    flex-wrap: wrap;
                }

                .tab-btn {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    color: var(--color-mist-gray);
                    padding: 12px 24px;
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .tab-btn svg {
                    width: 16px;
                    height: 16px;
                }

                .tab-btn:hover {
                    border-color: var(--color-space-orange);
                    color: var(--color-space-orange);
                }

                .tab-btn.active {
                    background: var(--color-space-orange);
                    border-color: var(--color-space-orange);
                    color: var(--color-cosmic-white);
                }

                /* Section Title */
                .section-title {
                    font-size: 1.5rem;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: var(--color-cosmic-white);
                }

                .section-title svg {
                    width: 24px;
                    height: 24px;
                    color: var(--color-space-orange);
                }

                /* Cards Grid */
                .cards-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                }

                @media (max-width: 1200px) {
                    .cards-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 900px) {
                    .cards-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .cards-grid { grid-template-columns: 1fr; }
                }

                /* Dashboard Card */
                .dashboard-card {
                    background: rgba(30, 35, 55, 0.4);
                    backdrop-filter: blur(24px) saturate(120%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 32px;
                    padding: 16px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.3s ease;
                }

                .dashboard-card:hover {
                    background: rgba(40, 45, 70, 0.5);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-8px);
                }

                .card-image {
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    border-radius: 24px;
                    margin-bottom: 20px;
                }

                .card-tag {
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .card-tag svg {
                    width: 14px;
                    height: 14px;
                }

                .card-tag.pending { color: #fbbf24; }
                .card-tag.published, .card-tag.approved { color: #22c55e; }
                .card-tag.rejected { color: #ef4444; }

                .rejection-reason {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 16px;
                    font-size: 0.85rem;
                    color: #fca5a5;
                }

                .rejection-reason strong {
                    color: #ef4444;
                }

                .loading-state, .error-state {
                    text-align: center;
                    padding: 40px;
                    color: var(--color-mist-gray);
                }

                .error-state {
                    color: #ef4444;
                }

                .card-category {
                    font-family: var(--font-heading);
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--color-mist-gray);
                    margin-bottom: 8px;
                    font-weight: 700;
                    opacity: 0.8;
                }

                .card-title {
                    font-size: 1.35rem;
                    margin-bottom: 12px;
                    color: var(--color-cosmic-white);
                    line-height: 1.3;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .card-excerpt {
                    font-size: 0.95rem;
                    margin-bottom: 24px;
                    line-height: 1.6;
                    color: var(--color-mist-gray);
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    flex-grow: 1;
                }

                .card-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                    font-family: var(--font-tech);
                    font-size: 0.8rem;
                    color: var(--color-mist-gray);
                    margin-bottom: 12px;
                }

                .card-meta span {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .card-meta svg {
                    width: 14px;
                    height: 14px;
                }

                .read-more {
                    color: var(--color-space-orange);
                    font-family: var(--font-heading);
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                }

                .dashboard-card:hover .read-more {
                    transform: translateX(4px);
                }

                /* Favorite Button */
                .favorite-btn {
                    position: absolute;
                    top: 28px;
                    right: 28px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .favorite-btn svg {
                    width: 18px;
                    height: 18px;
                    color: var(--color-cosmic-white);
                }

                .favorite-btn.active svg,
                .favorite-btn:hover svg {
                    color: #ef4444;
                }

                .favorite-btn.liked svg {
                    color: #ec4899;
                }

                .favorite-btn.liked:hover svg {
                    color: #be185d;
                }

                /* Empty State */
                .empty-state {
                    text-align: center;
                    padding: 80px 24px;
                    background: rgba(30, 35, 55, 0.4);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                }

                .empty-icon {
                    width: 64px;
                    height: 64px;
                    color: var(--color-mist-gray);
                    opacity: 0.5;
                    margin-bottom: 24px;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    margin-bottom: 12px;
                    color: var(--color-cosmic-white);
                }

                .empty-state p {
                    color: var(--color-mist-gray);
                    margin-bottom: 24px;
                }

                .explore-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 18px 36px;
                    background: var(--color-space-orange);
                    color: white;
                    font-size: 1.05rem;
                    font-weight: 600;
                    border-radius: 14px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(252, 76, 0, 0.3);
                }

                .explore-btn:hover {
                    background: #e04400;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(252, 76, 0, 0.5);
                }

                .explore-icon {
                    font-size: 1.3rem;
                }

                /* CTA Center */
                .cta-center {
                    text-align: center;
                    margin-top: 40px;
                }

                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--color-space-orange);
                    color: var(--color-cosmic-white);
                    border: none;
                    padding: 14px 28px;
                    font-family: var(--font-heading);
                    font-size: 0.9rem;
                    font-weight: 600;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .btn-primary svg {
                    width: 18px;
                    height: 18px;
                }

                .btn-primary:hover {
                    background: #e04400;
                    transform: translateY(-3px);
                }

                /* Responsive */
                @media (max-width: 1024px) {
                    .cards-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 100px 16px 60px;
                    }

                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                        padding: 24px;
                    }

                    .profile-avatar {
                        width: 80px;
                        height: 80px;
                        font-size: 2rem;
                    }

                    .profile-stats { 
                        justify-content: center;
                        flex-wrap: wrap;
                    }

                    .profile-info { text-align: center; }
                    .join-date { justify-content: center; }
                    .logout-container { 
                        margin-left: 0;
                        margin-top: 16px;
                    }

                    .tab-navigation {
                        justify-content: center;
                    }

                    .tab-btn {
                        flex: 1;
                        min-width: 140px;
                        justify-content: center;
                    }

                    .cards-grid {
                        grid-template-columns: 1fr;
                        gap: 16px;
                    }

                    .section-title {
                        font-size: 1.25rem;
                        justify-content: center;
                    }
                }

                @media (max-width: 480px) {
                    .profile-header {
                        padding: 20px 16px;
                    }

                    .stat-value {
                        font-size: 1.25rem;
                    }

                    .logout-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .tab-btn {
                        padding: 10px 16px;
                        font-size: 0.85rem;
                    }
                }
            `}</style>
    </>
  )
}
