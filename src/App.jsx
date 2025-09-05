import { useEffect, useRef, useState } from 'react'

export default function App() {
  const [tabInfo, setTabInfo] = useState({ url: '', title: '' })
  const [message, setMessage] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const onMessage = (event) => {
      if (!event?.data) return
      if (event.data.type === 'tabInfo') {
        setTabInfo({ url: event.data.url || '', title: event.data.title || '' })
      }
    }
    window.addEventListener('message', onMessage)

    // Ask the parent (extension sidepanel) for initial data
    window.parent.postMessage({ type: 'requestInitialData' }, '*')

    return () => window.removeEventListener('message', onMessage)
  }, [])

  const handleSend = () => {
    const text = message.trim()
    if (!text) return
    console.log('Message sent:', text)
    setMessage('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.label}>Current URL</div>
        <div style={styles.value}>{tabInfo.url || '—'}</div>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Page Title</div>
        <div style={styles.value}>{tabInfo.title || '—'}</div>
      </div>

      <div style={styles.messageBar}>
        <input
          ref={inputRef}
          style={styles.input}
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.sendBtn} onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    fontFamily: 'Inter, system-ui, Arial, sans-serif',
    background: '#f5f5f5',
    padding: '20px',
    paddingBottom: '90px',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  card: {
    background: '#fff',
    padding: '14px',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    marginBottom: '12px'
  },
  label: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  value: {
    fontSize: '14px',
    color: '#111',
    wordBreak: 'break-all'
  },
  messageBar: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    background: '#fff',
    borderTop: '1px solid #e9e9e9',
    boxShadow: '0 -2px 6px rgba(0,0,0,0.04)'
  },
  input: {
    flex: 1,
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    padding: '0 10px',
    fontSize: '14px'
  },
  sendBtn: {
    height: '36px',
    padding: '0 14px',
    borderRadius: '8px',
    border: 'none',
    background: '#1976d2',
    color: '#fff',
    cursor: 'pointer'
  }
}

