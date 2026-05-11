import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Briefcase, Sparkles, Target, LayoutDashboard, BarChart2, 
  FileText, SunMoon, ChevronDown, Github, Linkedin, Globe
} from 'lucide-react'
import { cn } from '../lib/cn'
import { ThemeToggle } from '../components/layout/ThemeToggle'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300",
        scrolled 
          ? "bg-[var(--bg-surface)]/80 backdrop-blur-md border-b border-[var(--border)]" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left: Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-[var(--text-primary)]">JobTrackr</span>
        </div>

        {/* Center: Nav links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo('features')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">How it works</button>
          <button onClick={() => scrollTo('faq')} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">FAQ</button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link to="/login" className="hidden md:block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="bg-[var(--accent)] text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-[var(--accent-hover)] transition-colors">
            Get started free
          </Link>
        </div>
      </div>
    </motion.header>
  )
}

function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 overflow-hidden bg-[var(--bg-base)]">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 block dark:hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,102,241,0.08)_0%,transparent_70%)]" />
        
        {/* Dot pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-black dark:text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--bg-base)] to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 bg-[var(--accent-subtle)] border border-[var(--accent-border)] text-[var(--accent)] text-xs font-medium px-4 py-1.5 rounded-full mb-8 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Google's Gemini</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-[var(--text-primary)]"
        >
          Track every application.<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-[var(--accent)] to-[#8b5cf6]">
            Land your dream job.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mt-6 leading-relaxed"
        >
          JobTrackr uses Gemini AI to score your resume against job descriptions, generate personalized cover letters, and help you stay organized throughout your job search.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mt-10"
        >
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white rounded-xl px-8 py-3.5 text-base font-semibold hover:brightness-110 shadow-[0_0_0_rgba(99,102,241,0)] hover:shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all bg-[length:200%_auto]"
            >
              Start tracking for free &rarr;
            </motion.button>
          </Link>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="border border-[var(--border)] rounded-xl px-8 py-3.5 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-medium"
          >
            See how it works &darr;
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <div className="flex -space-x-2">
            {['bg-indigo-500', 'bg-purple-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500'].map((color, i) => (
              <div key={i} className={`w-8 h-8 rounded-full border-2 border-[var(--bg-base)] flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${color}`}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="text-sm text-[var(--text-muted)]">Join 2,400+ job seekers already using JobTrackr</span>
        </motion.div>
      </div>

      {/* Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
        className="relative mt-16 mx-auto max-w-5xl w-full px-4 lg:px-0"
      >
        <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-[0_25px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col h-[500px]">
          {/* Top Bar */}
          <div className="bg-[var(--bg-surface-2)] px-4 py-3 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="bg-[var(--bg-surface-3)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-muted)] mx-auto font-medium">
              app.jobtrackr.io/dashboard
            </div>
            <div className="w-[50px]"></div> {/* Spacer */}
          </div>

          {/* Fake Dashboard Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="hidden sm:flex w-[180px] bg-[var(--bg-subtle)] border-r border-[var(--border)] p-4 flex-col gap-2">
              <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)]">
                <Briefcase className="w-4 h-4 text-[var(--accent)]" />
                <span className="font-bold text-sm">JobTrackr</span>
              </div>
              <div className="bg-[var(--accent-subtle)] text-[var(--accent)] rounded-lg p-2 text-xs font-medium flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </div>
              <div className="text-[var(--text-secondary)] rounded-lg p-2 text-xs font-medium flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> My Jobs
              </div>
              <div className="text-[var(--text-secondary)] rounded-lg p-2 text-xs font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Profile
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-6 bg-[var(--bg-base)] flex flex-col gap-6 overflow-hidden">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Dashboard</h2>
                <div className="bg-[var(--accent)] text-white px-3 py-1.5 rounded-lg text-xs font-medium">Add Job</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Jobs', val: '24', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                  { label: 'Interviews', val: '6', icon: Target, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                  { label: 'Offers', val: '2', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                  { label: 'Rejected', val: '12%', icon: BarChart2, color: 'text-red-500', bg: 'bg-red-500/10' },
                ].map((s, i) => (
                  <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-[var(--text-primary)] leading-none mb-1">{s.val}</div>
                      <div className="text-[10px] text-[var(--text-muted)] font-medium uppercase">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Job List */}
              <div className="space-y-3">
                {[
                  { co: 'Google', role: 'Senior Frontend Engineer', status: 'Applied', sb: 'bg-sky-500/10 text-sky-500 border-sky-500/20', score: 87 },
                  { co: 'Stripe', role: 'Full Stack Developer', status: 'Interviewing', sb: 'bg-amber-500/10 text-amber-500 border-amber-500/20', score: 92 },
                  { co: 'Notion', role: 'React Developer', status: 'Saved', sb: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', score: 74 },
                ].map((j, i) => (
                  <div key={i} className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-3 flex justify-between items-center">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="hidden sm:flex w-8 h-8 bg-[var(--bg-surface-2)] rounded-lg items-center justify-center font-bold text-xs text-[var(--text-secondary)] flex-shrink-0">
                        {j.co[0]}
                      </div>
                      <div className="min-w-0 pr-2">
                        <div className="text-sm font-semibold text-[var(--text-primary)] truncate">{j.role}</div>
                        <div className="text-xs text-[var(--text-muted)]">{j.co}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-1 rounded-md border font-medium hidden sm:inline-block ${j.sb}`}>{j.status}</span>
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                        <Sparkles className="w-3 h-3" /> {j.score}% Match
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-[var(--bg-base)] to-transparent pointer-events-none rounded-b-2xl" />
      </motion.div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      title: "AI-powered match scoring",
      desc: "Paste any job description and Gemini instantly scores how well your resume matches — with specific strengths and gaps highlighted.",
      icon: Target,
      bg: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "Personalized cover letters",
      desc: "Generate tailored cover letters in seconds. Choose your tone — formal, friendly, or assertive — and Gemini writes it to fit both your background and the role.",
      icon: Sparkles,
      bg: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Track every application",
      desc: "Never lose track of where you applied. Organize jobs by status, add notes, set dates, and see your entire job search at a glance.",
      icon: LayoutDashboard,
      bg: "bg-sky-500/10 text-sky-500",
    },
    {
      title: "Insightful dashboard",
      desc: "Visualize your job search with charts showing application trends, status breakdowns, and weekly activity — so you always know where you stand.",
      icon: BarChart2,
      bg: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Central resume hub",
      desc: "Store your resume once. JobTrackr uses it automatically across all AI features — match scoring, cover letters, and tailored suggestions.",
      icon: FileText,
      bg: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Beautiful in any light",
      desc: "A meticulously designed interface with full light and dark mode support. Works perfectly on any device, any time of day.",
      icon: SunMoon,
      bg: "bg-rose-500/10 text-rose-500",
    }
  ]

  return (
    <section id="features" className="py-32 bg-[var(--bg-subtle)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">Features</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-3">Everything you need to land the job</h2>
          <p className="text-[var(--text-secondary)] mt-4 text-lg">Built for serious job seekers who want an edge.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } }
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--accent)]/30 hover:shadow-[var(--shadow-md)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-full ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] text-lg">{f.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm mt-2 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      title: "Add a job",
      desc: "Find a role you like? Paste the company name, role, and job description into JobTrackr in under a minute.",
    },
    {
      title: "Get your match score",
      desc: "Gemini instantly analyzes your resume against the job description and gives you a score from 0–100 with specific strengths and gaps.",
    },
    {
      title: "Generate your cover letter",
      desc: "Pick a tone and hit generate. Gemini writes a personalized cover letter in seconds — no templates, no generic filler.",
    },
    {
      title: "Track and land the offer",
      desc: "Update your application status as you progress. Stay organized, follow up at the right time, and land the offer.",
    }
  ]

  return (
    <section id="how-it-works" className="py-32 bg-[var(--bg-base)]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">How it works</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mt-3">From application to offer in four steps</h2>
          <p className="text-[var(--text-secondary)] mt-4 text-lg">JobTrackr makes your job search feel manageable, not overwhelming.</p>
        </div>

        <div className="relative">
          {/* Desktop dashed line */}
          <div className="hidden md:block absolute top-7 left-0 w-full border-t-2 border-dashed border-[var(--border)] z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative z-10 text-center md:text-left flex flex-col items-center md:items-start"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--accent-subtle)] border-2 border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] font-bold text-lg mx-auto md:mx-0">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mt-5 text-base">{step.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm mt-2 leading-relaxed max-w-[250px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="mt-20 max-w-lg mx-auto bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl animate-[float_6s_ease-in-out_infinite]"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">AI Cover Letter</span>
          </div>
          
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-medium">Formal</span>
            <span className="px-3 py-1 bg-[var(--bg-surface-2)] text-[var(--text-secondary)] rounded-full text-xs font-medium border border-[var(--border)]">Friendly</span>
            <span className="px-3 py-1 bg-[var(--bg-surface-2)] text-[var(--text-secondary)] rounded-full text-xs font-medium border border-[var(--border)]">Assertive</span>
          </div>

          <button className="w-full py-2 bg-[var(--accent)] text-white font-medium rounded-lg text-sm mb-4">
            Generate with Gemini AI
          </button>

          <div className="space-y-2 relative">
            <div className="h-4 bg-[var(--border)] rounded w-3/4 opacity-50" />
            <div className="h-4 bg-[var(--border)] rounded w-full opacity-30" />
            <div className="h-4 bg-[var(--border)] rounded w-5/6 opacity-10" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-surface)]" />
          </div>

          <div className="text-right mt-2 text-xs text-[var(--text-muted)]">247 words</div>
        </motion.div>
      </div>
    </section>
  )
}

function FAQSection() {
  const faqs = [
    { q: "Is JobTrackr really free?", a: "Yes — JobTrackr is completely free to use. Create an account and start tracking your applications immediately. No credit card required." },
    { q: "How does the AI match scoring work?", a: "When you add a job, JobTrackr sends your resume and the job description to Gemini AI, which analyzes the overlap and returns a match score from 0 to 100 along with specific strengths and skill gaps. The whole process takes a few seconds." },
    { q: "How are cover letters personalized?", a: "Gemini reads your actual resume and the specific job description — not a generic template. It tailors every sentence to your background and the role requirements. You can also choose the tone: formal, friendly, or assertive." },
    { q: "Is my resume data safe?", a: "Your resume text is stored securely in our database and is only ever sent to the Gemini AI API for processing your requests. We never share, sell, or use your data for any other purpose." },
    { q: "Can I use JobTrackr on mobile?", a: "Absolutely. JobTrackr is fully responsive and works beautifully on any device — phone, tablet, or desktop." },
    { q: "Do I need to create an account to try it?", a: "You can sign in with Google in one click — no form filling required. Alternatively, register with your email and password. Either way, you're up and running in under 30 seconds." }
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section id="faq" className="py-32 bg-[var(--bg-subtle)]">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-widest uppercase text-[var(--accent)]">FAQ</p>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mt-3">Questions? We've got answers.</h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl mb-3 overflow-hidden"
            >
              <div 
                className="p-5 flex items-center justify-between cursor-pointer select-none"
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
              >
                <span className="font-medium text-[var(--text-primary)]">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[var(--text-muted)]"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="px-5 pb-5 text-[var(--text-secondary)] text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-12 text-center text-[var(--text-primary)] font-medium">
          Still have questions? We'd love to help.<br/>
          <a href="mailto:hello@jobtrackr.io" className="text-[var(--accent)] hover:underline mt-2 inline-block">hello@jobtrackr.io</a>
        </div>
      </div>
    </section>
  )
}

function FooterSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const socialLinks = [
    {
      label: 'GitHub',
      href: 'https://github.com/Sumit-y88/Ai-job-tracker',
      Icon: Github,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sumit-yadav-ab538b321/',
      Icon: Linkedin,
    },
    {
      label: 'Portfolio',
      href: 'http://sumity88.in',
      Icon: Globe,
    },
  ]

  return (
    <footer className="bg-[var(--bg-base)] border-t border-[var(--border)] py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between flex-wrap gap-12 md:gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-[var(--text-primary)]">JobTrackr</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-3">Your AI-powered job search companion.</p>
          <div className="flex items-center gap-3 mt-6">
            {socialLinks.map(({ label, href, Icon }) => (
              <motion.a 
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="flex gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Product</h4>
            <button onClick={() => scrollTo('features')} className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">How it works</button>
            <button onClick={() => scrollTo('faq')} className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">FAQ</button>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">Account</h4>
            <Link to="/login" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Sign in</Link>
            <Link to="/register" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Get started</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-[var(--border)] flex justify-between items-center flex-wrap gap-4">
        <div className="text-xs text-[var(--text-muted)]">© 2026 JobTrackr. All rights reserved.</div>
        <ThemeToggle />
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="font-sans antialiased overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FAQSection />
      <FooterSection />
    </main>
  )
}
