import { useState, useRef, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000';

const QUICK_QUESTIONS = [
  { emoji: '🏛️', text: 'Ceritakan tentang Suku Toraja' },
  { emoji: '🍜', text: 'Apa makanan khas Padang?' },
  { emoji: '🏝️', text: 'Rekomendasikan wisata di Bali' },
  { emoji: '🎭', text: 'Jelaskan tari Saman dari Aceh' },
  { emoji: '🌋', text: 'Tempat wisata alam terbaik di Jawa' },
  { emoji: '🥘', text: 'Makanan tradisional khas Betawi' },
];

function TypingIndicator() {
  return (
    <div className="message bot-message">
      <div className="avatar bot-avatar">🤖</div>
      <div className="bubble typing-bubble">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      {!isUser && <div className="avatar bot-avatar">🤖</div>}
      <div className={`bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        <p className="message-text" dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
        <span className="message-time">{msg.time}</span>
      </div>
      {isUser && <div className="avatar user-avatar">👤</div>}
    </div>
  );
}

// Format markdown-like text to basic HTML
function formatText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>')
    .replace(/^- (.+)/gm, '• $1')
    .replace(/^(\d+\.) (.+)/gm, '$1 $2');
}

function getTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '🌺 Halo! Saya **NusantaraBot**, asisten AI yang siap membantu kamu menjelajahi kekayaan Indonesia!\n\nSaya bisa menjawab pertanyaan tentang:\n• 🏛️ **Suku & Adat Istiadat** dari Sabang sampai Merauke\n• 🎨 **Budaya & Seni Tradisional** Indonesia\n• 🍜 **Kuliner & Makanan Khas Daerah**\n• 🏝️ **Tempat Wisata** yang menakjubkan\n\nTanyakan apa saja tentang Nusantara! 🇮🇩',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    const userMsg = { role: 'user', text: userText, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, history }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.');

      const botMsg = { role: 'bot', text: data.result, time: getTime() };
      setMessages((prev) => [...prev, botMsg]);

      // Simpan riwayat percakapan (max 10 pasang)
      setHistory((prev) => {
        const newHistory = [
          ...prev,
          { role: 'user', text: userText },
          { role: 'model', text: data.result },
        ];
        return newHistory.slice(-20); // Simpan 10 pasang pesan terakhir
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: `⚠️ Maaf, terjadi kesalahan: ${err.message}. Pastikan server backend berjalan di port 3000.`,
          time: getTime(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'bot',
        text: '🌺 Chat telah direset! Halo lagi! Saya **NusantaraBot**, siap membantu kamu menjelajahi kekayaan Indonesia! 🇮🇩\n\nTanyakan apa saja tentang Suku, Budaya, Makanan, atau Tempat Wisata Indonesia!',
        time: getTime(),
      },
    ]);
    setHistory([]);
  };

  return (
    <div className="app">
      {/* Background decorations */}
      <div className="bg-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-left">
            <div className="logo-ring">
              <span className="logo-emoji">🏝️</span>
            </div>
            <div className="header-info">
              <h1 className="header-title">NusantaraBot</h1>
              <span className="header-subtitle">Ahli Budaya & Wisata Indonesia 🇮🇩</span>
            </div>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <span className="status-dot"></span>
              Online
            </div>
            <button className="clear-btn" onClick={clearChat} title="Reset Chat">
              🗑️
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <main className="chat-messages">
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </main>

        {/* Quick Questions */}
        <section className="quick-questions">
          <div className="quick-scroll">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                className="quick-btn"
                onClick={() => sendMessage(q.text)}
                disabled={loading}
              >
                <span>{q.emoji}</span> {q.text}
              </button>
            ))}
          </div>
        </section>

        {/* Input Area */}
        <footer className="chat-input-area">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya tentang suku, budaya, makanan, atau wisata Indonesia..."
              rows={1}
              disabled={loading}
            />
            <button
              className={`send-btn ${loading ? 'loading' : ''}`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              title="Kirim"
            >
              {loading ? '⏳' : '🚀'}
            </button>
          </div>
          <p className="input-hint">Tekan Enter untuk kirim • Shift+Enter untuk baris baru</p>
        </footer>
      </div>
    </div>
  );
}
