import React, { useEffect, useRef, useState } from "react";
import { 
  Menu, X, Upload, AlertCircle, MessageSquare, Users, 
  HelpCircle, LayoutDashboard, FileText, Type, Youtube,
  CheckCircle2, LogOut, ThumbsUp, ThumbsDown, Trash2
} from 'lucide-react';

/* Inject minimal CSS */
const _injectStyles = () => {
  if (document.getElementById('vyomarr-components-styles')) return;
  const css = `
    .vy-container { display: flex; min-height: 100vh; background: #fff; }
    .vy-sidebar { width:250px; background:#f5f5f5; border-right:1px solid #e0e0e0; display:flex; flex-direction:column; height: 100vh; position: sticky; top: 0; flex-shrink: 0; }
    .vy-sidebar-header { padding:20px 16px; border-bottom:1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
    .vy-sidebar-title { margin:0; font-size:20px; font-weight:700; color:#111; }
    .vy-sidebar-nav { padding:16px 0; display:flex; flex-direction:column; gap:0; }
    .vy-sidebar-link { padding:12px 16px; border:none; text-align:left; cursor:pointer; color:#666; background:none; font-size:14px; transition:background .15s; border-left:3px solid transparent; display: flex; align-items: center; gap: 10px; }
    .vy-sidebar-link:hover { background:#e8e8e8; color:#111; }
    .vy-sidebar-link.active { background:#e0e0e0; color:#111; border-left-color:#111; font-weight:600; }
    .vy-blog-wrap { flex:1; min-height:100vh; padding:24px; background:#fff; color:#111; box-sizing:border-box; overflow-y: auto; }
    .vy-card { background:#fff; border:1px solid #e6e6e6; border-radius:8px; padding:16px; margin-bottom: 16px; }
    .vy-input, .vy-textarea { width:100%; padding:10px; border:1px solid #d0d0d0; border-radius:6px; box-sizing:border-box; font-family: inherit; }
    .vy-textarea { resize: vertical; }
    .vy-upload-zone { border:2px dashed #d1d5db; padding:18px; text-align:center; border-radius:8px; cursor:pointer; transition: border-color 0.2s, background 0.2s; }
    .vy-upload-zone:hover { border-color: #9ca3af; background: #f9fafb; }
    .vy-grid { display:grid; gap:8px; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); margin-top:12px; }
    .vy-img-preview { position:relative; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb; }
    .vy-img-preview img { width:100%; height:80px; object-fit:cover; display:block; }
    .vy-btn { padding:8px 14px; background:#111; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight: 500; transition: opacity 0.2s; }
    .vy-btn:hover { opacity: 0.9; }
    .vy-btn-approve { background: #10b981; }
    .vy-btn-approve:hover { opacity: 0.9; }
    .vy-btn-reject { background: #ef4444; }
    .vy-btn-reject:hover { opacity: 0.9; }
    .vy-logout-btn { padding:8px 16px; background:#dc2626; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:500; display:flex; align-items:center; gap:6px; font-size:14px; transition: background 0.2s; }
    .vy-logout-btn:hover { background: #b91c1c; }
    .vy-submission-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .vy-submission-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
    .vy-submission-title { margin: 0; font-size: 16px; font-weight: 600; color: #111; }
    .vy-submission-meta { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .vy-submission-content { margin: 12px 0; color: #374151; line-height: 1.6; }
    .vy-submission-actions { display: flex; gap: 8px; margin-top: 12px; }
    .vy-submission-status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .vy-status-pending { background: #fef3c7; color: #92400e; }
    .vy-status-approved { background: #d1fae5; color: #065f46; }
    .vy-status-rejected { background: #fee2e2; color: #991b1b; }
    .vy-modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; align-items: center; justify-content: center; }
    .vy-modal-overlay.open { display: flex; }
    .vy-modal { background: #fff; border-radius: 8px; padding: 24px; max-width: 500px; width: 90%; box-shadow: 0 20px 25px rgba(0,0,0,0.1); }
    .vy-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; cursor: pointer; }
    @media (max-width:768px){ 
      .vy-sidebar { position:fixed; left:0; top:0; height:100vh; transform:translateX(-100%); transition:transform .2s; z-index:50; width: 80%; max-width: 300px; }
      .vy-sidebar.open { transform:translateX(0); } 
    }
  `;
  const style = document.createElement('style');
  style.id = 'vyomarr-components-styles';
  style.innerHTML = css;
  document.head.appendChild(style);
};

const MENU_ITEMS = [
  { id: 1, label: 'Space & Mysteries', icon: <CheckCircle2 size={18} /> },
  { id: 2, label: 'What If?', icon: <HelpCircle size={18} /> },
  { id: 3, label: 'Feedback & Issues', icon: <MessageSquare size={18} /> },
  { id: 4, label: 'Comments', icon: <Users size={18} /> },
  { id: 5, label: 'Subscribed Users', icon: <Users size={18} /> },
];

export function Sidebar({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) {
  useEffect(() => { _injectStyles(); }, []);

  return (
    <div className={`vy-sidebar ${sidebarOpen ? 'open' : ''}`} role="navigation">
      <div className="vy-sidebar-header">
        <h2 className="vy-sidebar-title">Vyomarr</h2>
        <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: window.innerWidth <= 768 ? 'block' : 'none' }}>
          <X size={24} />
        </button>
      </div>

      <nav className="vy-sidebar-nav">
        {MENU_ITEMS.map(item => (
          <button
            key={item.id}
            className={`vy-sidebar-link ${activeSection === item.label ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(item.label);
              if (window.innerWidth <= 768) setSidebarOpen(false);
            }}
            type="button"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

/* What If Submissions Component */
export function WhatIfSection() {
  const [submissions, setSubmissions] = useState([
    { id: 1, author: 'John Doe', theory: 'What if gravity worked in reverse?', email: 'john@example.com', status: 'pending', date: '2024-01-15', rejectionReason: '' },
    { id: 2, author: 'Jane Smith', theory: 'What if time could be manipulated?', email: 'jane@example.com', status: 'pending', date: '2024-01-14', rejectionReason: '' },
  ]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (id) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const handleReject = (id) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'rejected', rejectionReason } : s
    ));
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedSubmission(null);
  };

  const openRejectModal = (submission) => {
    setSelectedSubmission(submission);
    setShowRejectModal(true);
    setRejectionReason('');
  };

  return (
    <div className="vy-blog-wrap">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <HelpCircle size={24} />
            <h1 style={{ margin: 0, fontSize: 24 }}>What If? Submissions</h1>
          </div>
          <p style={{ margin: '6px 0 0', color: '#666' }}>Review and approve user-submitted theories</p>
        </header>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <button style={{ padding: '8px 16px', background: '#111', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>
            All ({submissions.length})
          </button>
          <button style={{ padding: '8px 16px', background: '#f3f4f6', color: '#111', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Pending ({submissions.filter(s => s.status === 'pending').length})
          </button>
          <button style={{ padding: '8px 16px', background: '#f3f4f6', color: '#111', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Approved ({submissions.filter(s => s.status === 'approved').length})
          </button>
          <button style={{ padding: '8px 16px', background: '#f3f4f6', color: '#111', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
            Rejected ({submissions.filter(s => s.status === 'rejected').length})
          </button>
        </div>

        {/* Submissions List */}
        {submissions.map(submission => (
          <div key={submission.id} className="vy-submission-card">
            <div className="vy-submission-header">
              <div>
                <h3 className="vy-submission-title">{submission.theory}</h3>
                <div className="vy-submission-meta">
                  By <strong>{submission.author}</strong> ({submission.email}) • {submission.date}
                </div>
                <span className={`vy-submission-status vy-status-${submission.status}`}>
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </span>
              </div>
            </div>

            {submission.status === 'rejected' && submission.rejectionReason && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, padding: 12, margin: '12px 0', color: '#991b1b' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>Rejection Reason:</p>
                <p style={{ margin: '4px 0 0', fontSize: 13 }}>{submission.rejectionReason}</p>
              </div>
            )}

            {submission.status === 'pending' && (
              <div className="vy-submission-actions">
                <button 
                  className="vy-btn vy-btn-approve"
                  onClick={() => handleApprove(submission.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <ThumbsUp size={16} /> Approve
                </button>
                <button 
                  className="vy-btn vy-btn-reject"
                  onClick={() => openRejectModal(submission)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <ThumbsDown size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Reject Modal */}
        <div className={`vy-modal-overlay ${showRejectModal ? 'open' : ''}`} onClick={() => setShowRejectModal(false)}>
          <div className="vy-modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 12px', fontSize: 18 }}>Reject Submission</h2>
            <p style={{ margin: '0 0 16px', color: '#666', fontSize: 14 }}>
              <strong>{selectedSubmission?.theory}</strong>
            </p>
            
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Rejection Reason</label>
            <textarea 
              className="vy-textarea"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this submission is being rejected..."
              rows={4}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button 
                className="vy-btn" 
                style={{ background: '#6b7280' }}
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="vy-btn vy-btn-reject"
                onClick={() => handleReject(selectedSubmission?.id)}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Blog Dashboard for other sections */
export function BlogDashboard({ category, onLogout }) {
  useEffect(() => { _injectStyles(); }, []);
  const [formData, setFormData] = useState({ title: '', subHeading: '', content: '', youtubeEmbed: '' });
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const MAX_IMAGES = 4;
  const MAX_SIZE_MB = 1;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const processFiles = (newFiles) => {
    let currentImages = [...images];
    let newErrors = {};
    if (currentImages.length + newFiles.length > MAX_IMAGES) {
      newErrors.images = `You can only upload a maximum of ${MAX_IMAGES} images.`;
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }
    newFiles.forEach(file => {
      if (!file.type.startsWith('image/')) {
        newErrors.images = "Only image files are allowed.";
      } else if (file.size > MAX_SIZE_BYTES) {
        newErrors.images = `File "${file.name}" is too large. Max size is ${MAX_SIZE_MB}MB.`;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, { file, preview: reader.result }]);
        reader.readAsDataURL(file);
      }
    });
    if (Object.keys(newErrors).length) setErrors(prev => ({ ...prev, ...newErrors })); 
    else setErrors(prev => ({ ...prev, images: null }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || e.dataTransfer.files || []);
    processFiles(files);
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e); };
  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Blog submit', { ...formData, images });
    alert('Blog post created successfully!');
  };

  return (
    <div className="vy-blog-wrap">
      <div style={{ maxWidth: 980, margin: '0 auto' }}>
        <header style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LayoutDashboard size={24} />
              <h1 style={{ margin: 0, fontSize: 24 }}>{category} Dashboard</h1>
            </div>
            <p style={{ margin: '6px 0 0', color: '#666' }}>Admin Panel / <strong>{category}</strong></p>
          </div>
          <button onClick={onLogout} className="vy-logout-btn">
            <LogOut size={16} /> Logout
          </button>
        </header>

        <div className="vy-card">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} className="vy-input" placeholder="Enter title" required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Sub Heading</label>
              <input name="subHeading" value={formData.subHeading} onChange={handleInputChange} className="vy-input" placeholder="Sub heading" />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Content</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} className="vy-textarea" rows={6} placeholder="Write content here..." required />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontWeight: 500 }}>
                <span>Images ({images.length}/{MAX_IMAGES})</span>
                <small style={{ color: '#888' }}>Max {MAX_SIZE_MB}MB / file</small>
              </label>

              <div className="vy-upload-zone" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Upload size={24} color="#9ca3af" />
                  <span style={{ color: '#6b7280' }}>Click to upload or drag & drop images</span>
                </div>
              </div>

              {errors.images && <div style={{ color: '#ef4444', marginTop: 8, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={14}/> {errors.images}</div>}

              {images.length > 0 && (
                <div className="vy-grid">
                  {images.map((img, i) => (
                    <div key={i} className="vy-img-preview">
                      <img src={img.preview} alt={`preview-${i}`} />
                      <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', borderRadius: '50%', border: 'none', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
              <button type="submit" className="vy-btn">Publish Blog Post</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Main App */
const App = () => {
  const [activeSection, setActiveSection] = useState('Space & Mysteries');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      alert("Logged out successfully!");
    }
  };

  return (
    <div className="vy-container">
      <button className="vy-mobile-toggle" onClick={() => setSidebarOpen(true)} style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}>
        <Menu size={24} />
      </button>

      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {activeSection === 'What If?' ? (
        <WhatIfSection />
      ) : (
        <BlogDashboard category={activeSection} onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;