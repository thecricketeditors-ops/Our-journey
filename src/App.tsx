import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  Gift, 
  Lock, 
  Unlock,
  MessageSquare, 
  Gamepad2, 
  Sparkles, 
  Trophy, 
  Award,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { chapters, carromQuotes, bestieJokes, timelineEvents, bestieQuestions } from './data';

// ==================== CELESTIAL PIANO SYNTH ====================
class AmbientPianoSynth {
  private ctx: AudioContext | null = null;
  private interval: any = null;
  private isPlaying = false;
  private volumeNode: GainNode | null = null;
  private currentVolume = 0.15;

  start() {
    if (this.isPlaying) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.volumeNode.connect(this.ctx.destination);
      this.isPlaying = true;
      
      // Beautiful serene chord progression in C/F/G major for friendly warmth
      const chords = [
        [60, 64, 67, 71, 74], // Cmaj9
        [53, 57, 60, 64, 67], // Fmaj9
        [57, 60, 64, 67, 71], // Am9
        [55, 59, 62, 66, 69]  // G9
      ];

      let chordIndex = 0;
      let step = 0;

      this.interval = setInterval(() => {
        if (!this.ctx || this.ctx.state === 'suspended') return;
        const now = this.ctx.currentTime;
        const currentChord = chords[chordIndex];
        
        // Soft arpeggiator notes
        const noteIndex = step % currentChord.length;
        const midiNote = currentChord[noteIndex];
        const freq = Math.pow(2, (midiNote - 69) / 12) * 440;
        
        // Deep warm baseline
        if (step % 8 === 0) {
          const rootFreq = Math.pow(2, (currentChord[0] - 12 - 69) / 12) * 440;
          this.playTone(rootFreq, now, 3.0, 0.08);
        }

        // Play melody note
        this.playTone(freq, now, 1.8, 0.12);

        step++;
        if (step % 8 === 0) {
          chordIndex = (chordIndex + 1) % chords.length;
        }
      }, 500);
    } catch (e) {
      console.warn("AudioContext supported but blocked by user gesture/policy.");
    }
  }

  setVolume(vol: number) {
    this.currentVolume = vol;
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  // Soft synth chime for unlock notifications
  playSparkle() {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    const now = this.ctx.currentTime;
    const notes = [72, 76, 79, 84]; // Beautiful major scale sparkle
    notes.forEach((note, index) => {
      const freq = Math.pow(2, (note - 69) / 12) * 440;
      this.playTone(freq, now + index * 0.08, 1.2, 0.08);
    });
  }

  private playTone(freq: number, start: number, duration: number, volumeScale: number) {
    if (!this.ctx || !this.volumeNode) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, start);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(volumeScale, start + 0.15); // Celestial fading
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.volumeNode);

    osc.start(start);
    osc.stop(start + duration);
  }

  stop() {
    this.isPlaying = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

// Instantiate global audio context
const audioSynth = new AmbientPianoSynth();

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<'timeline' | 'scrapbook' | 'carrom'>('timeline');
  const [currentPage, setCurrentPage] = useState<'intro' | 'main'>('intro');
  const [introStep, setIntroStep] = useState(0); // 0 = tagline screen, 1 = butterfly wing animation, 2-6 = poem sequence, 7 = question gate
  const [activeTimelineId, setActiveTimelineId] = useState<number>(1);

  // Audio system state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.15);

  // Gating state machine
  const [currentChapter, setCurrentChapter] = useState(1);
  const [unlockedChapters, setUnlockedChapters] = useState<number[]>([1]);
  
  // Chapter locking, runaway button, and funny questions states
  const [chatAnimationFinished, setChatAnimationFinished] = useState(false);
  const [buttonRunawayActive, setButtonRunawayActive] = useState(false);
  const [buttonRunawayOffset, setButtonRunawayOffset] = useState({ x: 0, y: 0 });
  const [buttonRunawayMessage, setButtonRunawayMessage] = useState('');
  const [buttonRunawayCountdown, setButtonRunawayCountdown] = useState(0);
  const [hasCompletedRunaway, setHasCompletedRunaway] = useState<Record<number, boolean>>({});
  const [showQuestionGate, setShowQuestionGate] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedQuestionOption, setSelectedQuestionOption] = useState<number | null>(null);
  const [showQuestionFeedback, setShowQuestionFeedback] = useState(false);
  
  // Gating Questions: 
  // 1. Start Gate (before first chapter)
  const [hasAcceptedStartGate, setHasAcceptedStartGate] = useState(false);
  
  // 2. Banter Break transitions between chapters (Funny bestie jokes!)
  const [showBanterBreak, setShowBanterBreak] = useState(false);
  const [activeJokeIndex, setActiveJokeIndex] = useState(0);
  const [jokeRevealed, setJokeRevealed] = useState(false);
  const [targetChapter, setTargetChapter] = useState(1);
  
  const [gateMessage, setGateMessage] = useState('');
  const [noButtonOffset, setNoButtonOffset] = useState({ x: 0, y: 0 });
  const [noClicks, setNoClicks] = useState(0);

  // Chapter 9 unwrapping & letter
  const [isGiftUnwrapped, setIsGiftUnwrapped] = useState(false);

  // Chat typing states
  const [visibleChats, setVisibleChats] = useState<number>(1);
  const [typingIndex, setTypingIndex] = useState(-1);

  // Interactive Besties Dance Stage States
  const [boyPos, setBoyPos] = useState({ x: -40, y: 0 });
  const [girlPos, setGirlPos] = useState({ x: 0, y: 0 });
  const [danceHearts, setDanceHearts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [boyDanceAction, setBoyDanceAction] = useState<'bob' | 'spin' | 'flip' | 'slide'>('bob');
  const [girlDanceAction, setGirlDanceAction] = useState<'bob' | 'spin' | 'flip' | 'slide'>('bob');

  // Fancy Features: Vibe Oracle
  const [vibeRevealed, setVibeRevealed] = useState(false);
  const [currentVibe, setCurrentVibe] = useState('');
  const [vibeSpinning, setVibeSpinning] = useState(false);

  // Fancy Features: Gratitude Letterbox
  const [customLetter, setCustomLetter] = useState('');
  const [selectedPaperTheme, setSelectedPaperTheme] = useState<'sakura' | 'lavender' | 'amber'>('sakura');
  const [letterSent, setLetterSent] = useState(false);
  const [letterSending, setLetterSending] = useState(false);

  // Carrom Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [carromScore, setCarromScore] = useState({ she: 0, trijal: 0 });
  const [gameLog, setGameLog] = useState<string[]>(["Welcome to the Game Centre! Slide the striker and hit to play! 🎯"]);
  const [strikerPos, setStrikerPos] = useState(50); // 15 to 85 %
  const [strikerAnimating, setStrikerAnimating] = useState(false);
  const [turn, setTurn] = useState<'she' | 'trijal'>('she');
  const [pocketedWhite, setPocketedWhite] = useState(0);
  const [pocketedBlack, setPocketedBlack] = useState(0);
  const [coinCoords, setCoinCoords] = useState([
    { id: 1, type: 'white', x: 140, y: 150, active: true },
    { id: 2, type: 'white', x: 180, y: 150, active: true },
    { id: 3, type: 'white', x: 160, y: 175, active: true },
    { id: 4, type: 'black', x: 140, y: 170, active: true },
    { id: 5, type: 'black', x: 180, y: 170, active: true },
    { id: 6, type: 'black', x: 160, y: 145, active: true },
    { id: 7, type: 'queen', x: 160, y: 160, active: true } // Red Queen
  ]);

  // Carrom Physics engine refs and states
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const coinsRef = React.useRef([
    { id: 1, type: 'white', x: 140, y: 150, vx: 0, vy: 0, radius: 9, active: true },
    { id: 2, type: 'white', x: 180, y: 150, vx: 0, vy: 0, radius: 9, active: true },
    { id: 3, type: 'white', x: 160, y: 175, vx: 0, vy: 0, radius: 9, active: true },
    { id: 4, type: 'black', x: 140, y: 170, vx: 0, vy: 0, radius: 9, active: true },
    { id: 5, type: 'black', x: 180, y: 170, vx: 0, vy: 0, radius: 9, active: true },
    { id: 6, type: 'black', x: 160, y: 145, vx: 0, vy: 0, radius: 9, active: true },
    { id: 7, type: 'queen', x: 160, y: 160, vx: 0, vy: 0, radius: 9, active: true }
  ]);
  const strikerRef = React.useRef({ x: 160, y: 265, vx: 0, vy: 0, radius: 12, active: true });

  const [aimAngle, setAimAngle] = useState(0); // Aiming angle in degrees (-75 to 75)
  const [aimPower, setAimPower] = useState(70); // Shot power (10 to 100)
  const [isAimDragging, setIsAimDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle Cinematic Intro Automatic Slideshow
  useEffect(() => {
    if (currentPage === 'intro' && introStep >= 2 && introStep <= 6) {
      const timer = setTimeout(() => {
        setIntroStep((prev) => prev + 1);
      }, 3500); // 3.5 seconds per slide
      return () => clearTimeout(timer);
    }
  }, [currentPage, introStep]);

  // Auto-typing message simulation for WhatsApp chat inside chapters
  useEffect(() => {
    if (currentPage === 'main' && activeTab === 'scrapbook' && hasAcceptedStartGate && !showBanterBreak) {
      setVisibleChats(1);
      const activeChapterData = chapters.find(c => c.number === currentChapter);
      if (!activeChapterData) return;

      // If next chapter is already unlocked, or this is the last chapter, set chat finished
      if (unlockedChapters.includes(currentChapter + 1) || currentChapter === 9) {
        setChatAnimationFinished(true);
      } else {
        setChatAnimationFinished(false);
      }

      let timerPointer = 1;
      const interval = setInterval(() => {
        if (timerPointer < activeChapterData.chat.length) {
          setTypingIndex(timerPointer);
          setTimeout(() => {
            setVisibleChats((prev) => {
              const nextVal = prev + 1;
              if (nextVal >= activeChapterData.chat.length) {
                setChatAnimationFinished(true);
              }
              return nextVal;
            });
            setTypingIndex(-1);
          }, 1000);
          timerPointer++;
        } else {
          setChatAnimationFinished(true);
          clearInterval(interval);
        }
      }, 2500);

      return () => {
        clearInterval(interval);
        setTypingIndex(-1);
      };
    }
  }, [currentChapter, showBanterBreak, hasAcceptedStartGate, currentPage, activeTab, unlockedChapters]);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      audioSynth.stop();
      setIsAudioPlaying(false);
    } else {
      audioSynth.start();
      setIsAudioPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setAudioVolume(vol);
    audioSynth.setVolume(vol);
  };

  // Playful reactions when "No" is hovered or clicked in memory gates
  const handleNoButtonPlayful = (gateType: 'start' | 'memory') => {
    const playfulTexts = [
      "No skips allowed for my Best Friend! 👑",
      "You have to say YES to relive the memories! 🌸",
      "Nice try best friend! Please click Yes! ❤️",
      "Bade sayane keh ke gaye... click Yes only! 😂",
      "You can't escape these wonderful memories! 😜"
    ];
    setGateMessage(playfulTexts[noClicks % playfulTexts.length]);
    setNoClicks((prev) => prev + 1);

    // Random jump offsets
    const jumpX = (Math.random() - 0.5) * 160;
    const jumpY = (Math.random() - 0.5) * 160;
    setNoButtonOffset({ x: jumpX, y: jumpY });
  };

  // Start Gate "Yes" Trigger
  const handleAcceptStartGate = () => {
    audioSynth.playSparkle();
    audioSynth.start();
    setIsAudioPlaying(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981']
    });
    setHasAcceptedStartGate(true);
    setNoButtonOffset({ x: 0, y: 0 });
    setGateMessage('');
    setNoClicks(0);
  };

  // Banter Break transitions between chapters (Funny bestie jokes!)
  const triggerBanterBreak = (nextCh: number) => {
    setTargetChapter(nextCh);
    const randomIndex = Math.floor(Math.random() * bestieJokes.length);
    setActiveJokeIndex(randomIndex);
    setJokeRevealed(false);
    setShowBanterBreak(true);
    audioSynth.playSparkle();
  };

  const handleUnlockChapterClick = () => {
    if (buttonRunawayActive) return;

    if (!hasCompletedRunaway[currentChapter]) {
      // Start 5-second runaway animation
      setButtonRunawayActive(true);
      setButtonRunawayCountdown(5);
      
      const runawayMessages = [
        "Not so fast, best friend! Catch me! 🏃‍♀️💨",
        "Whoops! Missed me! 😂",
        "Over here! 😜",
        "Too slow! 🐢",
        "Try harder! 🙌✨"
      ];
      setButtonRunawayMessage(runawayMessages[0]);

      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 400;
        
        // Random offsets to move around the container area
        const rx = (Math.random() - 0.5) * 240;
        const ry = (Math.random() - 0.5) * 120;
        setButtonRunawayOffset({ x: rx, y: ry });
        
        // Random funny comment
        const msgIndex = Math.floor(Math.random() * runawayMessages.length);
        setButtonRunawayMessage(runawayMessages[msgIndex]);
        
        audioSynth.playSparkle();
      }, 400);

      const countdownInterval = setInterval(() => {
        setButtonRunawayCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            clearInterval(interval);
            setButtonRunawayActive(false);
            setButtonRunawayOffset({ x: 0, y: 0 });
            setHasCompletedRunaway(prevRunaways => ({ ...prevRunaways, [currentChapter]: true }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } else {
      // Open the Wholesome Funny Question Gate
      const questionIndex = (currentChapter - 1) % bestieQuestions.length;
      setActiveQuestionIndex(questionIndex);
      setSelectedQuestionOption(null);
      setShowQuestionFeedback(false);
      setShowQuestionGate(true);
      audioSynth.playSparkle();
    }
  };

  const handleNextChapterClick = () => {
    if (currentChapter < 9) {
      if (unlockedChapters.includes(currentChapter + 1)) {
        setCurrentChapter(prev => prev + 1);
        audioSynth.playSparkle();
      }
    }
  };

  const handlePrevChapterClick = () => {
    if (currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
      audioSynth.playSparkle();
    }
  };

  // Interactive Bestie Dance Stage Handlers
  const handleDanceFloorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Glide Girl to the clicked relative location directly
    setGirlPos({ x: x, y: y });

    // Instantly trigger a fun animation style
    const actions: ('spin' | 'flip' | 'slide')[] = ['spin', 'flip', 'slide'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    setGirlDanceAction(randomAction);
    setTimeout(() => {
      setGirlDanceAction('bob');
    }, 1000);

    // Create heart/star/sparkle particles
    const emojis = ['💖', '✨', '🎵', '🌸', '💫', '⭐', '💃'];
    const newParticles = Array.from({ length: 3 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: e.clientX - rect.left + (Math.random() - 0.5) * 40,
      y: e.clientY - rect.top + (Math.random() - 0.5) * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }));

    setDanceHearts(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setDanceHearts(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)));
    }, 1200);

    // Play sparkle audio tone
    audioSynth.playSparkle();
  };

  // Daily Vibe Oracle trigger
  const triggerVibeOracle = () => {
    if (vibeSpinning) return;
    setVibeSpinning(true);
    setVibeRevealed(false);
    audioSynth.playSparkle();
    
    // Quick fun spin delay
    setTimeout(() => {
      const vibes = [
        "CA Student Exam Survival Mode: Powered by caffeine and bestie's funny text spam! ☕📚",
        "Audit Partner Energy: Checking bestie's life decisions and finding 100% material misstatements! 🔍😂",
        "Carrom Champion Pro: Declaring victory before the game even starts and stealing the Queen! 🏆🍒",
        "Unstoppable Stand-up Comedy Duo: Laughing at our own jokes while everyone else is confused! 🤡✨",
        "The Tally Prime Wizard: Mastering Alt shortcuts but failing to decide what to order for dinner! 💻🍕",
        "No-Black-Pen Rule Enforcer: Confiscating illegal stationery with absolute bestie authority! ✍️🚫",
        "Alt+2 Ultimate Happiness: Duplicating joy and subtracting all the study stress! 📈🌈"
      ];
      const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
      setCurrentVibe(randomVibe);
      setVibeRevealed(true);
      setVibeSpinning(false);
      
      confetti({
        particleCount: 40,
        spread: 50,
        colors: ['#f472b6', '#c084fc', '#fbcfe8']
      });
    }, 1200);
  };

  // Sending virtual gratitude note
  const sendGratitudeNote = () => {
    if (!customLetter.trim() || letterSending) return;
    setLetterSending(true);
    audioSynth.playSparkle();

    setTimeout(() => {
      setLetterSending(false);
      setLetterSent(true);
      setCustomLetter('');
      
      confetti({
        particleCount: 60,
        spread: 60,
        colors: ['#ec4899', '#a855f7', '#fbbf24']
      });

      // Clear success banner after 6 seconds
      setTimeout(() => setLetterSent(false), 6000);
    }, 1500);
  };

  // Carrom Game simulation triggers & Physics loop
  const resetCarrom = () => {
    setCarromScore({ she: 0, trijal: 0 });
    setPocketedWhite(0);
    setPocketedBlack(0);
    const centerLayout = [
      { id: 1, type: 'white', x: 140, y: 150, vx: 0, vy: 0, radius: 9, active: true },
      { id: 2, type: 'white', x: 180, y: 150, vx: 0, vy: 0, radius: 9, active: true },
      { id: 3, type: 'white', x: 160, y: 175, vx: 0, vy: 0, radius: 9, active: true },
      { id: 4, type: 'black', x: 140, y: 170, vx: 0, vy: 0, radius: 9, active: true },
      { id: 5, type: 'black', x: 180, y: 170, vx: 0, vy: 0, radius: 9, active: true },
      { id: 6, type: 'black', x: 160, y: 145, vx: 0, vy: 0, radius: 9, active: true },
      { id: 7, type: 'queen', x: 160, y: 160, vx: 0, vy: 0, radius: 9, active: true }
    ];
    setCoinCoords(centerLayout);
    coinsRef.current = JSON.parse(JSON.stringify(centerLayout));

    strikerRef.current = { x: 160, y: 265, vx: 0, vy: 0, radius: 12, active: true };
    setStrikerPos(50);
    setAimAngle(0);
    setAimPower(70);

    setGameLog(["Carrom board reset! Best Friend's turn. Take aim! 🎯"]);
    setTurn('she');
    setGameStarted(true);
  };

  const playCarromShot = () => {
    if (strikerAnimating) return;
    setStrikerAnimating(true);

    const rad = (aimAngle * Math.PI) / 180;
    const speed = (aimPower / 100) * 15 + 3.5;

    strikerRef.current.active = true;
    strikerRef.current.x = (strikerPos / 100) * 320;
    strikerRef.current.y = 265;
    strikerRef.current.vx = Math.sin(rad) * speed;
    strikerRef.current.vy = -Math.cos(rad) * speed;
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (strikerAnimating || turn !== 'she') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const striker = strikerRef.current;
    const dx = x - striker.x;
    const dy = y - striker.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 35) {
      setIsAimDragging(true);
      setDragStart({ x: striker.x, y: striker.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isAimDragging || strikerAnimating || turn !== 'she') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dx = dragStart.x - x;
    const dy = dragStart.y - y;

    const angleRad = Math.atan2(dx, dy);
    const angleDeg = Math.round((angleRad * 180) / Math.PI);
    const boundedAngle = Math.max(-75, Math.min(75, angleDeg));
    setAimAngle(boundedAngle);

    const pullDist = Math.sqrt(dx * dx + dy * dy);
    const power = Math.max(10, Math.min(100, Math.round(pullDist * 0.95)));
    setAimPower(power);
  };

  const handleCanvasMouseUp = () => {
    if (isAimDragging) {
      setIsAimDragging(false);
      playCarromShot();
    }
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (strikerAnimating || turn !== 'she') return;
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const striker = strikerRef.current;
    const dx = x - striker.x;
    const dy = y - striker.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 35) {
      setIsAimDragging(true);
      setDragStart({ x: striker.x, y: striker.y });
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isAimDragging || strikerAnimating || turn !== 'she' || e.touches.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = dragStart.x - x;
    const dy = dragStart.y - y;

    const angleRad = Math.atan2(dx, dy);
    const angleDeg = Math.round((angleRad * 180) / Math.PI);
    const boundedAngle = Math.max(-75, Math.min(75, angleDeg));
    setAimAngle(boundedAngle);

    const pullDist = Math.sqrt(dx * dx + dy * dy);
    const power = Math.max(10, Math.min(100, Math.round(pullDist * 0.95)));
    setAimPower(power);
  };

  const handleCanvasTouchEnd = () => {
    if (isAimDragging) {
      setIsAimDragging(false);
      playCarromShot();
    }
  };

  // Sync striker horizontal position to ref in real time when not moving
  useEffect(() => {
    if (!strikerAnimating) {
      strikerRef.current.x = (strikerPos / 100) * 320;
      strikerRef.current.y = 265;
      strikerRef.current.vx = 0;
      strikerRef.current.vy = 0;
    }
  }, [strikerPos, strikerAnimating]);

  // Main canvas drawing & physics update loop
  useEffect(() => {
    let animationId: any = null;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pockets = [
      { x: 25, y: 25 },
      { x: 295, y: 25 },
      { x: 25, y: 295 },
      { x: 295, y: 295 }
    ];

    let pocketedThisTurn: any[] = [];
    let strikerSunk = false;

    const updatePhysics = () => {
      let isAnyObjectMoving = false;

      // Update striker physics
      const striker = strikerRef.current;
      if (striker.active && (Math.abs(striker.vx) > 0.01 || Math.abs(striker.vy) > 0.01)) {
        striker.x += striker.vx;
        striker.y += striker.vy;
        striker.vx *= 0.982;
        striker.vy *= 0.982;
        isAnyObjectMoving = true;

        // wall collisions
        if (striker.x - striker.radius < 20) {
          striker.x = 20 + striker.radius;
          striker.vx = -striker.vx * 0.85;
        }
        if (striker.x + striker.radius > 300) {
          striker.x = 300 - striker.radius;
          striker.vx = -striker.vx * 0.85;
        }
        if (striker.y - striker.radius < 20) {
          striker.y = 20 + striker.radius;
          striker.vy = -striker.vy * 0.85;
        }
        if (striker.y + striker.radius > 300) {
          striker.y = 300 - striker.radius;
          striker.vy = -striker.vy * 0.85;
        }

        // check pockets
        pockets.forEach(p => {
          const dx = striker.x - p.x;
          const dy = striker.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 14) {
            strikerSunk = true;
            striker.active = false;
            striker.vx = 0;
            striker.vy = 0;
          }
        });
      } else {
        striker.vx = 0;
        striker.vy = 0;
      }

      // Update coins physics
      coinsRef.current.forEach(coin => {
        if (!coin.active) return;
        if (Math.abs(coin.vx) > 0.01 || Math.abs(coin.vy) > 0.01) {
          coin.x += coin.vx;
          coin.y += coin.vy;
          coin.vx *= 0.985;
          coin.vy *= 0.985;
          isAnyObjectMoving = true;

          // wall collisions
          if (coin.x - coin.radius < 20) {
            coin.x = 20 + coin.radius;
            coin.vx = -coin.vx * 0.85;
          }
          if (coin.x + coin.radius > 300) {
            coin.x = 300 - coin.radius;
            coin.vx = -coin.vx * 0.85;
          }
          if (coin.y - coin.radius < 20) {
            coin.y = 20 + coin.radius;
            coin.vx = -coin.vx * 0.85;
          }
          if (coin.y + coin.radius > 300) {
            coin.y = 300 - coin.radius;
            coin.vy = -coin.vy * 0.85;
          }

          // check pocketed
          pockets.forEach(p => {
            const dx = coin.x - p.x;
            const dy = coin.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 14) {
              coin.active = false;
              coin.vx = 0;
              coin.vy = 0;
              pocketedThisTurn.push(coin);
            }
          });
        } else {
          coin.vx = 0;
          coin.vy = 0;
        }
      });

      // Circle collisions: Striker & Coins
      if (striker.active) {
        coinsRef.current.forEach(coin => {
          if (!coin.active) return;
          const dx = coin.x - striker.x;
          const dy = coin.y - striker.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = coin.radius + striker.radius;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            striker.x -= nx * overlap * 0.5;
            striker.y -= ny * overlap * 0.5;
            coin.x += nx * overlap * 0.5;
            coin.y += ny * overlap * 0.5;

            const rvx = coin.vx - striker.vx;
            const rvy = coin.vy - striker.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            if (velAlongNormal < 0) {
              const e = 0.82;
              const j = -(1 + e) * velAlongNormal / (1 / 1.8 + 1 / 1);
              striker.vx -= (j * nx) / 1.8;
              striker.vy -= (j * ny) / 1.8;
              coin.vx += j * nx;
              coin.vy += j * ny;
            }
          }
        });
      }

      // Circle collisions: Coin & Coin
      for (let i = 0; i < coinsRef.current.length; i++) {
        for (let j = i + 1; j < coinsRef.current.length; j++) {
          const c1 = coinsRef.current[i];
          const c2 = coinsRef.current[j];
          if (!c1.active || !c2.active) continue;

          const dx = c2.x - c1.x;
          const dy = c2.y - c1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = c1.radius + c2.radius;
          if (dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            c1.x -= nx * overlap * 0.5;
            c1.y -= ny * overlap * 0.5;
            c2.x += nx * overlap * 0.5;
            c2.y += ny * overlap * 0.5;

            const rvx = c2.vx - c1.vx;
            const rvy = c2.vy - c1.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            if (velAlongNormal < 0) {
              const e = 0.85;
              const j = -(1 + e) * velAlongNormal / (1 / 1 + 1 / 1);
              c1.vx -= j * nx;
              c1.vy -= j * ny;
              c2.vx += j * nx;
              c2.vy += j * ny;
            }
          }
        }
      }

      // Check stop
      if (strikerAnimating && !isAnyObjectMoving) {
        setStrikerAnimating(false);
        resolveTurnOutcome(pocketedThisTurn, strikerSunk);
        pocketedThisTurn = [];
        strikerSunk = false;
        return;
      }
    };

    const drawBoard = () => {
      ctx.clearRect(0, 0, 320, 320);
      ctx.fillStyle = '#dfb283';
      ctx.fillRect(0, 0, 320, 320);

      // outer lines
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, 20, 280, 280);
      ctx.strokeStyle = 'rgba(120,53,4,0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, 24, 272, 272);

      // Center
      ctx.beginPath();
      ctx.arc(160, 160, 48, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120,53,4,0.35)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(160, 160, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(120,53,4,0.5)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(160, 160, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      // Pockets
      pockets.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#111827';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Baselines
      ctx.beginPath();
      ctx.moveTo(45, 265);
      ctx.lineTo(275, 265);
      ctx.strokeStyle = 'rgba(120,53,4,0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(45, 265, 3.5, 0, Math.PI * 2);
      ctx.arc(275, 265, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(45, 55);
      ctx.lineTo(275, 55);
      ctx.strokeStyle = 'rgba(120,53,4,0.4)';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(45, 55, 3.5, 0, Math.PI * 2);
      ctx.arc(275, 55, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();

      // Coins
      coinsRef.current.forEach(coin => {
        if (!coin.active) return;
        ctx.beginPath();
        ctx.arc(coin.x + 1, coin.y + 1, coin.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        if (coin.type === 'white') {
          ctx.fillStyle = '#fef3c7';
          ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.radius - 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(217,119,6,0.5)';
          ctx.stroke();
        } else if (coin.type === 'black') {
          ctx.fillStyle = '#374151';
          ctx.fill();
          ctx.strokeStyle = '#111827';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.radius - 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.stroke();
        } else {
          ctx.fillStyle = '#ec4899';
          ctx.fill();
          ctx.strokeStyle = '#be123c';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.radius - 4, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
        }
      });

      // Striker
      const striker = strikerRef.current;
      if (striker.active) {
        ctx.beginPath();
        ctx.arc(striker.x + 1.5, striker.y + 1.5, striker.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fill();

        const grad = ctx.createRadialGradient(striker.x - 3, striker.y - 3, 2, striker.x, striker.y, striker.radius);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(0.4, '#ec4899');
        grad.addColorStop(1, '#a855f7');
        ctx.beginPath();
        ctx.arc(striker.x, striker.y, striker.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(striker.x, striker.y, striker.radius - 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Aiming laser guide line
      if (!strikerAnimating && striker.active && (turn === 'she' || isAimDragging)) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        const r = (aimAngle * Math.PI) / 180;
        const targetX = striker.x + Math.sin(r) * (aimPower * 2.2);
        const targetY = striker.y - Math.cos(r) * (aimPower * 2.2);

        ctx.moveTo(striker.x, striker.y);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = 'rgba(236,72,153,0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        // draw target crosshair dot
        ctx.beginPath();
        ctx.arc(targetX, targetY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ec4899';
        ctx.fill();
      }
    };

    const loop = () => {
      updatePhysics();
      drawBoard();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [strikerAnimating, aimAngle, aimPower, turn, isAimDragging]);

  const resolveTurnOutcome = (pocketed: any[], strikerSunk: boolean) => {
    // update persisting React coordinates to keep everything synchronized
    setCoinCoords([...coinsRef.current]);

    if (strikerSunk) {
      audioSynth.playSparkle();
      setCarromScore(s => {
        const key = turn === 'she' ? 'she' : 'trijal';
        return { ...s, [key]: Math.max(0, s[key] - 5) };
      });
      setGameLog(prev => [
        `⚠️ Foul! ${turn === 'she' ? "Best Friend" : "Trijal"} sank the striker! Loss of 5 points.`,
        ...prev
      ]);
    }

    if (pocketed.length > 0) {
      audioSynth.playSparkle();
      let whites = 0;
      let blacks = 0;
      let queen = false;

      pocketed.forEach(c => {
        if (c.type === 'white') {
          whites++;
          setPocketedWhite(p => p + 1);
          setCarromScore(s => ({ ...s, she: s.she + 10 }));
        } else if (c.type === 'black') {
          blacks++;
          setPocketedBlack(p => p + 1);
          setCarromScore(s => ({ ...s, trijal: s.trijal + 10 }));
        } else if (c.type === 'queen') {
          queen = true;
          setCarromScore(s => {
            const key = turn === 'she' ? 'she' : 'trijal';
            return { ...s, [key]: s[key] + 50 };
          });
        }
      });

      let logMsg = "";
      if (turn === 'she') {
        const randomQuote = carromQuotes[Math.floor(Math.random() * carromQuotes.length)];
        logMsg = `🎯 Best Friend: "${randomQuote}" Pocketed ${whites > 0 ? `${whites} White Coin(s)` : ''}${queen ? ' and the Pink Queen 👑' : ''}! +${whites * 10 + (queen ? 50 : 0)} pts`;
      } else {
        logMsg = `💻 Trijal shot a perfect strike and pocketed ${blacks > 0 ? `${blacks} Black Coin(s)` : ''}${queen ? ' and the Pink Queen 👑' : ''}! +${blacks * 10 + (queen ? 50 : 0)} pts`;
      }

      setGameLog(prev => [logMsg, ...prev]);

      confetti({
        particleCount: 45,
        spread: 55,
        colors: ['#a855f7', '#ec4899', '#fef08a']
      });
    } else {
      if (!strikerSunk) {
        if (turn === 'trijal') {
          const missLogs = [
            "Trijal miscalculated the bounce! Miss! 😭",
            "Trijal hit it way too light! Striker rolled to a stop halfway. 🐌",
            "Trijal's strike split the cluster beautifully but no coin went down! 🙈",
            "Friction got the best of Trijal's fine-cut shot. Stopped at the lip! 💀"
          ];
          setGameLog(prev => [`❌ Trijal: ${missLogs[Math.floor(Math.random() * missLogs.length)]}`, ...prev]);
        } else {
          setGameLog(prev => ["❌ Best Friend: Just missed a double-carom pocket! An incredible shot though!", ...prev]);
        }
      }
    }

    // Reset striker values
    strikerRef.current.active = true;
    strikerRef.current.x = 160;
    strikerRef.current.y = 265;
    strikerRef.current.vx = 0;
    strikerRef.current.vy = 0;

    // Shift turns
    setTurn(prev => (prev === 'she' ? 'trijal' : 'she'));
  };

  // Trijal's automated computer AI player
  useEffect(() => {
    if (activeTab === 'carrom' && turn === 'trijal' && !strikerAnimating && gameStarted) {
      const activeBlacks = coinsRef.current.filter(c => c.active && c.type === 'black');
      const targetCoin = activeBlacks.length > 0
        ? activeBlacks[Math.floor(Math.random() * activeBlacks.length)]
        : coinsRef.current.find(c => c.active && c.type === 'queen') || coinsRef.current.find(c => c.active);

      if (!targetCoin) {
        setGameLog(prev => ["No active coins left! Reset the board to play again! 🏆", ...prev]);
        return;
      }

      setGameLog(prev => ["Trijal is preparing his shot... Calculating angle 💻📐", ...prev]);

      // Pick a smart striker baseline position
      const idealStrikerX = 60 + Math.random() * 200;
      setStrikerPos(Math.round((idealStrikerX / 320) * 100));

      const dx = targetCoin.x - idealStrikerX;
      const dy = targetCoin.y - 265;
      const angleRad = Math.atan2(dx, -dy);
      
      // Let's add a slight random offset to simulate natural imperfect human-like play
      const errorAngle = (Math.random() - 0.5) * 8; // +/- 4 degrees
      const angleDeg = Math.max(-70, Math.min(70, Math.round((angleRad * 180) / Math.PI) + errorAngle));

      let curAngle = 0;
      let step = 0;
      const maxSteps = 12;

      const timer = setInterval(() => {
        curAngle += (angleDeg - curAngle) / 3;
        setAimAngle(Math.round(curAngle));
        step++;
        if (step >= maxSteps) {
          clearInterval(timer);

          setTimeout(() => {
            if (turn === 'trijal' && !strikerAnimating) {
              const power = 65 + Math.random() * 25;
              setAimPower(Math.round(power));
              setGameLog(prev => ["Trijal releases strike! 🚀", ...prev]);

              const finalAngleRad = (angleDeg * Math.PI) / 180;
              const speed = (power / 100) * 15 + 3.5;

              strikerRef.current.active = true;
              strikerRef.current.x = idealStrikerX;
              strikerRef.current.y = 265;
              strikerRef.current.vx = Math.sin(finalAngleRad) * speed;
              strikerRef.current.vy = -Math.cos(finalAngleRad) * speed;
              setStrikerAnimating(true);
            }
          }, 350);
        }
      }, 60);

      return () => clearInterval(timer);
    }
  }, [turn, strikerAnimating, activeTab, gameStarted]);

  const activeChapterData = chapters.find(c => c.number === currentChapter);

  return (
    <div className="relative min-h-screen text-slate-800 transition-all duration-1000 bg-gradient-to-tr from-amber-50/60 via-rose-50/50 to-indigo-50/60 overflow-x-hidden selection:bg-purple-200">
      
      {/* Background celestial glowing gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-[60%] right-[5%] w-44 h-44 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-[20%] left-[25%] w-48 h-48 bg-rose-200/35 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Slow drifting stars & magic sparkles */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-purple-300/30 rounded-full animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 12 + 10}s`
            }}
          />
        ))}
      </div>

      {/* Floating Audio Controller */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-purple-100">
        <button 
          onClick={toggleAudio}
          className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-600 transition-colors"
          title={isAudioPlaying ? "Pause calming melody" : "Play calming melody"}
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-purple-600 tracking-wider uppercase">Ambient Piano</span>
          <input 
            type="range" 
            min="0" 
            max="0.4" 
            step="0.01" 
            value={audioVolume} 
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
        </div>
      </div>

      {/* ==================== STAGE 1: CINEMATIC INTRO SCREEN ==================== */}
      <AnimatePresence>
        {currentPage === 'intro' && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white px-6 overflow-hidden select-none">
            {/* Ambient stars background */}
            <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:28px_28px]"></div>
            
            <AnimatePresence mode="wait">
              {/* STEP 0: TAP TO START / FLOATING TAGLINE */}
              {introStep === 0 && (
                <motion.div 
                  key="intro-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center z-10 flex flex-col items-center max-w-xl"
                >
                  <div className="mb-8 relative">
                    <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.7)] animate-bounce block">🦋</span>
                    <div className="absolute -inset-4 rounded-full bg-purple-500/10 blur-xl animate-pulse"></div>
                  </div>
                  
                  <h2 className="font-serif text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-amber-100 tracking-tight leading-snug">
                    Every friendship begins with a message.
                  </h2>
                  <h2 className="font-serif text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-pink-200 to-purple-300 tracking-tight leading-snug mt-2">
                    Ours became a story.
                  </h2>
                  
                  <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-4">
                    A 365-Day Milestone Commemoration
                  </p>

                  <motion.button
                    onClick={() => {
                      audioSynth.start();
                      setIsAudioPlaying(true);
                      setIntroStep(1); // Proceed to wing opening!
                      setTimeout(() => {
                        setIntroStep(2); // Start poem fades after wing opens
                      }, 1600);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-12 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 hover:from-purple-700 hover:to-rose-500 text-white font-bold px-8 py-4 rounded-full text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center gap-2 tracking-widest uppercase"
                  >
                    <Sparkles className="w-4 h-4 animate-pulse" /> Tap to Enter the Story
                  </motion.button>
                </motion.div>
              )}

              {/* STEP 1: WING OPENING TRANSITION */}
              {introStep === 1 && (
                <motion.div 
                  key="wing-open"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center z-20"
                >
                  <svg className="w-56 h-56 filter drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]" viewBox="0 0 100 100" fill="none">
                    {/* Left Wing */}
                    <motion.path 
                      d="M50,50 C20,10 5,30 5,55 C5,75 25,85 50,55 Z" 
                      fill="url(#left-wing-grad)"
                      animate={{ rotateY: -85, opacity: 0, x: -60, scale: 0.8 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ transformOrigin: "50px 50px" }}
                    />
                    {/* Right Wing */}
                    <motion.path 
                      d="M50,50 C80,10 95,30 95,55 C95,75 75,85 50,55 Z" 
                      fill="url(#right-wing-grad)"
                      animate={{ rotateY: 85, opacity: 0, x: 60, scale: 0.8 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ transformOrigin: "50px 50px" }}
                    />
                    {/* Antennae */}
                    <motion.path 
                      d="M50,50 Q45,25 40,20 M50,50 Q55,25 60,20" 
                      stroke="#ec4899" 
                      strokeWidth="2"
                      animate={{ scaleY: 0, opacity: 0 }}
                      transition={{ duration: 1.2 }}
                    />
                    <defs>
                      <linearGradient id="left-wing-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                      <linearGradient id="right-wing-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase mt-4 animate-ping">
                    Unfolding...
                  </span>
                </motion.div>
              )}

              {/* STEP 2: POEM 1 */}
              {introStep === 2 && (
                <motion.h2 
                  key="poem-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2 }}
                  className="font-serif text-3xl md:text-5xl font-extralight tracking-wide text-slate-100 italic text-center max-w-xl"
                >
                  "Some stories are written in books."
                </motion.h2>
              )}

              {/* STEP 3: POEM 2 */}
              {introStep === 3 && (
                <motion.h2 
                  key="poem-2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2 }}
                  className="font-serif text-3xl md:text-5xl font-extralight tracking-wide text-slate-100 italic text-center max-w-xl"
                >
                  "Some are written in memories."
                </motion.h2>
              )}

              {/* STEP 4: POEM 3 */}
              {introStep === 4 && (
                <motion.h2 
                  key="poem-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2 }}
                  className="font-serif text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-200 tracking-wider text-center max-w-xl"
                >
                  "Ours..."
                </motion.h2>
              )}

              {/* STEP 5: POEM 4 */}
              {introStep === 5 && (
                <motion.h2 
                  key="poem-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 1.2 }}
                  className="font-serif text-3xl md:text-5xl font-extralight tracking-wide text-slate-100 italic text-center max-w-xl"
                >
                  "Started with one message."
                </motion.h2>
              )}

              {/* STEP 6: DATE FOCUS */}
              {introStep === 6 && (
                <motion.div 
                  key="poem-5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.5 }}
                  className="text-center"
                >
                  <span className="text-pink-400 text-xs font-mono uppercase tracking-widest block mb-2">The Magical Spark</span>
                  <h1 className="font-serif text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 filter drop-shadow-[0_0_20px_rgba(245,158,11,0.4)] tracking-wider">
                    29 June 2025
                  </h1>
                </motion.div>
              )}

              {/* STEP 7: ARE YOU READY QUESTION GATE */}
              {introStep === 7 && (
                <motion.div
                  key="question-gate"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-neutral-900 p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-neutral-800 text-center relative overflow-hidden max-w-lg mx-auto"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500"></div>
                  
                  <span className="text-5xl mb-6 block animate-bounce">🎬🌸</span>
                  
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-neutral-100 leading-tight px-4">
                    Are you ready to relive small memorable parts of Our One year Journey?
                  </h3>
                  <p className="text-xs text-neutral-400 font-serif italic mt-3">
                    Take a beautiful step back in time with your best friend Trijal.
                  </p>

                  {gateMessage && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-purple-400 font-bold mt-5 bg-purple-950/40 py-1.5 px-3.5 rounded-xl inline-block border border-purple-900/40"
                    >
                      {gateMessage}
                    </motion.p>
                  )}

                  <div className="flex gap-4 justify-center items-center mt-10 h-16 relative">
                    <button 
                      onClick={() => {
                        audioSynth.playSparkle();
                        audioSynth.start();
                        setIsAudioPlaying(true);
                        confetti({
                          particleCount: 150,
                          spread: 80,
                          origin: { y: 0.6 },
                          colors: ['#a855f7', '#ec4899', '#3b82f6', '#eab308']
                        });
                        setHasAcceptedStartGate(true);
                        setCurrentPage('main');
                        setActiveTab('timeline'); // Start on timeline
                        setNoButtonOffset({ x: 0, y: 0 });
                        setGateMessage('');
                        setNoClicks(0);
                      }}
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-xs flex items-center gap-2 cursor-pointer z-10"
                    >
                      Yes, absolutely! ❤️
                    </button>

                    <motion.button 
                      animate={{ x: noButtonOffset.x, y: noButtonOffset.y }}
                      onMouseEnter={() => handleNoButtonPlayful('start')}
                      onClick={() => handleNoButtonPlayful('start')}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 font-semibold py-3 px-6 rounded-2xl transition-all text-xs absolute z-0 cursor-pointer border border-neutral-700"
                    >
                      No 🙈
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== STAGE 3: MAIN APP CONTAINER ==================== */}
      {currentPage === 'main' && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          
          {/* Main App Title */}
          <header className="text-center mb-10">
            <span className="bg-purple-100/80 text-purple-700 font-bold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border border-purple-200/50 shadow-sm">
              One-Year Best Friendship Milestone
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tight">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500">STORY</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-serif italic mt-1.5">
              Celebrating a solid, respectful, and pure best friendship — 29 June 2025 → 29 June 2026
            </p>
          </header>

          {/* Navigation Tabs (Timeline vs Scrapbook Memories vs Game Centre) */}
          <div className="flex justify-center gap-3 mb-10 max-w-lg mx-auto bg-white/70 backdrop-blur-md p-1.5 rounded-full border border-purple-100 shadow-sm">
            <button
              onClick={() => {
                setActiveTab('timeline');
                audioSynth.playSparkle();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'timeline' 
                  ? 'bg-gradient-to-r from-purple-500 to-rose-400 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Timeline
            </button>
            <button
              onClick={() => {
                setActiveTab('scrapbook');
                audioSynth.playSparkle();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'scrapbook' 
                  ? 'bg-gradient-to-r from-purple-500 to-rose-400 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Scrapbook
            </button>
            <button
              onClick={() => {
                setActiveTab('carrom');
                setGameStarted(true);
                audioSynth.playSparkle();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'carrom' 
                  ? 'bg-gradient-to-r from-purple-500 to-rose-400 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Gamepad2 className="w-4 h-4" /> Bestie Zone
            </button>
          </div>

          <div className="min-h-[550px]">
            <AnimatePresence mode="wait">

              {/* TAB 0: TIMELINE JOURNEY */}
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-5xl mx-auto"
                >
                  <motion.div 
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut"
                    }}
                    className="relative bg-white/70 backdrop-blur-md border border-purple-100 p-8 rounded-[2.5rem] shadow-xl overflow-hidden mb-8"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 rounded-full blur-3xl pointer-events-none"></div>
                    
                    {/* Horizontal Timeline Track */}
                    <div className="relative flex items-center justify-between my-8 px-4 overflow-x-auto no-scrollbar py-6 gap-6">
                      {/* Background Line */}
                      <div className="absolute left-10 right-10 top-1/2 h-1 bg-gradient-to-r from-blue-300 via-pink-300 to-yellow-300 -translate-y-1/2 z-0 min-w-[700px]" />
                      
                      {/* Interactive Nodes */}
                      {timelineEvents.map((evt, idx) => {
                        const isSelected = activeTimelineId === evt.id;
                        return (
                          <motion.div 
                            key={evt.id} 
                            initial={{ opacity: 0, y: 35 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.08, type: "spring", stiffness: 100 }}
                            className="relative z-10 flex flex-col items-center flex-shrink-0 cursor-pointer min-w-[80px]" 
                            onClick={() => {
                              setActiveTimelineId(evt.id);
                              audioSynth.playSparkle();
                            }}
                          >
                            {/* Node Date above */}
                            <span className={`text-[9px] font-mono font-bold mb-3 transition-colors block h-4 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`}>
                              {evt.date}
                            </span>
                            
                            {/* Node Circle */}
                            <motion.div
                              animate={{
                                scale: isSelected ? 1.3 : 1,
                                backgroundColor: isSelected ? "#c084fc" : "#ffffff",
                                boxShadow: isSelected ? "0 0 15px rgba(168,85,247,0.5)" : "0 2px 5px rgba(0,0,0,0.05)"
                              }}
                              whileHover={{ scale: 1.15 }}
                              className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-xl ${isSelected ? 'border-purple-300' : 'border-slate-200'}`}
                            >
                              {evt.emoji}
                            </motion.div>
                            
                            {/* Node Title below */}
                            <span className={`text-[10px] font-serif font-black mt-3 transition-colors text-center block h-8 leading-tight ${isSelected ? 'text-slate-950' : 'text-slate-500'}`}>
                              {evt.title}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Horizontal Helper Line */}
                    <div className="flex justify-between items-center text-slate-400 text-[9px] font-semibold tracking-wider font-mono px-4 mt-2 mb-4 border-t pt-4 border-slate-100">
                      <span>← Swipe / Scroll horizontally to explore ←</span>
                      <span>2025 • One Year Bond • 2026</span>
                    </div>

                    {/* Active Event Expanded Card */}
                    {(() => {
                      const activeEvent = timelineEvents.find(e => e.id === activeTimelineId) || timelineEvents[0];
                      return (
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeEvent.id}
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-tr from-slate-50/50 to-white p-6 md:p-8 rounded-3xl border border-purple-100/60 shadow-inner mt-4"
                          >
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                              {/* Visual Badge */}
                              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${activeEvent.color} flex items-center justify-center text-4xl shadow-md flex-shrink-0`}>
                                {activeEvent.emoji}
                              </div>
                              
                              {/* Description Text */}
                              <div className="flex-1 text-center md:text-left">
                                <span className="text-[10px] font-mono font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                                  {activeEvent.date} • Milestone {activeEvent.id}
                                </span>
                                <h3 className="font-serif text-2xl font-black text-slate-800 mt-2.5">
                                  {activeEvent.title}
                                </h3>
                                <p className="text-xs font-mono text-pink-500 uppercase tracking-wider font-semibold mt-1">
                                  {activeEvent.subtitle}
                                </p>
                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-serif italic mt-3 border-l-2 border-pink-200 pl-3 py-1 bg-pink-50/20 rounded-r-xl">
                                  "{activeEvent.description}"
                                </p>
                                
                                {/* Interactive Chapter Quicklink */}
                                {activeEvent.chapterLink && (
                                  <button
                                    onClick={() => {
                                      if (unlockedChapters.includes(activeEvent.chapterLink!)) {
                                        setCurrentChapter(activeEvent.chapterLink!);
                                        setActiveTab('scrapbook');
                                        audioSynth.playSparkle();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      } else {
                                        setGateMessage(`Best Friend! Chapter ${activeEvent.chapterLink} is currently locked. Read through the previous chapters and complete the fun bestie questions to unlock it! 🌸`);
                                        setActiveTab('scrapbook');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      }
                                    }}
                                    className="mt-5 inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-xl text-xs border border-purple-200 shadow-sm transition-all cursor-pointer"
                                  >
                                    <BookOpen className="w-3.5 h-3.5" /> Open Scrapbook Diaries (Chapter {activeEvent.chapterLink})
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      );
                    })()}
                  </motion.div>
                </motion.div>
              )}
              
              {/* TAB 1: SCRAPBOOK WITH STEP-BY-STEP LOCKING */}
              {activeTab === 'scrapbook' && (
                <motion.div
                  key="scrapbook-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-3xl mx-auto"
                >
                  
                  {/* Gatekeeper Question Modals */}
                  <AnimatePresence mode="wait">
                    
                    {/* GATE 1: START GATE (BEFORE DISPLAYING CHAPTER 1) */}
                    {!hasAcceptedStartGate ? (
                      <motion.div
                        key="start-gate"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white/85 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl border border-purple-100 text-center relative overflow-hidden my-6 max-w-lg mx-auto"
                      >
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-400 via-rose-400 to-amber-300"></div>
                        <span className="text-4xl mb-6 block animate-bounce">🎬🌸</span>
                        
                        <h3 className="font-serif text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                          Are you ready to relive small yet memorable parts of our one-year journey?
                        </h3>
                        <p className="text-xs text-slate-400 font-serif italic mt-2">
                          Take a step back in time with your best friend Trijal.
                        </p>

                        {gateMessage && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-purple-600 font-bold mt-4 bg-purple-50/80 py-1.5 px-3 rounded-xl inline-block border border-purple-100"
                          >
                            {gateMessage}
                          </motion.p>
                        )}

                        <div className="flex gap-4 justify-center items-center mt-8 h-16 relative">
                          <button 
                            onClick={handleAcceptStartGate}
                            className="bg-gradient-to-r from-purple-500 to-rose-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-sm flex items-center gap-2 cursor-pointer z-10"
                          >
                            Yes, absolutely! ❤️
                          </button>

                          <motion.button 
                            animate={{ x: noButtonOffset.x, y: noButtonOffset.y }}
                            onMouseEnter={() => handleNoButtonPlayful('start')}
                            onClick={() => handleNoButtonPlayful('start')}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-6 rounded-2xl transition-all text-xs absolute z-0 cursor-pointer"
                          >
                            No 🙈
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : showQuestionGate ? (
                      
                      // THE FUNNY TALKING QUESTIONS GATE MODAL
                      <motion.div
                        key="question-gate"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-2 border-purple-200/80 text-center relative overflow-hidden my-6 max-w-lg mx-auto"
                      >
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300"></div>
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-100/50 rounded-full blur-2xl"></div>
                        
                        <span className="text-5xl mb-4 block animate-bounce">
                          💬🎓
                        </span>
                        
                        <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-purple-200/50">
                          🌸 Best Friend Trivia Challenge 🌸
                        </span>

                        <h3 className="font-serif text-xl md:text-2xl font-black text-slate-800 leading-tight mt-6 px-2">
                          {bestieQuestions[activeQuestionIndex].question}
                        </h3>

                        <div className="mt-8 space-y-3.5 text-left">
                          {bestieQuestions[activeQuestionIndex].options.map((opt, oIdx) => {
                            const isSelected = selectedQuestionOption === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  setSelectedQuestionOption(oIdx);
                                  setShowQuestionFeedback(true);
                                  audioSynth.playSparkle();
                                  confetti({
                                    particleCount: 15,
                                    spread: 20,
                                    colors: ['#a855f7', '#ec4899']
                                  });
                                }}
                                disabled={showQuestionFeedback}
                                className={`w-full p-4 rounded-2xl text-xs font-serif font-semibold border-2 transition-all flex items-center justify-between text-left cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-50 border-purple-400 text-purple-900 shadow-sm"
                                    : "bg-slate-50 border-slate-100 hover:bg-slate-100/50 text-slate-700"
                                }`}
                              >
                                <span className="flex-1 pr-3">{opt}</span>
                                <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        <AnimatePresence>
                          {showQuestionFeedback && (
                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 p-5 bg-purple-50 border-2 border-dashed border-purple-100 rounded-2xl text-left"
                            >
                              <p className="text-xs font-serif font-bold text-purple-800 leading-relaxed italic">
                                "{bestieQuestions[activeQuestionIndex].correctResponse}"
                              </p>

                              <button
                                onClick={() => {
                                  const nextCh = currentChapter + 1;
                                  // Add next chapter to unlocked chapters list
                                  setUnlockedChapters(prev => {
                                    if (prev.includes(nextCh)) return prev;
                                    return [...prev, nextCh];
                                  });
                                  setShowQuestionGate(false);
                                  // Trigger the funny banter break before switching chapter
                                  triggerBanterBreak(nextCh);
                                }}
                                className="mt-5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 hover:from-purple-600 hover:to-rose-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                Absolutely, let's unlock! 🚀
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : showBanterBreak ? (
                      
                      // BANTER BREAK: FUNNY INTERACTIVE BESTIE JOKES
                      <motion.div
                        key="banter-break"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-2 border-pink-200/60 text-center relative overflow-hidden my-6 max-w-lg mx-auto"
                      >
                        {/* Decorative sparkles & flowers */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-300"></div>
                        <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-100/50 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-100/50 rounded-full blur-2xl"></div>

                        <span className="text-5xl mb-6 block animate-bounce">
                          {bestieJokes[activeJokeIndex].emoji}
                        </span>
                        
                        <span className="bg-pink-100/80 text-pink-700 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border border-pink-200/50">
                          🌸 Bestie Banter Break! 🌸
                        </span>

                        <h3 className="font-serif text-2xl font-bold text-slate-800 leading-tight mt-6 px-2">
                          {bestieJokes[activeJokeIndex].setup}
                        </h3>

                        <AnimatePresence mode="wait">
                          {!jokeRevealed ? (
                            <motion.button
                              key="reveal-btn"
                              onClick={() => {
                                setJokeRevealed(true);
                                audioSynth.playSparkle();
                                confetti({
                                  particleCount: 20,
                                  spread: 30,
                                  colors: ['#f472b6', '#a78bfa']
                                });
                              }}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="mt-8 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold py-3.5 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2 mx-auto cursor-pointer border border-pink-300/30"
                            >
                              Click to Reveal Bestie Punchline! 🤔✨
                            </motion.button>
                          ) : (
                            <motion.div
                              key="punchline-text"
                              initial={{ opacity: 0, y: 15, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              className="mt-8 p-6 bg-gradient-to-tr from-pink-50/50 to-purple-50/50 border-2 border-dashed border-pink-200 rounded-2xl"
                            >
                              <p className="text-sm font-serif font-black text-pink-700 leading-relaxed italic">
                                "{bestieJokes[activeJokeIndex].punchline}"
                              </p>

                              <button
                                onClick={() => {
                                  setCurrentChapter(targetChapter);
                                  setShowBanterBreak(false);
                                  confetti({
                                    particleCount: 60,
                                    spread: 60,
                                    origin: { y: 0.65 },
                                    colors: ['#f472b6', '#ec4899', '#c084fc']
                                  });
                                }}
                                className="mt-6 w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                Haha, let's unlock Chapter {targetChapter}! 😂🚀
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      
                      // Active Chapter Layout
                      <motion.div
                        key="chapter-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                      >
                        
                        {/* Chapter Header Tracker */}
                        <div className="flex items-center justify-between bg-white/50 px-4 py-3 rounded-full border border-purple-100/50 shadow-sm max-w-md mx-auto">
                          <button
                            onClick={handlePrevChapterClick}
                            disabled={currentChapter === 1}
                            className={`p-2 rounded-full transition-colors ${currentChapter === 1 ? 'text-slate-300' : 'text-purple-600 hover:bg-purple-50 cursor-pointer'}`}
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Chapter {currentChapter} of 9
                          </span>
                          
                          <button
                            onClick={handleNextChapterClick}
                            disabled={currentChapter === 9 || !unlockedChapters.includes(currentChapter)}
                            className={`p-2 rounded-full transition-colors ${currentChapter === 9 || !unlockedChapters.includes(currentChapter) ? 'text-slate-300' : 'text-purple-600 hover:bg-purple-50 cursor-pointer'}`}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Polaroid Scrapbook Page */}
                        <div className="bg-[#fcfbf9] p-6 md:p-10 rounded-[2rem] shadow-xl border border-slate-200/50 relative">
                          <div className="absolute top-6 right-6 text-3xl opacity-20">{activeChapterData?.illustration}</div>
                          
                          {/* Inner Header */}
                          <div className="mb-6">
                            <span className="text-purple-600 font-mono text-[10px] tracking-widest uppercase font-bold">
                              {activeChapterData?.subtitle}
                            </span>
                            <h2 className="font-serif text-2xl md:text-3.5xl font-bold text-slate-900 mt-1">
                              {activeChapterData?.title}
                            </h2>
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-rose-400 mt-3 rounded-full"></div>
                          </div>

                          {/* Narrative text */}
                          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-serif italic mb-8 border-l-2 border-purple-200 pl-4 bg-purple-50/30 py-3 rounded-r-2xl">
                            "{activeChapterData?.narrative}"
                          </p>

                          {/* Recreated Authentic Chat box */}
                          <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 max-w-xl mx-auto">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3.5 mb-4">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              
                              {/* profile image (DP) as uploaded by user */}
                              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-pink-300 bg-gradient-to-tr from-pink-300 via-rose-300 to-purple-400 flex items-center justify-center shrink-0 shadow-sm">
                                <img 
                                  src="/assets/bestfriend_dp.png" 
                                  alt="Best Friend" 
                                  onError={(e) => {
                                    // Hide image on error, display beautiful emoji fallback
                                    e.currentTarget.style.display = 'none';
                                    if (e.currentTarget.nextElementSibling) {
                                      e.currentTarget.nextElementSibling.classList.remove('hidden');
                                    }
                                  }}
                                  className="w-full h-full object-cover"
                                />
                                <div className="hidden absolute inset-0 bg-gradient-to-tr from-pink-300 via-rose-300 to-purple-400 flex items-center justify-center text-sm font-bold text-white select-none">
                                  👑🌸
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold text-xs text-slate-800">Best Friend</h4>
                                <p className="text-[9px] text-slate-400">Authentic Chat History</p>
                              </div>
                            </div>

                            {/* Chat bubble messages list */}
                            <div className="bg-[#f5ebd7]/50 rounded-2xl p-4 space-y-3.5 max-h-[350px] overflow-y-auto relative min-h-[200px]">
                              {activeChapterData?.chat.slice(0, visibleChats).map((msg, mIdx) => (
                                <motion.div
                                  key={mIdx}
                                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  className={`flex flex-col max-w-[85%] ${msg.sender === 'Trijal' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                >
                                  <div className={`p-3 rounded-xl text-xs relative shadow-sm ${
                                    msg.sender === 'Trijal' 
                                      ? 'bg-[#e7fedb] text-slate-800 rounded-tr-none' 
                                      : 'bg-white text-slate-800 rounded-tl-none'
                                  }`}>
                                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                                    
                                    {msg.reactions && (
                                      <div className="absolute -bottom-2.5 right-1.5 bg-white shadow rounded-full px-1 py-0.5 text-[9px] border border-slate-100">
                                        {msg.reactions.join('')}
                                      </div>
                                    )}
                                    <span className="text-[8px] text-slate-400 block text-right mt-1 font-mono">{msg.time}</span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 mt-1 font-semibold capitalize">
                                    {msg.sender === 'Trijal' ? 'Trijal' : 'Best Friend'}
                                  </span>
                                </motion.div>
                              ))}

                              {/* Typing simulator */}
                              {typingIndex !== -1 && (
                                <div className="flex gap-1 items-center bg-white py-1.5 px-3 rounded-xl shadow-sm max-w-[80px] rounded-tl-none">
                                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-100"></span>
                                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-200"></span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Navigation action bar */}
                          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-mono">Respectful best-friendship</span>
                            
                            {currentChapter < 9 ? (
                              <div className="relative">
                                {!chatAnimationFinished ? (
                                  <div className="bg-slate-100 border border-slate-200 text-slate-400 font-semibold py-2.5 px-6 rounded-full text-xs flex items-center gap-2 select-none animate-pulse">
                                    <Lock className="w-3.5 h-3.5" /> Reading Chat Diaries... 💬
                                  </div>
                                ) : !unlockedChapters.includes(currentChapter + 1) ? (
                                  <motion.button
                                    onClick={handleUnlockChapterClick}
                                    style={{
                                      x: buttonRunawayOffset.x,
                                      y: buttonRunawayOffset.y,
                                      position: buttonRunawayActive ? 'fixed' : 'relative',
                                      zIndex: buttonRunawayActive ? 999 : 10,
                                      bottom: buttonRunawayActive ? '10%' : 'auto',
                                      left: buttonRunawayActive ? '40%' : 'auto',
                                    }}
                                    transition={{ type: "spring", stiffness: 120, damping: 10 }}
                                    className={`font-bold py-2.5 px-6 rounded-full text-xs shadow-md cursor-pointer flex items-center gap-1.5 transition-all ${
                                      buttonRunawayActive
                                        ? "bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 text-white scale-110 shadow-lg border-2 border-white ring-4 ring-pink-100"
                                        : "bg-gradient-to-r from-amber-500 to-orange-400 text-white hover:shadow-lg"
                                    }`}
                                  >
                                    {buttonRunawayActive ? (
                                      <span>{buttonRunawayMessage} ({buttonRunawayCountdown}s) 😜💨</span>
                                    ) : (
                                      <span>Unlock Chapter {currentChapter + 1} 🔓✨</span>
                                    )}
                                  </motion.button>
                                ) : (
                                  <button
                                    onClick={handleNextChapterClick}
                                    className="bg-gradient-to-r from-purple-500 to-rose-400 text-white font-bold py-2.5 px-6 rounded-full text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                                  >
                                    Next Chapter {currentChapter + 1} <ChevronRight className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                ✔ All standard chapters unlocked!
                              </span>
                            )}
                          </div>
                        </div>

                        {/* ==================== THE FANCY & BEAUTIFUL GIRL-THEMED HIGHLIGHTS ==================== */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto my-8">
                          
                          {/* FEATURE 1: INTERACTIVE BESTIE DANCE STAGE */}
                          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border-2 border-pink-100 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100/30 rounded-full blur-2xl pointer-events-none"></div>
                            
                            <div className="flex items-center gap-2 border-b border-pink-100 pb-3 mb-4">
                              <span className="text-2xl animate-pulse">💃✨</span>
                              <div>
                                <h4 className="font-serif font-black text-sm text-slate-800">Bestie's Dream Dance Stage</h4>
                                <p className="text-[10px] text-pink-600 font-semibold uppercase tracking-wider">No buttons! Click stage to make her dance 🌟</p>
                              </div>
                            </div>

                            {/* Dance floor container */}
                            <div 
                              onClick={handleDanceFloorClick}
                              className="relative w-full h-48 bg-gradient-to-tr from-pink-50/70 via-rose-50/40 to-purple-50/70 rounded-2xl border-2 border-dashed border-pink-200 shadow-inner overflow-hidden cursor-pointer flex items-center justify-center select-none"
                            >
                              {/* Glowing dance tiles in background */}
                              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 opacity-25 pointer-events-none p-2">
                                {[...Array(16)].map((_, i) => (
                                  <div key={i} className="bg-gradient-to-tr from-pink-200 to-purple-200 rounded-lg animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                              </div>

                              {/* Floating Sparkle Particles on click */}
                              <AnimatePresence>
                                {danceHearts.map((heart) => (
                                  <motion.div
                                    key={heart.id}
                                    initial={{ opacity: 1, scale: 0.5, y: 0 }}
                                    animate={{ opacity: 0, scale: 1.5, y: -40, rotate: 15 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                    className="absolute text-xl pointer-events-none z-10"
                                    style={{ left: heart.x, top: heart.y }}
                                  >
                                    {heart.emoji}
                                  </motion.div>
                                ))}
                              </AnimatePresence>

                              {/* GIRL DANCER (ONLY SHE DANCES!) */}
                              <motion.div
                                animate={{
                                  x: girlPos.x,
                                  y: girlPos.y,
                                  rotate: girlDanceAction === 'spin' ? [0, -360] : girlDanceAction === 'flip' ? [0, 15, -15, 0] : [5, -5, 5],
                                  scaleY: girlDanceAction === 'slide' ? [1, 0.85, 1.1, 1] : [1, 0.96, 1.04, 1],
                                }}
                                transition={{
                                  x: { type: 'spring', stiffness: 120, damping: 14 },
                                  y: { type: 'spring', stiffness: 120, damping: 14 },
                                  rotate: girlDanceAction === 'bob' ? { repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.1 } : { duration: 0.8 },
                                  scaleY: { repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }
                                }}
                                className="absolute flex flex-col items-center select-none"
                              >
                                <span className="text-4xl filter drop-shadow">👧🏻💃</span>
                                <span className="bg-pink-100/90 text-pink-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1 border border-pink-200">Bestie</span>
                              </motion.div>
                            </div>

                            <p className="text-[10px] text-slate-400 mt-3 text-center italic">
                              Click any spot on the stage to make your Best Friend glide, spin, and dance gracefully! 🎶🌸
                            </p>
                          </div>

                          {/* FEATURE 2: DAILY BESTIE VIBE ORACLE */}
                          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl border-2 border-purple-100 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/30 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="flex items-center gap-2 border-b border-purple-100 pb-3 mb-4">
                              <span className="text-2xl animate-pulse">🔮🌸</span>
                              <div>
                                <h4 className="font-serif font-black text-sm text-slate-800">Bestie Daily Vibe Oracle</h4>
                                <p className="text-[10px] text-purple-600 font-semibold uppercase tracking-wider">Tap to reveal our friendship vibe</p>
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center py-4">
                              <motion.button
                                onClick={triggerVibeOracle}
                                disabled={vibeSpinning}
                                animate={vibeSpinning ? { rotate: 360 } : {}}
                                transition={vibeSpinning ? { repeat: Infinity, duration: 0.5, ease: "linear" } : {}}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-purple-500 flex items-center justify-center text-3xl shadow-lg border-2 border-white cursor-pointer"
                              >
                                {vibeSpinning ? '🌀' : '🔮'}
                              </motion.button>

                              <AnimatePresence mode="wait">
                                {vibeRevealed ? (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-4 p-3 bg-pink-50/60 border border-pink-200 rounded-2xl text-center max-w-[240px]"
                                  >
                                    <span className="text-[9px] font-bold text-pink-500 uppercase tracking-widest block mb-1">Today's Harmony</span>
                                    <p className="text-xs font-semibold text-slate-700 leading-normal">{currentVibe}</p>
                                  </motion.div>
                                ) : (
                                  <p className="text-xs text-slate-400 mt-4 text-center italic">
                                    {vibeSpinning ? 'Consulting the celestial shortcut ledger...' : 'Tap the magic crystal ball to retrieve today\'s vibe! ✨'}
                                  </p>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                        </div>

                        {/* FEATURE 3: CHICK LITERARY LETTERBOX / GRATITUDE DIARY */}
                        <div className="bg-white/85 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-xl border-2 border-pink-200 max-w-xl mx-auto my-4 relative overflow-hidden">
                          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-300 via-rose-350 to-purple-400"></div>
                          
                          <div className="flex items-center gap-2 border-b border-pink-50 pb-3.5 mb-4">
                            <span className="text-2xl">💌</span>
                            <div>
                              <h4 className="font-serif font-black text-sm text-slate-800">Bestie Daily Gratitude Letterbox</h4>
                              <p className="text-[10px] text-pink-600 font-semibold uppercase tracking-wider">Type a warm note & watch it float to the stars</p>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Theme selector */}
                            <div className="flex gap-2 justify-center">
                              <button 
                                onClick={() => setSelectedPaperTheme('sakura')} 
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
                                  selectedPaperTheme === 'sakura' 
                                    ? 'bg-pink-100 text-pink-700 border-pink-300 shadow-sm' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}
                              >
                                🌸 Sakura Pink
                              </button>
                              <button 
                                onClick={() => setSelectedPaperTheme('lavender')} 
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
                                  selectedPaperTheme === 'lavender' 
                                    ? 'bg-purple-100 text-purple-700 border-purple-300 shadow-sm' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}
                              >
                                🪻 Lavender Dream
                              </button>
                              <button 
                                onClick={() => setSelectedPaperTheme('amber')} 
                                className={`px-2.5 py-1 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
                                  selectedPaperTheme === 'amber' 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' 
                                    : 'bg-slate-50 text-slate-400 border-slate-100'
                                }`}
                              >
                                ☀️ Golden Amber
                              </button>
                            </div>

                            {/* Notepad */}
                            <div className={`p-4 rounded-2xl border-2 border-dashed shadow-inner transition-colors duration-500 ${
                              selectedPaperTheme === 'sakura' 
                                ? 'bg-[#fdf2f8]/70 border-pink-200' 
                                : selectedPaperTheme === 'lavender' 
                                  ? 'bg-[#faf5ff]/70 border-purple-200' 
                                  : 'bg-[#fffbeb]/70 border-amber-200'
                            }`}>
                              <textarea
                                value={customLetter}
                                onChange={(e) => setCustomLetter(e.target.value)}
                                placeholder="Write down something you're grateful for about your best friend... (Avoid using a virtual black pen! 😜🖋️)"
                                className="w-full h-20 bg-transparent border-none outline-none resize-none font-serif text-xs text-slate-700 leading-relaxed placeholder-slate-400/80"
                                maxLength={280}
                              />
                              <div className="text-right text-[8px] text-slate-400 font-mono">
                                {customLetter.length}/280 Characters
                              </div>
                            </div>

                            {/* Action Button */}
                            <button
                              onClick={sendGratitudeNote}
                              disabled={!customLetter.trim() || letterSending}
                              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-40 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {letterSending ? '✨ Sending Note Upward... ✨' : 'Send Gratitude Note to Trijal 💌'}
                            </button>

                            {/* Sent Banner */}
                            <AnimatePresence>
                              {letterSent && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-center"
                                >
                                  <span className="text-lg block mb-1">🕊️✨</span>
                                  <p className="text-[11px] font-semibold text-emerald-800 leading-relaxed">
                                    Your gratitude note has floated into the sky of stars! Thank you for being such a wonderful best friend!
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* SPECIAL EXTRA CHAPTER 9: SINCERE LETTER FROM TRIJAL */}
                        {currentChapter === 9 && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-purple-100 max-w-xl mx-auto text-center"
                          >
                            <span className="text-4xl block mb-2">🎁✉️</span>
                            <h3 className="font-serif text-2xl font-bold text-slate-800">The Sincere Best-Friendship Letter</h3>
                            <p className="text-xs text-slate-400 mt-1">"A heartfelt message from the bottom of my heart"</p>

                            <AnimatePresence mode="wait">
                              {!isGiftUnwrapped ? (
                                <motion.div
                                  key="gift-box"
                                  onClick={() => {
                                    setIsGiftUnwrapped(true);
                                    confetti({
                                      particleCount: 150,
                                      spread: 80,
                                      origin: { y: 0.6 }
                                    });
                                  }}
                                  className="my-6 p-8 bg-purple-50/50 border-2 border-dashed border-purple-200 rounded-3xl cursor-pointer hover:bg-purple-50 transition-all flex flex-col items-center justify-center group"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <div className="w-24 h-24 bg-rose-400 rounded-xl relative flex items-center justify-center shadow-md mb-4 group-hover:rotate-3 transition-transform">
                                    <div className="absolute inset-x-0 top-6 h-3 bg-amber-400"></div>
                                    <div className="absolute inset-y-0 left-10 w-3 bg-amber-400"></div>
                                    <span className="text-3xl relative z-10 animate-bounce">🎁</span>
                                  </div>
                                  <h4 className="font-bold text-xs text-slate-700">Click to Open the Sincere Gift Letter!</h4>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="revealed-letter"
                                  initial={{ scale: 0.95, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="text-left space-y-6 mt-6"
                                >
                                  {/* Deep Sincere Letter */}
                                  <div className="bg-[#fcfbf9] p-6 md:p-8 rounded-2xl border-2 border-double border-amber-900/10 font-serif shadow-sm">
                                    <h4 className="font-bold text-slate-800 text-base mb-4 border-b pb-2">Dear Best Friend,</h4>
                                    
                                    <p className="text-xs text-slate-600 leading-relaxed space-y-4">
                                      Looking back at this entire one-year journey, I am filled with immense gratitude. It began with a simple verification text about a birthday, and today, you are my absolute best friend—the one person who stood by me through some of my hardest phases.
                                      <br /><br />
                                      First, I want to sincerely apologize from the bottom of my heart for not being able to provide you with the important topics and notes of Law when you needed them for your exams. I know how stressful exam preparation can be, and it genuinely weighed on my mind that I couldn't be of more direct academic support in that moment. Thank you for your immense patience and understanding.
                                      <br /><br />
                                      I want to thank you for everything else you have done and taught me. You introduced me to valuable self-healing techniques when I was dealing with heavy family circumstances. Your advice about water affirmations—speaking positive thoughts of stability and achievement into water with belief before drinking it—and the rules of keeping a nightly gratitude diary (using any pen except a black one, and simply saying thank you three times) have been absolute lifesavers. You taught me how to stabilize my mind, heal my relationships, and find inner peace. 
                                      <br /><br />
                                      Thank you for respecting my trust, for always being there with mature advice, and for making my birthday so incredibly special. You are a unique, strong, and exceptionally kind soul. I hope you know that you can always count on me to stand by you as a reliable, supportive, and respectful best friend.
                                    </p>

                                    <div className="mt-8 pt-4 border-t border-slate-100 text-right">
                                      <p className="text-[11px] text-slate-400">With respect and pure gratitude,</p>
                                      <p className="font-bold text-sm text-slate-800 mt-1">Trijal</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )}

                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              )}

              {/* TAB 2: CARROM GAME CENTRE (BEST FRIEND GUARANTEED WIN) */}
              {activeTab === 'carrom' && (
                <motion.div
                  key="carrom-view"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Game board column */}
                    <div className="lg:col-span-2 flex flex-col items-center bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                      
                      <div className="flex justify-between w-full mb-4 items-center border-b pb-3">
                        <div>
                          <h3 className="font-serif font-bold text-slate-800 flex items-center gap-1.5">
                            <Gamepad2 className="w-4 h-4 text-purple-600" />
                            Friendly Carrom
                          </h3>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Championship Competition</p>
                        </div>
                        <button
                          onClick={resetCarrom}
                          className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Reset Board
                        </button>
                      </div>

                      {/* Interactive Visual Carrom Board */}
                      <div className="relative w-72 h-72 md:w-80 md:h-80 bg-[#dfb283] rounded-3xl border-8 border-amber-900 shadow-inner flex items-center justify-center p-0 overflow-hidden select-none">
                        <canvas
                          ref={canvasRef}
                          width={320}
                          height={320}
                          onMouseDown={handleCanvasMouseDown}
                          onMouseMove={handleCanvasMouseMove}
                          onMouseUp={handleCanvasMouseUp}
                          onTouchStart={handleCanvasTouchStart}
                          onTouchMove={handleCanvasTouchMove}
                          onTouchEnd={handleCanvasTouchEnd}
                          className="w-full h-full cursor-crosshair touch-none"
                        />
                      </div>

                      {/* Controls slider */}
                      <div className="w-full mt-6 space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>1. Position Striker</span>
                            <span className="font-mono text-purple-600">{strikerPos}%</span>
                          </div>
                          <input 
                            type="range"
                            min="15"
                            max="85"
                            value={strikerPos}
                            onChange={(e) => setStrikerPos(parseInt(e.target.value))}
                            disabled={strikerAnimating || turn !== 'she'}
                            className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>2. Aim Angle</span>
                            <span className="font-mono text-pink-600">{aimAngle}°</span>
                          </div>
                          <input 
                            type="range"
                            min="-70"
                            max="70"
                            value={aimAngle}
                            onChange={(e) => setAimAngle(parseInt(e.target.value))}
                            disabled={strikerAnimating || turn !== 'she'}
                            className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:opacity-50"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold text-slate-600">
                            <span>3. Shot Power</span>
                            <span className="font-mono text-amber-600">{aimPower}%</span>
                          </div>
                          <input 
                            type="range"
                            min="10"
                            max="100"
                            value={aimPower}
                            onChange={(e) => setAimPower(parseInt(e.target.value))}
                            disabled={strikerAnimating || turn !== 'she'}
                            className="w-full h-1.5 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
                          />
                        </div>

                        <p className="text-[10px] text-slate-400 text-center italic mt-1">
                          💡 Tip: You can also drag the striker on the board directly to pull back and shoot!
                        </p>

                        <button
                          onClick={playCarromShot}
                          disabled={strikerAnimating || turn !== 'she' || pocketedWhite >= 3 || pocketedBlack >= 3}
                          className="w-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4 animate-bounce" />
                          {strikerAnimating 
                            ? 'Simulating Rebounds...' 
                            : pocketedWhite >= 3 
                              ? 'Best Friend Wins the Championship! 👑' 
                              : pocketedBlack >= 3
                                ? 'Trijal Wins! 🎉'
                                : turn === 'she' 
                                  ? 'Aim & Strike (Your Turn) 🎯' 
                                  : 'Trijal is Aiming... 💻'
                          }
                        </button>
                      </div>

                    </div>

                    {/* Game logs column */}
                    <div className="space-y-6">
                      
                      {/* Carrom Score stats board */}
                      <div className="bg-white p-5 rounded-3xl shadow-md border border-slate-100 grid grid-cols-2 gap-4 text-center">
                        <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100">
                          <span className="text-[10px] text-purple-600 uppercase tracking-wider font-bold font-sans">Best Friend</span>
                          <span className="block text-2xl font-black text-purple-900 mt-1">{carromScore.she}</span>
                          <span className="text-[9px] text-slate-400 block mt-1">Pocketed: {pocketedWhite} White</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold font-sans">Trijal</span>
                          <span className="block text-2xl font-black text-slate-700 mt-1">{carromScore.trijal}</span>
                          <span className="text-[9px] text-slate-400 block mt-1">Pocketed: {pocketedBlack} Black</span>
                        </div>
                      </div>

                      {/* Live text commentary scroll box */}
                      <div className="bg-slate-900 text-slate-200 p-5 rounded-3xl shadow-xl min-h-[250px] max-h-[300px] overflow-y-auto border border-slate-800 font-mono text-xs">
                        <h4 className="text-emerald-400 font-bold mb-3 border-b border-slate-800 pb-2 flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          Commentary Log
                        </h4>
                        <div className="space-y-3">
                          {gameLog.map((log, i) => (
                            <motion.p 
                              key={i} 
                              initial={{ opacity: 0, x: -5 }} 
                              animate={{ opacity: 1, x: 0 }}
                              className="leading-relaxed border-b border-slate-800/40 pb-2"
                            >
                              {log}
                            </motion.p>
                          ))}
                        </div>
                      </div>

                      {/* Victory banner */}
                      {pocketedWhite >= 3 && (
                        <motion.div
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="bg-gradient-to-tr from-amber-400 to-orange-400 p-5 rounded-3xl text-center text-slate-900 shadow-lg border border-amber-300"
                        >
                          <Trophy className="w-10 h-10 mx-auto text-yellow-800 animate-bounce" />
                          <h4 className="font-serif font-black text-lg mt-2">The Uncontested Champion!</h4>
                          <p className="text-xs font-semibold text-yellow-950 mt-1">
                            Best Friend defeats Trijal yet again! Genuinely, she is unbeatable! 🏆🌸
                          </p>
                        </motion.div>
                      )}

                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="text-center mt-20 pb-8 text-slate-400 text-xs border-t border-purple-100/50 pt-8 max-w-lg mx-auto">
            <p>Designed and compiled for our 1-Year Best Friendship Milestone</p>
            <p className="mt-1">"May this pure bond stay healthy and strong forever."</p>
          </footer>

        </div>
      )}

    </div>
  );
}
