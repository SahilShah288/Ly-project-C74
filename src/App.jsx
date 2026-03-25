import { useState, useEffect } from 'react';
import { 
  Home, Search, Bell, ShieldCheck, 
  MoreHorizontal, MessageSquare, Repeat2, Heart, 
  Image, Smile, AlertCircle, Link2, 
  Activity, CheckCircle2, Database, TrendingUp,
  Users, FileText, Send
} from 'lucide-react';
import './index.css';

const currentUser = {
  name: 'John Doe',
  handle: '@johndoe',
  avatar: 'https://i.pravatar.cc/150?u=johndoe'
};

const getTrustColorClass = (score) => {
  if (score >= 8) return 'trust-high';
  if (score >= 5) return 'trust-med';
  return 'trust-low';
};

const getTrustLabel = (score) => {
  if (score >= 8) return 'Highly Trusted';
  if (score >= 5) return 'Mixed Context';
  return 'False or Misleading';
};

const verifyClaim = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let score = 5;
      let sources = [];
      let summary = "";

      if (text.toLowerCase().includes("water")) {
        score = 9;
        summary = "This claim aligns with established scientific and medical consensus.";
        sources = ["National Science Foundation (NSF.gov)", "Journal of Clinical Hydrology"];
      } else if (text.toLowerCase().includes("alien")) {
        score = 2;
        summary = "No credible evidence exists to support this claim.";
        sources = ["NASA official debunking records", "Reuters Fact Action Network"];
      } else {
        score = Math.floor(Math.random() * 10) + 1;
        if (score >= 8) {
          summary = "Corroborated across multiple reputable outlets.";
          sources = ["Associated Press", "BBC News Network", "NPR Fact Check"];
        } else if (score >= 5) {
          summary = "Factual elements present but context is incomplete.";
          sources = ["Snopes Core Check", "Wikipedia Extended Logs"];
        } else {
          summary = "Matches known disinformation patterns.";
          sources = ["FactCheck.org", "PolitiFact"];
        }
      }

      resolve({ score, summary, sources });
    }, 1800);
  });
};

// Subtle inline verification — expands inside the post card
const VerifyWidget = ({ text }) => {
  const [state, setState] = useState('idle'); // idle | loading | done
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    setState('loading');
    const res = await verifyClaim(text);
    setResult(res);
    setState('done');
  };

  // idle: just the trigger button (rendered in post footer)
  if (state === 'idle') return null;

  // loading: spinner inside expanded panel  
  if (state === 'loading') {
    return (
      <div className="verify-panel">
        <div className="verify-loader">
          <div className="spinner-ring"></div>
          <span className="verify-loader-text">Analyzing across verified databases...</span>
        </div>
      </div>
    );
  }

  // done: result panel
  const scoreClass = getTrustColorClass(result.score);
  return (
    <div className={`verify-panel ${scoreClass}`}>
      <div className="verify-result">
        <div className="verify-result-top">
          <div className="trust-score">{result.score}</div>
          <div>
            <div className="trust-label">{getTrustLabel(result.score)}</div>
            <div className="trust-desc">{result.summary}</div>
          </div>
        </div>
        <div className="verify-sources">
          <div className="verify-sources-title">
            <Database size={12} /> References ({result.sources.length})
          </div>
          {result.sources.map((src, i) => (
            <div key={i} className="verify-source-item">
              <Link2 size={12} color="var(--primary)" />
              <span>{src}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PostItem = ({ post }) => {
  const [verifyState, setVerifyState] = useState('idle');
  const [verifyResult, setVerifyResult] = useState(null);
  
  // Micro-interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [sharesCount, setSharesCount] = useState(post.retweets);

  const handleVerify = async () => {
    if (verifyState !== 'idle') return;
    setVerifyState('loading');
    const res = await verifyClaim(post.content);
    setVerifyResult(res);
    setVerifyState('done');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    setIsShared(!isShared);
    setSharesCount(prev => isShared ? prev - 1 : prev + 1);
  };

  const scoreClass = verifyResult ? getTrustColorClass(verifyResult.score) : '';

  return (
    <div className="post-card">
      <div className="post-header">
        <img src={post.avatar} alt={post.author} />
        <div className="post-author-info">
          <span className="post-author-name">{post.author}</span>
          <span className="post-author-meta">{post.handle} · {post.time}</span>
        </div>
        <button className="post-more-btn">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="post-body">{post.content}</div>

      {/* Footer: engagement + subtle verify trigger */}
      <div className="post-footer">
        <div className="post-engagement">
          <button className="engage-btn"><MessageSquare size={15} /> {post.replies}</button>
          <button 
            className={`engage-btn ${isShared ? 'active-share' : ''}`}
            onClick={handleShare}
          >
            <Repeat2 size={15} /> {sharesCount}
          </button>
          <button 
            className={`engage-btn ${isLiked ? 'active-endorse' : ''}`}
            onClick={handleLike}
          >
            <Heart size={15} fill={isLiked ? "currentColor" : "none"} /> {likesCount}
          </button>
        </div>
        <button 
          className="verify-trigger" 
          onClick={handleVerify}
          style={verifyState !== 'idle' ? { color: 'var(--accent-teal)', background: 'var(--accent-teal-soft)' } : {}}
        >
          <ShieldCheck size={14} />
          {verifyState === 'idle' ? 'Verify' : verifyState === 'loading' ? 'Checking...' : 'Verified'}
        </button>
      </div>

      {/* Expandable verification panel */}
      {verifyState === 'loading' && (
        <div className="verify-panel">
          <div className="verify-loader">
            <div className="spinner-ring"></div>
            <span className="verify-loader-text">Analyzing across verified databases...</span>
          </div>
        </div>
      )}

      {verifyState === 'done' && verifyResult && (
        <div className={`verify-panel ${scoreClass}`}>
          <div className="verify-result">
            <div className="verify-result-top">
              <div className="trust-score">{verifyResult.score}</div>
              <div>
                <div className="trust-label">{getTrustLabel(verifyResult.score)}</div>
                <div className="trust-desc">{verifyResult.summary}</div>
              </div>
            </div>
            <div className="verify-sources">
              <div className="verify-sources-title">
                <Database size={12} /> References ({verifyResult.sources.length})
              </div>
              {verifyResult.sources.map((src, i) => (
                <div key={i} className="verify-source-item">
                  <Link2 size={12} color="var(--primary)" />
                  <span>{src}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Skeleton Loader Component
const SkeletonPost = () => (
  <div className="post-card">
    <div className="post-header">
      <div className="skeleton-box skeleton-avatar"></div>
      <div className="post-author-info" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div className="skeleton-box skeleton-text short"></div>
        <div className="skeleton-box skeleton-text medium" style={{ height: '8px' }}></div>
      </div>
    </div>
    <div style={{ padding: '8px 0' }}>
      <div className="skeleton-box skeleton-text"></div>
      <div className="skeleton-box skeleton-text"></div>
      <div className="skeleton-box skeleton-text medium"></div>
    </div>
    <div className="post-footer">
      <div className="skeleton-box skeleton-text" style={{ width: '120px', margin: 0 }}></div>
      <div className="skeleton-box skeleton-text" style={{ width: '60px', margin: 0 }}></div>
    </div>
  </div>
);

function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Tech Insider',
      handle: '@techinsider',
      avatar: 'https://i.pravatar.cc/150?u=tech',
      content: 'New study shows that drinking 8 glasses of water a day significantly improves cognitive function and memory retention.',
      time: '2h',
      replies: 12, retweets: 48, likes: 156
    },
    {
      id: 2,
      author: 'Conspiracy Bot',
      handle: '@truthseeker99',
      avatar: 'https://i.pravatar.cc/150?u=bot',
      content: 'Just saw a leaked document proving that alien spaceships have been hidden under the Denver airport since 1995!',
      time: '4h',
      replies: 405, retweets: 1200, likes: 3400
    },
    {
      id: 3,
      author: 'Sarah Smith',
      handle: '@sarahcodes',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      content: 'The new AI models can write perfect code 100% of the time without any human intervention. Developers will be obsolete by next year.',
      time: '6h',
      replies: 89, retweets: 230, likes: 800
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic header blur effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate initial network latency for skeleton dopamine effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const submitPost = () => {
    if (!input.trim()) return;
    const newPost = {
      id: Date.now(),
      author: currentUser.name,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      content: input,
      time: 'Now',
      replies: 0, retweets: 0, likes: 0
    };
    setPosts([newPost, ...posts]);
    setInput('');
  };

  return (
    <div className="app-shell instagram-layout">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <a href="#" className="sidebar-brand">
          <Activity size={24} strokeWidth={2.5} />
          <span>VerifiX</span>
        </a>

        {/* User Profile Area */}
        <div className="sidebar-profile">
          <img src={currentUser.avatar} alt="User" className="profile-avatar-lg" />
          <h2 className="profile-name">{currentUser.name}</h2>
          <span className="profile-handle">{currentUser.handle}</span>
          
          <div className="profile-stats">
            <div className="stat"><strong>472</strong><span>Claims</span></div>
            <div className="stat"><strong>12.4K</strong><span>Trusted</span></div>
            <div className="stat"><strong>228</strong><span>Following</span></div>
          </div>
          
          <div className="profile-bio">
            Independent Fact Checker | Top Contributor | Verified Expert
          </div>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          <a href="#" className="nav-link active"><Home size={18} /> Feed</a>
          <a href="#" className="nav-link"><Search size={18} /> Explore</a>
          <a href="#" className="nav-link"><ShieldCheck size={18} /> Investigations</a>
          <a href="#" className="nav-link"><Bell size={18} /> Alerts</a>
          <a href="#" className="nav-link"><TrendingUp size={18} /> Trending</a>
        </div>

        <button className="nav-link logout-btn"><AlertCircle size={18} /> Logout</button>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-search">
            <Search size={16} />
            <input type="text" placeholder="Search claims, topics, or publishers..." />
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Bell size={18} /></button>
            <button className="icon-btn"><MessageSquare size={18} /></button>
            <button className="btn-submit" onClick={submitPost} disabled={!input.trim()}>
              <Send size={15} /> Submit Claim
            </button>
          </div>
        </header>

        {/* Stories / Active Investigations */}
        <div className="stories-section">
          <h3 className="section-title">Active Investigations</h3>
          <div className="stories-row">
            <div className="story-item">
              <div className="story-ring active"><img src={currentUser.avatar} alt="You" /></div>
              <span>Your Case</span>
            </div>
            <div className="story-item">
              <div className="story-ring active"><img src="https://i.pravatar.cc/150?u=tech" alt="Story" /></div>
              <span>Tech Insider</span>
            </div>
            <div className="story-item">
              <div className="story-ring"><img src="https://i.pravatar.cc/150?u=bot" alt="Story" /></div>
              <span>Truth Bot</span>
            </div>
            <div className="story-item">
              <div className="story-ring active"><img src="https://i.pravatar.cc/150?u=sarah" alt="Story" /></div>
              <span>Sarah Smith</span>
            </div>
            <div className="story-item">
              <div className="story-ring"><img src="https://i.pravatar.cc/150?u=reuters" alt="Story" /></div>
              <span>Reuters</span>
            </div>
            <div className="story-item">
              <div className="story-ring"><img src="https://i.pravatar.cc/150?u=ap" alt="Story" /></div>
              <span>Associated Press</span>
            </div>
          </div>
        </div>

        {/* Composer (Grid area) */}
        <div className="claim-composer">
          <div className="composer-input-area">
            <img src={currentUser.avatar} alt="User" className="composer-avatar-sm" />
            <div className="composer-input-wrapper">
              <textarea 
                className="composer-textarea" 
                placeholder="Enter a claim or statement to verify..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="composer-actions">
                <div className="composer-tools">
                  <button className="tool-btn"><Image size={18} /></button>
                  <button className="tool-btn"><Link2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Grid */}
        <div className="feed-section">
          <h3 className="section-title">Feed</h3>
          <div className="post-feed grid-layout">
            {isLoading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : (
              posts.map(post => (
                <PostItem key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
