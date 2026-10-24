"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  "Computer Science",
  "B.Tech CSE",
  "MBA",
  "B.Sc Agriculture",
  "Scholarships",
  "Fee Structure",
  "Hostel & Campus",
  "Placements",
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleQuickSearch = (keyword: string) => {
    onClose();
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <div
      className="gu-search-overlay-root"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Website Search"
    >
      <style>{`
        .gu-search-overlay-root {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(8, 15, 30, 0.90);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: max(10vh, 80px);
          padding-left: 20px;
          padding-right: 20px;
          animation: guOverlayFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes guOverlayFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .gu-search-card {
          width: 100%;
          max-width: 820px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .gu-search-close-btn {
          position: absolute;
          top: -50px;
          right: 0;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .gu-search-close-btn:hover {
          background: #e8871a;
          border-color: #e8871a;
          transform: rotate(90deg);
        }

        .gu-search-heading {
          font-family: 'Source Sans 3', sans-serif;
          font-size: clamp(26px, 4.5vw, 42px);
          font-weight: 800;
          color: #ffffff;
          text-align: center;
          margin-bottom: 28px;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .gu-search-form {
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
        }

        .gu-search-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 2px solid rgba(255, 255, 255, 0.7);
          color: #ffffff;
          font-size: clamp(18px, 3vw, 24px);
          font-weight: 500;
          padding: 16px 56px 16px 4px;
          outline: none;
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .gu-search-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
          font-weight: 400;
        }
        .gu-search-input:focus {
          border-bottom-color: #e8871a;
        }

        .gu-search-submit-btn {
          position: absolute;
          right: 4px;
          background: #e8871a;
          border: none;
          color: #ffffff;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .gu-search-submit-btn:hover {
          background: #c9710f;
          transform: scale(1.05);
        }

        .gu-search-suggestions {
          width: 100%;
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .gu-search-sug-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gu-search-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .gu-search-tag {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.16);
          color: rgba(255, 255, 255, 0.9);
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .gu-search-tag:hover {
          background: rgba(232, 135, 26, 0.25);
          border-color: #e8871a;
          color: #ffffff;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="gu-search-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="gu-search-close-btn"
          onClick={onClose}
          aria-label="Close search"
        >
          <X size={20} />
        </button>

        <h2 className="gu-search-heading">Search the website below</h2>

        <form className="gu-search-form" onSubmit={handleSearchSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="gu-search-input"
            placeholder="Enter your keyword here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="gu-search-submit-btn"
            aria-label="Submit search"
          >
            <Search size={20} />
          </button>
        </form>

        <div className="gu-search-suggestions">
          <div className="gu-search-sug-title">
            Popular Searches
          </div>
          <div className="gu-search-tags">
            {POPULAR_SEARCHES.map((item) => (
              <button
                key={item}
                type="button"
                className="gu-search-tag"
                onClick={() => handleQuickSearch(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
