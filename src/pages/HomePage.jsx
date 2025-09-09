import React, {useEffect, useState ,useRef} from "react";
import "../css/HomePage.css";
import { useAuth } from '../utils/AuthContext'

const agents = [
  { id: "scout", name: "Scout", icon: "🔍", colour: "#c9f5f0" },
  { id: "muse", name: "Muse", icon: "🧠", colour: "#f9e1ff" },
  { id: "echo", name: "Echo", icon: "🖊️", colour: "#d8e9ff" },
  { id: "atlas", name: "Atlas", icon: "🛡️", colour: "#ffe6da" },
  { id: "beacon", name: "Beacon", icon: "🌐", colour: "#e3fff3" },
];

function HomePage() {
  const { user, signOut } = useAuth()
  const [activeAgent, setActiveAgent] = useState(null);
  const [tabInfo, setTabInfo] = useState({ url: '', title: '' })
  const [messages, setMessages] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [infoVisible, setInfoVisible] = useState(false);
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

  const handleLogout = async () => {
    await signOut()
  }
  // Handle agent click
  const handleAgentClick = (agentId) => {
    setActiveAgent(agentId);
    
    setMessages((prev) => {
      // const agentMsgs = prev[agentId] || [];
      // const hasHello = agentMsgs.some((msg) => msg.id === "hello");
      
      // if (hasHello) return prev;

      return {
        
        [agentId]: [
          {
            id: "hello",
            agent: agentId,
            icon: agents.find((a) => a.id === agentId).icon,
            text:`Your currunt Tab URL is ${tabInfo.url || '—'} `,
          },
        ],
      };
    });
  };

  // Send a message
  const handleSendMessage = () => {
    if (!inputValue.trim() || !activeAgent) return;
    setMessages((prev) => ({
      ...prev,
      [activeAgent]: [
        ...prev[activeAgent],
        {
          id: Date.now(),
          agent: "user",
          icon: "🗨️",
          text: inputValue.trim(),
        },
      ],
    }));
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1 className="headline">
          <span className="purple">NUCLEAS</span> · Task
          <span
            className="info-icon"
            onMouseEnter={() => setInfoVisible(true)}
            onMouseLeave={() => setInfoVisible(false)}
          >
            ℹ️
            {infoVisible && (
              <div className="tooltip">
                NUCLEAS is your AI-powered task management assistant.
              </div>
            )}
          </span>
        </h1>
      </div>

      {/* Dropdown */}
      <div className="dropdown">
        <button
          className="dropdown-toggle"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {dropdownOpen ? "▾" : "▸"} Live Agent Team
        </button>
        {dropdownOpen && (<>
          <div className="agent-box">
            {agents.map(({ id, icon }) => (<>
              <button
                key={id}
                className={`agent-button ${
                  activeAgent === id ? "agent-button-active" : ""
                }`}
                onClick={() => handleAgentClick(id)}
              >
                <span className="agent-icon">{icon}</span>
              </button>

             </>
              ))
            }
            
          </div >
          <div className="agent-name">
          {agents.map(({ name }) => (
              <span>{name}</span>
           
            ))
          }</div>

</>
        )}
      </div>

      {/* Chat Area */}
      <div className="chat-container">
        {activeAgent === null ? (
          <div className="chat-placeholder">
            Select an AI agent to start chatting
          </div>
        ) : !messages[activeAgent] || messages[activeAgent].length === 0 ? (
          <div className="chat-placeholder">No messages yet</div>
        ) : (
          messages[activeAgent].map(({ id, agent, icon, text }) => {
            const colour =
              agents.find((a) => a.id === agent)?.colour || "#ddd";
            const isUser = agent === "user";
            return (
              <div
                key={id}
                className={`chat-row ${isUser ? "chat-row-user" : "chat-row-agent"}`}
                style={{ color: isUser ? "#aaa" : colour }}
              >
{!isUser && <span className="chat-avatar">{icon}</span>}                
             
<div
        className={`chat-message ${isUser ? "user-message" : ""}`}
        style={{ 
          borderColor: isUser ? "#000000" : colour,
          backgroundColor: isUser ? "#FFFFFF" : colour
        }}
      >
        <pre className="chat-text"
              
        >{text}</pre>
      </div>
      {isUser && <span className="chat-avatar1">{icon}</span>}
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input-container">
        <input
          type="text"
          placeholder={
            activeAgent
              ? `Ask ${agents.find((a) => a.id === activeAgent).name} anything...`
              : "Select an AI agent first"
          }
          value={inputValue}
          disabled={!activeAgent}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
        />
        <button
          className="send-button"
          onClick={handleSendMessage}
          disabled={!activeAgent || inputValue.trim() === ""}
        >
          ➤
        </button>
      </div>
      <div className="nav-right">
          <span>Hello, {user?.email}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
    </div>
  );
}

export default HomePage;
