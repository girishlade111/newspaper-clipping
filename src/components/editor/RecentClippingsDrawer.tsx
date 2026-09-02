import React, { useEffect, useState } from 'react';
import {
  getRecentClippings,
  deleteClipping,
  clearAllClippings,
  type ClippingRecord,
} from '../../utils/exportAndStorage';

export interface RecentClippingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClipping: (record: ClippingRecord) => void;
}

export default function RecentClippingsDrawer({
  isOpen,
  onClose,
  onSelectClipping,
}: RecentClippingsDrawerProps) {
  const [clippings, setClippings] = useState<ClippingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load clippings from Dexie.js
  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await getRecentClippings(50);
      setClippings(items);
    } catch (err) {
      console.error('Failed to fetch clippings from Dexie.js', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const handleDelete = async (e: React.MouseEvent, id?: number) => {
    e.stopPropagation();
    if (!id) return;
    try {
      await deleteClipping(id);
      setClippings((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete clipping', err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all saved clippings?')) {
      try {
        await clearAllClippings();
        setClippings([]);
      } catch (err) {
        console.error('Failed to clear clippings', err);
      }
    }
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-canvas-soft border-l border-black/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-white border-b border-black/10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h2 className="font-display font-black text-xl text-ink tracking-tight" id="slide-over-title">
                  My Recent Clippings
                </h2>
              </div>
              <p className="text-xs text-mute mt-1">
                {clippings.length} {clippings.length === 1 ? 'clipping' : 'clippings'} saved locally in IndexedDB
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-canvas-soft hover:bg-black/10 flex items-center justify-center text-ink transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Action Bar */}
          {clippings.length > 0 && (
            <div className="px-6 py-3 bg-canvas-soft/80 border-b border-black/5 flex items-center justify-between text-xs">
              <span className="text-mute font-semibold">Click any item to restore session</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-negative-deep hover:text-negative-darkest font-bold transition-colors"
              >
                Clear All History
              </button>
            </div>
          )}

          {/* List of Saved Clippings */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-mute text-sm">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                <span>Reading local storage...</span>
              </div>
            ) : clippings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-14 h-14 rounded-full bg-canvas flex items-center justify-center text-2xl mb-4 border border-black/10">
                  📰
                </div>
                <h3 className="font-display font-bold text-ink text-base mb-1">
                  No Saved Clippings Yet
                </h3>
                <p className="text-xs text-mute max-w-xs leading-relaxed mb-6">
                  Click the <strong className="text-ink font-bold">"Save to Drafts"</strong> button in the editor to store your designs locally in your browser.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-active text-ink font-bold text-xs shadow-sm transition-all"
                >
                  Back to Editor
                </button>
              </div>
            ) : (
              clippings.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectClipping(item);
                    onClose();
                  }}
                  className="group bg-white rounded-xl p-4 shadow-sm border border-black/10 hover:border-black/30 hover:shadow-md transition-all cursor-pointer relative flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-pill bg-canvas-soft text-[10px] font-bold text-ink uppercase tracking-wider">
                        {item.template.replace('-', ' ')}
                      </span>
                      <span className="text-[11px] text-mute font-medium">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id)}
                      className="text-mute hover:text-negative-deep p-1 rounded-md transition-colors"
                      title="Delete this clipping"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Thumbnail / Headline Preview */}
                  <div className="flex items-start gap-3">
                    {item.base64Image ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-canvas border border-black/10 shrink-0">
                        <img
                          src={item.base64Image}
                          alt="Thumbnail"
                          className="w-full h-full object-cover filter contrast-125"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-canvas border border-black/10 shrink-0 flex items-center justify-center text-xl text-mute">
                        📄
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-black text-sm text-ink leading-snug line-clamp-2 uppercase group-hover:text-positive-deep transition-colors">
                        {item.headline || 'UNTITLED HEADLINE'}
                      </h4>
                      <p className="text-[11px] text-mute mt-1 line-clamp-1">
                        {item.newspaperName} • {item.date}
                      </p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-primary-deep group-hover:text-ink">
                    <span>Click to Restore in Editor →</span>
                    <span className="text-[10px] text-mute font-normal font-sans">
                      {item.story.length} chars
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-white border-t border-black/10 text-center text-xs text-mute font-medium">
            100% Client-Side Storage in Dexie.js (IndexedDB). Zero Server Calls.
          </div>
        </div>
      </div>
    </div>
  );
}
