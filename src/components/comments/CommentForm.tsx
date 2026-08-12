import React, { useState, useRef, useEffect } from 'react';
import { Send, AtSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string, mentions: string[]) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const { users } = useAuth();
  const [content, setContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect '@' for mentions
  useEffect(() => {
    const lastWord = content.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setShowMentions(true);
      setMentionFilter(lastWord.slice(1).toLowerCase());
    } else {
      setShowMentions(false);
    }
  }, [content]);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(mentionFilter));

  const handleMentionSelect = (userName: string) => {
    const words = content.split(' ');
    words.pop(); // remove the incomplete @mention
    const newContent = [...words, `@${userName} `].join(' ');
    setContent(newContent);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Extract mentioned user IDs
    const mentions: string[] = [];
    users.forEach(u => {
      if (content.includes(`@${u.name}`)) {
        mentions.push(u.id);
      }
    });

    onSubmit(content.trim(), mentions);
    setContent('');
    setShowMentions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative mt-4">
      {/* Mention Dropdown */}
      {showMentions && filteredUsers.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-10">
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
            Members
          </div>
          <div className="max-h-40 overflow-y-auto">
            {filteredUsers.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleMentionSelect(u.name)}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{u.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Write a comment... (Type @ to mention)"
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 text-sm text-slate-800 dark:text-slate-200 resize-none min-h-[50px] max-h-32 custom-scrollbar"
            rows={1}
          />
          <button 
            type="button"
            onClick={() => setContent(prev => prev + '@')}
            className="absolute right-3 top-3 text-slate-400 hover:text-purple-500 transition-colors"
          >
            <AtSign size={18} />
          </button>
        </div>
        
        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl p-3 transition-colors shrink-0 flex items-center justify-center h-[50px] w-[50px]"
        >
          <Send size={18} className={content.trim() ? "ml-1" : ""} />
        </button>
      </div>
    </form>
  );
};
