import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SubmitTheoryPage() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [formData, setFormData] = useState({
        title: '',
        domain: 'Aerospace Futures',
        summary: '',
        why: '',
        creator: '',
        adapt: true
    })
    const [imagePreview, setImagePreview] = useState(null)
    const [fileName, setFileName] = useState('')
    const [fileSize, setFileSize] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!user) {
        return (
            <section className="submit-page">
                <div className="glow-bg"></div>
                <div className="submit-container">
                    <div className="form-card login-prompt">
                        <h2>Login Required</h2>
                        <p>You need to be logged in to submit a theory.</p>
                        <button onClick={() => navigate('/login')} className="btn-submit">
                            Login to Continue
                        </button>
                    </div>
                </div>
                <style>{getStyles()}</style>
            </section>
        )
    }

    const handleFileSelect = (files) => {
        const file = files[0]
        if (!file) return

        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            alert('Only PNG or JPG images are allowed')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Maximum file size is 5MB')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            setImagePreview(e.target.result)
            setFileName(file.name)
            setFileSize(Math.round(file.size / 1024) + ' KB')
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
        setFileName('')
        setFileSize('')
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files && files.length) handleFileSelect(files)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim() || !formData.summary.trim()) {
            alert('Please provide a title and describe your scenario.')
            return
        }
        if (formData.summary.length < 50) {
            alert('Your scenario description should be at least 50 characters.')
            return
        }

        setIsSubmitting(true)

        try {
            // Create FormData for multipart/form-data submission
            const submitData = new FormData()
            submitData.append('title', formData.title)
            submitData.append('category', formData.domain)
            submitData.append('description', formData.summary)
            submitData.append('authorName', user?.displayName || 'Anonymous')
            submitData.append('authorEmail', user?.email || '')
            submitData.append('firebaseUid', user?.uid || '')

            // Add image if selected
            if (fileInputRef.current?.files?.[0]) {
                submitData.append('image', fileInputRef.current.files[0])
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
            const response = await fetch(`${API_URL}/api/whatif`, {
                method: 'POST',
                body: submitData
            })

            const result = await response.json()

            if (response.ok && result.success) {
                alert('🚀 Your theory has been submitted successfully! It will be visible after admin approval.')
                navigate('/what-if')
            } else {
                throw new Error(result.error || 'Submission failed')
            }
        } catch (error) {
            console.error('Submission error:', error)
            alert(`Error submitting theory: ${error.message}. Please try again.`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="submit-page">
            <div className="glow-bg"></div>

            <div className="submit-container">
                {/* Page Header */}
                <div className="page-header">
                    <img src="/logo.png" alt="Vyomarr" className="logo" onError={(e) => e.target.style.display = 'none'} />
                    <h1>Launch a <span className="accent">What-If</span> Scenario</h1>
                    <p>Where imagination meets science — share a bold hypothetical and spark new perspectives across the cosmos.</p>
                </div>

                {/* Form Card */}
                <div className="form-card">
                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title">Concept Title <span className="required">*</span></label>
                            <input
                                id="title"
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="What if dark matter could be engineered into propulsion?"
                            />
                        </div>

                        {/* Domain */}
                        <div className="form-group">
                            <label htmlFor="domain">Science Domain</label>
                            <select
                                id="domain"
                                value={formData.domain}
                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                            >
                                <option>Aerospace Futures</option>
                                <option>Space-Time & Cosmology</option>
                                <option>Quantum Possibilities</option>
                                <option>Advanced Propulsion Concepts</option>
                                <option>Astrobiology & Alien Life</option>
                                <option>Frontier Physics</option>
                                <option>Cross-Domain Exploration</option>
                                <option>Other</option>
                            </select>
                        </div>

                        {/* Summary */}
                        <div className="form-group">
                            <label htmlFor="summary">Your Hypothetical Scenario <span className="required">*</span></label>
                            <textarea
                                id="summary"
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                placeholder="Describe the idea, the inspiration, and the imagined consequences. Make clear where science ends and imagination begins."
                            />
                            <p className="form-hint">Tip: Use 3–6 paragraphs or a step list. Mark assumptions clearly.</p>
                        </div>

                        {/* Two Column Row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="why">Why This Idea Matters</label>
                                <input
                                    id="why"
                                    type="text"
                                    value={formData.why}
                                    onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                                    placeholder="Why should the community rethink this?"
                                />
                                <p className="form-hint">Short justification to help editors and viewers.</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="creator">Creator Notes (Optional)</label>
                                <input
                                    id="creator"
                                    type="text"
                                    value={formData.creator}
                                    onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                                    placeholder="Inspiration, assumptions, or questions"
                                />
                                <p className="form-hint">Things you want responders to consider.</p>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="form-group">
                            <label>Add Visual Concept (Optional)</label>
                            {!imagePreview ? (
                                <div
                                    className="drop-zone"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                >
                                    <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <strong>Drop an image here</strong>
                                    <small>or click to browse — PNG / JPG up to 5MB</small>
                                </div>
                            ) : (
                                <div className="preview-area">
                                    <div className="preview-thumb" style={{ backgroundImage: `url(${imagePreview})` }}></div>
                                    <div className="preview-info">
                                        <div className="file-name">{fileName}</div>
                                        <div className="file-size">{fileSize}</div>
                                    </div>
                                    <button type="button" className="btn-remove" onClick={handleRemoveImage}>Remove</button>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg"
                                style={{ display: 'none' }}
                                onChange={(e) => handleFileSelect(e.target.files)}
                            />
                        </div>

                        {/* Checkbox */}
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="adapt"
                                checked={formData.adapt}
                                onChange={(e) => setFormData({ ...formData, adapt: e.target.checked })}
                            />
                            <div>
                                <label htmlFor="adapt">Allow Vyomarr to adapt this into video content (credit given)</label>
                                <p className="hint">You can opt out at any time by contacting us.</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            <svg className="rocket-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                            </svg>
                            {isSubmitting ? 'Launching...' : 'Launch This Idea Into The Universe'}
                        </button>

                        {/* Disclaimer */}
                        <p className="disclaimer">
                            Your submission will receive a quick review for clarity and safety. Vyomarr reserves editorial
                            selection for video adaptations. By submitting you confirm the content is original or properly
                            credited.
                        </p>
                    </form>
                </div>
            </div>

            <style>{getStyles()}</style>
        </section>
    )
}

function getStyles() {
    return `
        .submit-page {
            min-height: 100vh;
            position: relative;
        }

        .glow-bg {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            background: radial-gradient(ellipse at 50% 50%, rgba(0, 50, 120, 0.15) 0%, rgba(0, 11, 73, 0) 50%);
            animation: pulseGlow 8s ease-in-out infinite;
        }

        @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
        }

        .submit-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 120px 40px 80px;
        }

        /* Page Header */
        .page-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .page-header .logo {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
        }

        .page-header h1 {
            font-family: var(--font-heading);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--color-cosmic-white);
        }

        .page-header .accent {
            color: var(--color-space-orange);
        }

        .page-header p {
            color: var(--color-mist-gray);
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
        }

        /* Form Card */
        .form-card {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 24px;
            padding: 40px;
            position: relative;
            overflow: hidden;
        }

        .form-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 24px;
            padding: 1px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
            z-index: 0;
        }

        .form-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
            border-radius: 24px;
            z-index: 0;
        }

        .form-card > form > * {
            position: relative;
            z-index: 1;
        }

        /* Form Groups */
        .form-group {
            margin-bottom: 24px;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        label {
            display: block;
            font-family: var(--font-heading);
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--color-cosmic-white);
            margin-bottom: 8px;
        }

        .required {
            color: var(--color-space-orange);
        }

        input[type="text"],
        select,
        textarea {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 14px 16px;
            color: var(--color-cosmic-white);
            font-family: var(--font-body);
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--color-space-orange);
            background: rgba(255, 255, 255, 0.08);
        }

        input::placeholder, textarea::placeholder {
            color: var(--color-mist-gray);
            opacity: 0.6;
        }

        select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23bfc3c6' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 20px;
        }

        select option {
            background: var(--color-deep-space);
            color: var(--color-cosmic-white);
        }

        textarea {
            min-height: 160px;
            resize: vertical;
        }

        .form-hint {
            font-family: var(--font-tech);
            font-size: 0.8rem;
            color: var(--color-mist-gray);
            margin-top: 6px;
            font-style: italic;
        }

        /* Drop Zone */
        .drop-zone {
            border: 2px dashed rgba(252, 76, 0, 0.3);
            border-radius: 16px;
            padding: 32px;
            text-align: center;
            background: linear-gradient(180deg, rgba(252, 76, 0, 0.02), transparent);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .drop-zone:hover {
            border-color: var(--color-space-orange);
            background: rgba(252, 76, 0, 0.05);
        }

        .drop-zone .upload-icon {
            width: 48px;
            height: 48px;
            color: var(--color-space-orange);
            margin-bottom: 12px;
        }

        .drop-zone strong {
            display: block;
            font-family: var(--font-heading);
            font-size: 1rem;
            margin-bottom: 8px;
            color: var(--color-cosmic-white);
        }

        .drop-zone small {
            color: var(--color-mist-gray);
            font-size: 0.85rem;
        }

        /* Preview Area */
        .preview-area {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
        }

        .preview-thumb {
            width: 80px;
            height: 60px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            background-size: cover;
            background-position: center;
        }

        .preview-info {
            flex: 1;
        }

        .preview-info .file-name {
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--color-cosmic-white);
        }

        .preview-info .file-size {
            font-family: var(--font-tech);
            font-size: 0.8rem;
            color: var(--color-mist-gray);
        }

        .btn-remove {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--color-mist-gray);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-remove:hover {
            border-color: #ef4444;
            color: #ef4444;
        }

        /* Checkbox */
        .checkbox-group {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 12px;
            margin-bottom: 24px;
        }

        .checkbox-group input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: var(--color-space-orange);
            margin-top: 2px;
        }

        .checkbox-group label {
            margin-bottom: 0;
            cursor: pointer;
        }

        .checkbox-group .hint {
            font-size: 0.8rem;
            color: var(--color-mist-gray);
            margin-top: 4px;
        }

        /* Submit Button */
        .btn-submit {
            width: 100%;
            background: linear-gradient(90deg, var(--color-space-orange), #ff6a2b);
            border: none;
            color: var(--color-deep-space);
            font-family: var(--font-heading);
            font-size: 1rem;
            font-weight: 700;
            padding: 16px 32px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            animation: pulseGlowBtn 3s ease-in-out infinite;
            position: relative;
            overflow: hidden;
        }

        @keyframes pulseGlowBtn {
            0%, 100% { box-shadow: 0 4px 15px rgba(252, 76, 0, 0.3); }
            50% { box-shadow: 0 4px 30px rgba(252, 76, 0, 0.6); }
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 35px rgba(252, 76, 0, 0.5);
            animation: none;
        }

        .btn-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        .rocket-icon {
            width: 24px;
            height: 24px;
        }

        /* Disclaimer */
        .disclaimer {
            text-align: center;
            font-size: 0.85rem;
            color: var(--color-mist-gray);
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Login Prompt */
        .login-prompt {
            max-width: 400px;
            margin: 0 auto;
            padding: 48px;
            text-align: center;
        }

        .login-prompt h2 {
            font-size: 1.5rem;
            margin-bottom: 12px;
            color: var(--color-cosmic-white);
        }

        .login-prompt p {
            color: var(--color-mist-gray);
            margin-bottom: 24px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .submit-container {
                padding: 100px 20px 60px;
            }

            .form-card {
                padding: 24px;
            }

            .form-row {
                grid-template-columns: 1fr;
            }

            .page-header h1 {
                font-size: 1.8rem;
            }
        }
    `
}
