import { useState } from 'react';
import { 
  Home, Search, Bell, Mail, User, ShieldCheck, 
  MoreHorizontal, MessageSquare, Repeat2, Heart, 
  Share, Image, Smile, Mic, AlertCircle, Link2, 
  Activity, CheckCircle2, Hexagon, Database, ChevronRight
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
  if (score >= 5) return 'Mixed Context Context';
  return 'False or Misleading';
};

const verifyClaim = async (text) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const length = text.length;
      let score = 5;
      let sources = [];
      let summary = "";

      if (text.toLowerCase().includes("water")) {
        score = 9;
        summary = "This claim aligns tightly with established scientific and medical consensus.";
        sources = [
          "National Science Foundation (NSF.gov)",
          "Journal of Clinical Hydrology"
        ];
      } else if (text.toLowerCase().includes("alien")) {
        score = 2;
        summary = "No credible evidence exists to support this claim in global fact-checking archives.";
        sources = [
          "NASA official debunking records",
          "Reuters Fact Action Network"
        ];
      } else {
        score = Math.floor(Math.random() * 10) + 1;
        if (score >= 8) {
          summary = "Information corroborated across multiple reputable media outlets.";
          sources = ["Associated Press", "BBC News Network", "NPR Fact Check"];
        } else if (score >= 5) {
          summary = "The premise has factual elements but lacks entirely accurate context.";
          sources = ["Snopes Core Check", "Wikipedia Extended Logs"];
        } else {
          summary = "This claim matches known patterns of disinformation currently circulating.";
          sources = ["FactCheck.org", "PolitiFact"];
        }
      }

      resolve({ score, summary, sources });
    }, 1800); 
  });
};

const VerifyWidget = ({ text }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    const res = await verifyClaim(text);
    setResult(res);
    setIsVerifying(false);
  };

  if (!result && !isVerifying) {
    return (
      <div className="verify-module glass-box">
        <button className="btn-verify-formal" onClick={handleVerify}>
          <ShieldCheck size={22} strokeWidth={2.5} />
          <span>Verify Claim Authenticity</span>
        </button>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="verify-module glass-box loader-box">
        <div className="spinner-formal"></div>
        <div className="loader-text">Analyzing references across verified databases...</div>
      </div>
    );
  }

  const scoreClass = getTrustColorClass(result.score);

  return (
    <div className={`verify-module glass-box analysis-result ${scoreClass}`}>
      <div className="analysis-header">
        <ShieldCheck size={20} />
        <span>Verification Complete</span>
      </div>
      
      <div className="score-dashboard">
        <div className="score-ring">
          {result.score}
        </div>
        <div>
          <div className="score-title">{getTrustLabel(result.score)}</div>
          <div className="score-desc">{result.summary}</div>
        </div>
      </div>

      <div className="data-sources">
        <div className="src-title">
          <Database size={16} /> References Reviewed ({result.sources.length})
        </div>
        {result.sources.map((src, i) => (
          <div key={i} className="src-item">
            <Link2 size={16} color="var(--primary-color)" />
            <span>{src}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PostItem = ({ post }) => {
  return (
    <div className="post-card">
      <div className="post-meta">
        <img src={post.avatar} alt={post.author} />
        <div className="author-info">
          <span className="author-name">{post.author}</span>
          <span className="author-handle">{post.handle} · {post.time}</span>
        </div>
        <MoreHorizontal size={20} color="var(--text-secondary)" style={{ marginLeft: 'auto' }} />
      </div>

      <div className="post-content">{post.content}</div>
      
      <VerifyWidget text={post.content} />

      <div className="engagement-actions">
        <button className="action-btn-sm"><MessageSquare size={20} /> {post.replies}</button>
        <button className="action-btn-sm"><Repeat2 size={20} /> {post.retweets}</button>
        <button className="action-btn-sm"><Heart size={20} /> {post.likes}</button>
        <button className="action-btn-sm"><Share size={20} /></button>
      </div>
    </div>
  );
};


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
    <div className="app-container">
      {/* Formal Left Sidebar, completely filling margin */}
      <aside className="global-sidebar">
        <a href="#" className="brand">
          <Activity size={32} strokeWidth={2.5} className="brand-logo" />
          <span>VerifiX</span>
        </a>

        <nav className="nav-menu">
          <a href="#" className="nav-item active"><Home size={28} /> <span>Home</span></a>
          <a href="#" className="nav-item"><Search size={28} /> <span>Explore</span></a>
          <a href="#" className="nav-item"><Bell size={28} /> <span>Notifications</span></a>
          <a href="#" className="nav-item"><Mail size={28} /> <span>Messages</span></a>
          <a href="#" className="nav-item"><User size={28} /> <span>Profile</span></a>
        </nav>

        <button className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Post</button>
        
        <div className="user-profile">
          <img src={currentUser.avatar} alt="User" />
          <div className="user-info">
            <div className="u-name">{currentUser.name}</div>
            <div className="u-handle">{currentUser.handle}</div>
          </div>
          <MoreHorizontal size={20} style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }} />
        </div>
      </aside>

      {/* Main Feed Centered Area */}
      <main className="main-feed">
        <header className="feed-header">
          <h2>Home Feed</h2>
        </header>

        <div className="composer-formal">
          <img src={currentUser.avatar} alt="Current" className="composer-avatar" />
          <div className="composer-body">
            <textarea 
              className="composer-textarea" 
              placeholder="What is happening?!" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="composer-toolbar">
              <div className="media-actions">
                <button className="icon-btn"><Image size={22} /></button>
                <button className="icon-btn"><Smile size={22} /></button>
                <button className="icon-btn"><AlertCircle size={22} /></button>
              </div>
              <button 
                className="btn-primary sm-btn" 
                onClick={submitPost}
                disabled={!input.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="post-list">
          {posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </main>

      {/* Right Content Panel taking exactly its side */}
      <aside className="global-right-panel">
        <div className="search-bar">
          <Search size={20} color="var(--text-secondary)" />
          <input type="text" placeholder="Search VerifiX" />
        </div>

        <div className="info-card">
          <h3 className="card-title">Trending Topics</h3>
          <div className="trend-row">
            <div className="t-meta">Technology · Trending</div>
            <div className="t-head">#NeuralNetworks</div>
            <div className="t-foot">120K Verification Nodes</div>
          </div>
          <div className="trend-row">
            <div className="t-meta">Science · Trending</div>
            <div className="t-head">Water Facts</div>
            <div className="t-foot">15.4K Verify Requests</div>
          </div>
          <div className="trend-row">
            <div className="t-meta">News · Trending</div>
            <div className="t-head">Space Exploration</div>
            <div className="t-foot">89.2K Verify Requests</div>
          </div>
        </div>

        <div className="info-card">
          <h3 className="card-title">Verified Publishers</h3>
          <div className="publisher-row">
            <img src="https://i.pravatar.cc/150?u=reuters" alt="Rtrs" />
            <div className="pub-info">
              <div className="pub-name">Reuters News <CheckCircle2 size={16} color="var(--primary-color)" /></div>
              <div className="pub-handle">@Reuters</div>
            </div>
          </div>
          <div className="publisher-row">
            <img src="https://i.pravatar.cc/150?u=ap" alt="AP" />
            <div className="pub-info">
              <div className="pub-name">Associated Press <CheckCircle2 size={16} color="var(--primary-color)" /></div>
              <div className="pub-handle">@AP</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
