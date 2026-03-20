"use client";

import React, { useMemo, useRef, useState } from "react";
import { Send, Search as SearchIcon, Plus, MoreVertical, SmilePlus, Pencil, Undo2, X } from "lucide-react";

type ChatThread = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
};

type ChatMessage = {
  id: string;
  threadId: string;
  from: "me" | "them";
  text: string;
  time: string;
  edited?: boolean;
  recalled?: boolean;
  reactions?: Record<string, number>;
};

const threadsSeed: ChatThread[] = [
  { id: "t1", name: "Alice", lastMessage: "Ok, send me the file.", time: "09:18", unread: 2 },
  { id: "t2", name: "Team Illegal Coin", lastMessage: "Standup in 10 mins.", time: "Yesterday" },
  { id: "t3", name: "Support", lastMessage: "We received your request.", time: "Mon" },
];

const messagesSeed: ChatMessage[] = [
  { id: "m1", threadId: "t1", from: "them", text: "Hey, are you free?", time: "09:10" },
  { id: "m2", threadId: "t1", from: "me", text: "Yes. What’s up?", time: "09:12" },
  { id: "m3", threadId: "t1", from: "them", text: "Can you send me the file?", time: "09:18" },
  { id: "m4", threadId: "t2", from: "them", text: "Standup in 10 mins.", time: "Yesterday" },
  { id: "m5", threadId: "t3", from: "them", text: "We received your request.", time: "Mon" },
];

const emojiChoices = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "✅"];

export default function Chat() {
  const [query, setQuery] = useState("");
  const [activeThreadId, setActiveThreadId] = useState<string>(threadsSeed[0]?.id ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>(messagesSeed);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  const [menuOpenForId, setMenuOpenForId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [emojiOpenForId, setEmojiOpenForId] = useState<string | null>(null);

  const threads = useMemo(() => threadsSeed, []);
  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) ?? null,
    [threads, activeThreadId],
  );

  const filteredThreads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((t) => t.name.toLowerCase().includes(q));
  }, [threads, query]);

  const activeMessages = useMemo(
    () => messages.filter((m) => m.threadId === activeThreadId),
    [messages, activeThreadId],
  );

  function sendMessage() {
    const text = draft.trim();
    if (!text || !activeThreadId) return;

    const next: ChatMessage = {
      id: `m_${Date.now()}`,
      threadId: activeThreadId,
      from: "me",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      edited: false,
      recalled: false,
    };
    setMessages((prev) => [...prev, next]);
    setDraft("");
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  }

  function onDraftKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  function beginEdit(message: ChatMessage) {
    if (message.from !== "me" || message.recalled) return;
    setEditingId(message.id);
    setEditText(message.text);
    setMenuOpenForId(null);
    setEmojiOpenForId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  function saveEdit() {
    const text = editText.trim();
    if (!editingId || !text) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === editingId ? { ...m, text, edited: true } : m,
      ),
    );
    cancelEdit();
  }

  function recallMessage(id: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, text: "", recalled: true, edited: false } : m,
      ),
    );
    setMenuOpenForId(null);
    setEmojiOpenForId(null);
    if (editingId === id) cancelEdit();
  }

  function addReaction(id: string, emoji: string) {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const reactions = { ...(m.reactions ?? {}) };
        reactions[emoji] = (reactions[emoji] ?? 0) + 1;
        return { ...m, reactions };
      }),
    );
    setEmojiOpenForId(null);
    setMenuOpenForId(null);
  }

  return (
    <div className="chat">
      <aside className="chat-left">
        <div className="chat-left-top">
          <div className="chat-left-title">
            <h2>Chat</h2>
            <button className="chat-icon-btn" type="button" aria-label="New chat">
              <Plus size={18} />
            </button>
          </div>

          <div className="chat-search">
            <SearchIcon className="chat-search-icon" size={18} />
            <input
              className="chat-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chats"
            />
          </div>
        </div>

        <div className="chat-thread-list">
          {filteredThreads.map((t) => {
            const active = t.id === activeThreadId;
            return (
              <button
                key={t.id}
                type="button"
                className={active ? "chat-thread active" : "chat-thread"}
                onClick={() => setActiveThreadId(t.id)}
              >
                <div className="chat-avatar">{t.name.slice(0, 1).toUpperCase()}</div>
                <div className="chat-thread-meta">
                  <div className="chat-thread-row">
                    <div className="chat-thread-name">{t.name}</div>
                    <div className="chat-thread-time">{t.time}</div>
                  </div>
                  <div className="chat-thread-row">
                    <div className="chat-thread-last">{t.lastMessage}</div>
                    {t.unread ? <div className="chat-unread">{t.unread}</div> : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="chat-right">
        <div className="chat-right-top">
          <div className="chat-right-title">
            <div className="chat-right-name">{activeThread?.name ?? "Select a chat"}</div>
            <button className="chat-icon-btn" type="button" aria-label="More">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {activeMessages.map((m) => (
            <div
              key={m.id}
              className={m.from === "me" ? "chat-msg chat-msg-me" : "chat-msg chat-msg-them"}
            >
              <div className="chat-bubble">
                <div className="chat-bubble-top">
                  {m.from === "me" ? (
                    <div className="chat-actions">
                      <button
                        type="button"
                        className="chat-action-btn"
                        aria-label="Message actions"
                        onClick={() => {
                          setMenuOpenForId((cur) => (cur === m.id ? null : m.id));
                          setEmojiOpenForId(null);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {menuOpenForId === m.id ? (
                        <div className="chat-action-menu" role="menu">
                          <button
                            type="button"
                            className="chat-action-item"
                            onClick={() => beginEdit(m)}
                            disabled={!!m.recalled}
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                          <button
                            type="button"
                            className="chat-action-item"
                            onClick={() => setEmojiOpenForId((cur) => (cur === m.id ? null : m.id))}
                            disabled={!!m.recalled}
                          >
                            <SmilePlus size={16} />
                            React
                          </button>
                          <button
                            type="button"
                            className="chat-action-item danger"
                            onClick={() => recallMessage(m.id)}
                            disabled={!!m.recalled}
                          >
                            <Undo2 size={16} />
                            Recall
                          </button>
                        </div>
                      ) : null}

                      {emojiOpenForId === m.id ? (
                        <div className="chat-emoji-menu" role="menu" aria-label="Emoji picker">
                          {emojiChoices.map((e) => (
                            <button
                              key={e}
                              type="button"
                              className="chat-emoji"
                              onClick={() => addReaction(m.id, e)}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {editingId === m.id ? (
                  <div className="chat-edit">
                    <input
                      className="chat-edit-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                    <div className="chat-edit-actions">
                      <button type="button" className="chat-edit-btn" onClick={saveEdit}>
                        Save
                      </button>
                      <button type="button" className="chat-edit-btn ghost" onClick={cancelEdit} aria-label="Cancel edit">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={m.recalled ? "chat-text chat-text-recalled" : "chat-text"}>
                    {m.recalled ? "You recalled a message" : m.text}
                  </div>
                )}

                {m.reactions && Object.keys(m.reactions).length ? (
                  <div className="chat-reactions">
                    {Object.entries(m.reactions).map(([emoji, count]) => (
                      <span key={emoji} className="chat-reaction">
                        {emoji} {count}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="chat-time">
                  {m.time}
                  {m.edited && !m.recalled ? <span className="chat-edited"> · edited</span> : null}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="chat-composer">
          <input
            className="chat-composer-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onDraftKeyDown}
            placeholder="Type a message…"
          />
          <button className="chat-send" type="button" onClick={sendMessage} aria-label="Send">
            <Send size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}