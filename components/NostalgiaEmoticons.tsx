"use client";

import { useState, useRef, useEffect } from "react";

const EMOJI_MAP: Record<number, string> = {
  1: "happy", 2: "sad", 3: "winking", 4: "grin", 5: "batting", 6: "confused",
  7: "love", 8: "blushing", 9: "tongue", 10: "kiss", 11: "surprised",
  12: "angry", 13: "smug", 14: "cool", 15: "worried", 16: "devil",
  17: "crying", 18: "laughing", 19: "straight", 20: "raised", 21: "angel",
  22: "nerd", 23: "talkhand", 24: "sleepy", 25: "rollingeyes", 26: "sick",
  27: "donttell", 28: "notalking", 29: "clown", 30: "silly", 31: "yawn",
  32: "drooling", 33: "thinking", 34: "doh", 35: "applause", 36: "pig",
  37: "cow", 38: "monkey", 39: "chicken", 40: "rose", 41: "goodluck",
  42: "flag", 43: "pumpkin", 44: "coffee", 45: "idea", 46: "skull",
  47: "bug", 48: "alien", 49: "frustrated", 50: "cowboy", 51: "praying",
  52: "hipno", 53: "money", 54: "whistling", 55: "liar", 56: "beatup",
  57: "peace", 58: "shame", 59: "dancing", 60: "hug", 61: "hiro",
  62: "billy", 63: "april", 64: "yinyang", 65: "broken", 66: "whew",
  67: "rolling", 68: "loser", 69: "party", 70: "nail", 71: "waiting",
  72: "sigh", 73: "phbbt", 74: "bringit", 75: "hehe", 76: "chatterbox",
  77: "notworthy", 78: "ohgoon", 79: "star", 80: "phone", 81: "callme",
  82: "witsend", 83: "bye", 84: "timeout", 85: "daydreaming", 86: "dontknow",
  87: "notlistening", 88: "puppy", 89: "pirate", 90: "transformer",
  91: "dontsee", 92: "hurryup", 93: "rockon", 94: "thumbdown", 95: "thumbup",
  96: "wasnotme", 97: "bee", 98: "cheer", 99: "dizzy", 100: "cook",
  101: "eat", 102: "giveup", 103: "cold", 104: "hot", 105: "music",
  106: "vomit", 107: "sing", 108: "catch", 109: "exercise", 110: "highfive",
  111: "gaming", 112: "searchme", 113: "spooky", 114: "studying",
  115: "tv", 116: "gift", 117: "unlucky", 118: "downonluck", 119: "fight",
};


const PER_PAGE = 16;

const GITHUB_BASE_URL = "https://raw.githubusercontent.com/chinhodado/ym_emo_fb/master/images";

export default function NostalgiaEmoticons() {
  const [copied, setCopied] = useState<number | null>(null);
  // state برای مدیریت تعداد ایموجی‌های نمایش داده شده
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);
  // Ref برای کانتینر اصلی جهت کنترل اسکرول
  const containerRef = useRef<HTMLDivElement>(null);
  // Ref برای آخرین ایموجیِ لود شده (جهت اسکرول خودکار به آن)
  const lastEmojiRef = useRef<HTMLButtonElement>(null);

  // مدیریت اسکرول خودکار هنگام تغییر visibleCount
  useEffect(() => {
    // اگر ref وجود دارد و تعداد ایموجی‌ها بیشتر از حد اولیه است (یعنی لود مور انجام شده)
    if (lastEmojiRef.current && visibleCount > PER_PAGE) {
      // اسکرول نرم به سمت آخرین ایموجی
      lastEmojiRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [visibleCount]); // هر وقت تعداد ایموجی‌ها عوض شد، این useEffect اجرا میشه

  const loadMore = () => {
    setVisibleCount((prev) => prev + PER_PAGE);
  };

  const copyEmoticon = async (number: number) => {
    const filename = EMOJI_MAP[number];
    if (!filename) {
      console.error(`No filename found for emoticon number: ${number}`);
      return;
    }
    const url = `${GITHUB_BASE_URL}/${filename}.gif`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(number);
      setTimeout(() => {
        setCopied(null);
      }, 1200);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // محاسبه total available emojis
  const totalAvailable = Object.keys(EMOJI_MAP).length;
  // بررسی اینکه آیا هنوز ایموجی برای لود کردن وجود دارد
  const hasMore = visibleCount < totalAvailable;

  return (
    <div className="border-t border-border bg-background/50 p-4">
      <div className="flex items-baseline justify-between mb-3">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          // my emoticon — click to copy
        </p>
        <span className="font-mono text-[10px] text-muted/70">
          {Math.min(visibleCount, totalAvailable)} / {totalAvailable}
        </span>
      </div>

      {/* کانتینر قابل اسکرول */}
      <div
        ref={containerRef}
        className="grid max-h-[40vh] grid-cols-6 gap-2 overflow-y-auto pr-1 sm:grid-cols-8"
      >
        {Array.from({ length: visibleCount }, (_, i) => i + 1).map((number) => {
          const filename = EMOJI_MAP[number];
          if (!filename) return null;
          const url = `${GITHUB_BASE_URL}/${filename}.gif`;

          // تعیین میکنیم که آیا این آیتم، آخرین آیتمِ لیستِ در حال نمایش است یا خیر
          const isLastItem = number === visibleCount;

          return (
            <button
              ref={isLastItem ? lastEmojiRef : null} // اگر آخریه، ref رو بهش میدیم
              key={number}
              type="button"
              title={`Copy ${filename}.gif`}
              onClick={() => copyEmoticon(number)}
              className="group relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-sm border border-border bg-card p-1 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/5 active:translate-y-0"
            >
              <img
                src={url}
                alt={`Yahoo Messenger emoticon ${filename}`}
                className="h-auto w-auto object-contain transition-transform duration-150 group-hover:scale-110"
                loading="lazy"
              />
              {copied === number && (
                <span className="absolute inset-0 flex items-center justify-center bg-background/90 font-mono text-[9px] uppercase text-accent">
                  copied
                </span>
              )}
            </button>
          );
        })}

        {/* دکمه Load More */}
        {hasMore && (
          <div className="col-span-6 sm:col-span-8 flex justify-center pt-2 pb-1">
            <button
              onClick={loadMore}
              className="font-mono text-[10px] uppercase tracking-widest text-accent hover:text-accent-foreground px-4 py-1.5 rounded bg-accent/10 hover:bg-accent/20 transition-colors"
            >
              Load More...
            </button>
          </div>
        )}
      </div>
    </div>
  );
}