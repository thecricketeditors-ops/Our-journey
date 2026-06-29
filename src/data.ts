export interface ChapterMessage {
  sender: 'Trijal' | 'Best Friend';
  text: string;
  time: string;
  reactions?: string[];
}

export interface ChapterData {
  number: number;
  title: string;
  subtitle: string;
  narrative: string;
  illustration: string; // Emoji or custom SVG theme
  chat: ChapterMessage[];
}

export const chapters: ChapterData[] = [
  {
    number: 1,
    title: "How It All Began",
    subtitle: "29 June 2025",
    illustration: "💬",
    narrative: "Every beautiful journey begins with a simple, unexpected conversation. For Trijal and his Best Friend, it started with a humble query verifying a date. There was no grand preamble, just a helpful message that paved the way for an incredible best-friendship. A younger friend showing utmost respect, and an older bestie responding with warmth.",
    chat: [
      { sender: 'Trijal', text: 'True ?', time: '1:16 PM' },
      { sender: 'Best Friend', text: 'Kiska sajal ya mera? Chat padh pehle puri 😤', time: '1:16 PM', reactions: ['🙌'] },
      { sender: 'Trijal', text: 'Context ? 😐', time: '1:16 PM' },
      { sender: 'Best Friend', text: 'Sajal apna pooch rha h vaha pe. Usne pehle bhi bataya tha to meko yaad tha.', time: '1:17 PM' },
      { sender: 'Trijal', text: 'IK But is it true ?', time: '1:17 PM' },
      { sender: 'Best Friend', text: 'Yss! Date is 4 or 6 April. 70% for 4 April acc to me 🤣', time: '1:18 PM', reactions: ['❤️'] }
    ]
  },
  {
    number: 2,
    title: "Tally Prime Learning",
    subtitle: "July 2025",
    illustration: "💻",
    narrative: "When his Best Friend faced hurdles with her Tally Prime classes at the institute, Trijal stepped in as a virtual tutor. He recorded helpful shortcut videos, explained direct and indirect expenses, and taught her ALT+2 for duplicate entries. The mutual respect grew, and they became a reliable support team.",
    chat: [
      { sender: 'Trijal', text: 'Hey? Available ?', time: '11:48 AM' },
      { sender: 'Best Friend', text: 'Yup, centre hi hu 😂', time: '11:49 AM' },
      { sender: 'Trijal', text: 'Sabse Pehle To ALT+2 Press karo. Usse entry Duplicate Ho Jayegi Phir bas Amount change Karna And done 🌟', time: '11:51 AM', reactions: ['🔥'] },
      { sender: 'Best Friend', text: 'Gateway of Tally pe ALT+2 karna ya voucher pe? 😭', time: '11:58 AM' },
      { sender: 'Trijal', text: 'Are jab apan vahan entry karne ke bad Aate Hain Na voucher par hi.', time: '11:59 AM' },
      { sender: 'Best Friend', text: 'Hogya! Finally 😭😭 Tally me ab ek tuhi sahara nazar a rha', time: '12:12 PM', reactions: ['💖'] },
      { sender: 'Best Friend', text: 'Thanks for today sir! Genuinely aaj tak koi aisa nahi mila jo itni dedication se help kare 😂', time: '2:11 PM', reactions: ['🙏'] },
      { sender: 'Trijal', text: 'No need, roj thanks mat bola karo. I rise by rising others 😌', time: '2:14 PM', reactions: ['✨'] }
    ]
  },
  {
    number: 3,
    title: "A Pillar of Utmost Trust",
    subtitle: "8 July 2025",
    illustration: "🤝",
    narrative: "Trust is a delicate crystal, and here, it was forged in absolute respect. When Shreya shared a private picture of his Best Friend to Trijal without her permission, Trijal chose integrity. He did not open the picture and immediately informed his Best Friend about it, proving his loyalty and protective respect for her privacy.",
    chat: [
      { sender: 'Trijal', text: 'Actually I want to clarify something. Shreya ne tumhari pic one time view par bheji hai. Maine open nahi ki hai.', time: '11:40 PM' },
      { sender: 'Trijal', text: 'Pls don\'t tell her I shared this, she trusted me, but your privacy and concern is my utmost priority.', time: '11:40 PM', reactions: ['❤️'] },
      { sender: 'Best Friend', text: 'Don\'t open but delete it. And thank you so much, you chose to tell me everything, that\'s enough 🥺', time: '12:57 AM', reactions: ['🙏'] },
      { sender: 'Best Friend', text: 'No, I won\'t block you. Not because of Tally Prime, but because you respected my privacy. You are trustworthy.', time: '1:11 AM', reactions: ['💖'] }
    ]
  },
  {
    number: 4,
    title: "Overcoming the Storm",
    subtitle: "August 2025",
    illustration: "⚡",
    narrative: "Even the strongest friendships face occasional clouds. A small misunderstanding in August tested their bond. But instead of letting silence build a wall, they chose honest communication.Sincere apologies and mutual understanding cleared the air completely, leaving their best-friendship stronger and more resilient than ever.",
    chat: [
      { sender: 'Trijal', text: 'I am really sorry if my overthinking or any message bothered you. I value our friendship at any cost 😔', time: '11:26 PM' },
      { sender: 'Best Friend', text: 'I am not angry, but please stop saying sorry for small things. We are best friends, it\'s ok 🙃', time: '11:44 PM', reactions: ['❤️'] },
      { sender: 'Trijal', text: 'I promise I won\'t repeat this. From my side, our friendship will always remain normal and respectful.', time: '11:50 PM' },
      { sender: 'Best Friend', text: 'It will be normal from my side too. Don\'t worry at all ✨', time: '11:51 PM', reactions: ['💖'] }
    ]
  },
  {
    number: 5,
    title: "The Art of Self-Healing",
    subtitle: "September 2025",
    illustration: "🌸",
    narrative: "When Trijal faced immense stress from family circumstances, his Best Friend stood by him like a beacon of peace. She introduced him to invaluable healing techniques—the power of positive words, water affirmations, and maintaining a daily gratitude diary. Her guidance became a peaceful sanctuary for his mind.",
    chat: [
      { sender: 'Best Friend', text: 'Water affirmation is very powerful. When you drink water, look at it and think: "I am strong, I am stable, my goals are achieved." Speak it with belief 🌟', time: '11:07 AM', reactions: ['💧'] },
      { sender: 'Best Friend', text: 'And write a gratitude diary every night. Black pen use nahi karna. Just say thank you for 3 times.', time: '10:31 PM' },
      { sender: 'Trijal', text: 'Yes, I am starting the diary writing tonight. I will also do the soul meditation to heal my relationships. Thank you for always guiding me.', time: '10:38 PM', reactions: ['✨'] },
      { sender: 'Best Friend', text: 'I just want you to heal. You deserve peace, stay positive no matter what the environment is 🙃', time: '10:51 PM', reactions: ['💖'] }
    ]
  },
  {
    number: 6,
    title: "Her 18th Birthday Milestone",
    subtitle: "14 August 2025",
    illustration: "🎁",
    narrative: "On her 18th birthday, Trijal wanted to show his appreciation. Along with some refreshing cold kulfi, he sent a heartfelt handwritten letter. It wasn't just a standard greeting; it was a pure expression of gratitude for her constant support, kindness, and wonderful guidance.",
    chat: [
      { sender: 'Trijal', text: 'Happy 18th happy birthday My dear best friend! May this milestone year bring you immense happiness and peace. 🎂🎈', time: '12:00 AM', reactions: ['🎉', '❤️'] },
      { sender: 'Best Friend', text: 'Honestly no words left... 🥺 I had never even imagined I will get such handwritten letters by anyone. Thank you so much for making my birthday this special 🫶🏻✨', time: '12:08 AM', reactions: ['💖', '😭'] },
      { sender: 'Trijal', text: 'I wanted to make your 18th milestone memorable! You deserve all the happiness.', time: '12:14 AM', reactions: ['✨'] }
    ]
  },
  {
    number: 7,
    title: "A Special Return Celebration",
    subtitle: "24 September 2025",
    illustration: "🎂",
    narrative: "When Trijal's birthday arrived, his Best Friend returned the warmth with an exceptionally encouraging and heartfelt message. She reminded him of his unique qualities, urged him to ignore the negativity around him, and celebrated his hard work and dedication. It was a priceless validation.",
    chat: [
      { sender: 'Best Friend', text: 'Happy Birthday to The Mr. All Rounder vidhayak ji! 🎂 you are unique, remember it. Don\'t let anyone conquer your peace of mind.', time: '9:13 AM', reactions: ['❤️', '✨'] },
      { sender: 'Trijal', text: 'Honestly, I am in tears reading this... 🥺 Thank you so much for the beautiful wishes. It means a lot to me.', time: '9:18 AM', reactions: ['💖'] },
      { sender: 'Best Friend', text: 'Ro liya ho to mooh dho le, joker lag rha hoga 😭😂 Enjoy your day, take a little break from hard work!', time: '5:19 PM', reactions: ['🌟'] }
    ]
  },
  {
    number: 8,
    title: "Reflections of Support",
    subtitle: "October 2025",
    illustration: "🔒",
    narrative: "As the year progressed, they realized how deeply their best-friendship had become an anchor of mutual respect and strength. Even during busy phases of study preparation and hard work, the silent reassurance remained—they knew they could always count on each other.",
    chat: [
      { sender: 'Trijal', text: 'I am so grateful to have you as my best friend. Through all the storms, your presence kept me stable.', time: '11:00 PM' },
      { sender: 'Best Friend', text: 'Same here, we managed so much with maturity. Let\'s keep moving forward with full strength 🌟', time: '11:27 PM', reactions: ['💪', '✨'] }
    ]
  },
  {
    number: 9,
    title: "The Ultimate Best-Friendship Bond",
    subtitle: "29 June 2026",
    illustration: "✉️",
    narrative: "Reaching this beautiful milestone of best-friendship, Trijal writes a sincere letter from the bottom of his heart. No romance, no dramatic overtones—just pure respect, absolute gratitude for her guidance, and a lifetime promise to stand as a supportive friend.",
    chat: [
      { sender: 'Trijal', text: 'I compiled all our lessons and chats as a small token of gratitude. Happy one year of this awesome best-friendship! 🙌', time: '11:58 PM' },
      { sender: 'Best Friend', text: 'This is genuinely the most thoughtful thing ever. Thank you for always being there as such a respectful friend! 🥺✨', time: '11:59 PM', reactions: ['💖', '🙏'] }
    ]
  }
];

export const carromQuotes = [
  "Wow Best Friend! What an absolutely majestic shot! 🎯",
  "Every single time she wins... because she is a pro! 👑",
  "Oof, that was so close! But she takes the Queen again! 👑🍒",
  "A competitive game but she is simply unbeatable! 🌸"
];

export interface BestieJoke {
  setup: string;
  punchline: string;
  emoji: string;
}

export const bestieJokes: BestieJoke[] = [
  {
    setup: "Why is a CA best friend better than any accounting software?",
    punchline: "Because even when your life's balance sheet is completely mismatched, she forces you to audit your mood and buy kulfi! 🍦📈",
    emoji: "📈"
  },
  {
    setup: "What happens when you ask a CA student to take a quick 5-minute study break?",
    punchline: "They wake up 4 hours later dreaming about Debit, Credit, and a talking calculator! 😴📟",
    emoji: "😴"
  },
  {
    setup: "Why is our friendship like a perfectly audited Balance Sheet?",
    punchline: "Because there is absolutely no room for errors, and the ledger balances on pure laughter! 🧾✨",
    emoji: "🧾"
  },
  {
    setup: "Why did the CA student refuse to use a pencil for calculations?",
    punchline: "Because erasing mistakes is easy, but explaining a mismatched total to your bestie is impossible! ✏️🙅‍♀️",
    emoji: "✏️"
  },
  {
    setup: "What is the biggest mystery in a CA student's life?",
    punchline: "How 100 pages of Tax Law vanish from memory the second you walk into the exam hall! 📚🤯",
    emoji: "🤯"
  },
  {
    setup: "Why is a girl's best friend like a secret Reserve Fund?",
    punchline: "She keeps all your secrets safe and is always ready for emergency gossip sessions! 💼🤫",
    emoji: "💼"
  },
  {
    setup: "Why do CA students love keyboard shortcuts like Alt+Tab so much?",
    punchline: "Because switching between Tally Prime and planning our next food spree is a critical professional skill! 💻🍕",
    emoji: "💻"
  },
  {
    setup: "What did the Auditor say to the unorganized desk of their bestie?",
    punchline: "'This is a major material misstatement of candy wrappers and books! Re-auditing required!' 🍬🔍",
    emoji: "🔍"
  }
];

export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  chapterLink?: number;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    date: "29 June 2025",
    title: "First Message",
    subtitle: "The Spark of Friendship",
    description: "Every great story starts with a simple, unexpected message. For us, it was a helpful query about a date. No fancy preamble, just a humble query that paved the way for our incredible one-year best-friendship journey.",
    emoji: "💬",
    color: "from-blue-400 to-indigo-500",
    chapterLink: 1
  },
  {
    id: 2,
    date: "July 2025",
    title: "Friendship Started",
    subtitle: "Laying the Foundation",
    description: "Getting to know each other, setting mature boundaries, and discovering our shared values of absolute trust, privacy, and respect. A solid foundation built to stand any storm.",
    emoji: "🌸",
    color: "from-pink-400 to-rose-500",
    chapterLink: 3
  },
  {
    id: 3,
    date: "July-August 2025",
    title: "YPT Study Grinds",
    subtitle: "Powering Through Exams",
    description: "Surviving tough study days and the intense grind of CA exams together! Logging focus hours on Yeolpumta, sending motivational text spam, and encouraging each other to keep pushing.",
    emoji: "⏱️",
    color: "from-amber-400 to-orange-500",
    chapterLink: 8
  },
  {
    id: 4,
    date: "July 2025",
    title: "Tally Prime Days",
    subtitle: "Accounting Tutor Session",
    description: "Tutoring sessions with Alt+2 duplicate entries, ledger accounts, and voucher postings! Making difficult classes a whole lot simpler through sheer dedication and virtual screen sharing.",
    emoji: "💻",
    color: "from-teal-400 to-emerald-500",
    chapterLink: 2
  },
  {
    id: 5,
    date: "Ongoing",
    title: "Helping Each Other",
    subtitle: "An Unshakable Support Team",
    description: "Always stepping up when the other faces academic pressure or stressful situations. Helping with tough topics and proving that a real best friend is a solid, reliable anchor.",
    emoji: "🤝",
    color: "from-sky-400 to-blue-500",
    chapterLink: 8
  },
  {
    id: 6,
    date: "Daily Vibe",
    title: "Funny Moments",
    subtitle: "Stand-Up Comedy & Banter",
    description: "Absolute laugh-out-loud moments, silly memes, and calling each other jokers! Sassy teasing and witty stand-up comedy vibes with 99.9% funny, clean, platonic bestie banter.",
    emoji: "🤡",
    color: "from-purple-400 to-fuchsia-500",
    chapterLink: 7
  },
  {
    id: 7,
    date: "14 August 2025",
    title: "Her 18th Birthday",
    subtitle: "A Special Milestone",
    description: "Celebrating your big 18th birthday! Sending delicious cold kulfi and sincere, heartfelt handwritten letters on beautiful paper to make your milestone day exceptionally memorable.",
    emoji: "🎁",
    color: "from-rose-400 to-red-500",
    chapterLink: 6
  },
  {
    id: 8,
    date: "August 2025",
    title: "August Storm",
    subtitle: "Overcoming Misunderstandings",
    description: "Every strong friendship faces occasional clouds. When a small misunderstanding arose in August, we chose honest, mature communication and sincere apologies over silent treatment, leaving our bond stronger than ever.",
    emoji: "⚡",
    color: "from-violet-400 to-purple-500",
    chapterLink: 4
  },
  {
    id: 9,
    date: "September 2025",
    title: "Healing & Guidance",
    subtitle: "Water Affirmations & Diary",
    description: "Introducing invaluable self-healing methods! From speaking positive focus thoughts to water with self-belief, to keeping a night-time gratitude diary strictly with no black pen, helping stabilize the mind.",
    emoji: "🌱",
    color: "from-green-400 to-emerald-500",
    chapterLink: 5
  },
  {
    id: 10,
    date: "29 June 2026",
    title: "Today",
    subtitle: "1-Year Anniversary Milestone",
    description: "365 full days of solid, pure, and respectful best-friendship! Reaching our milestone with immense gratitude and looking forward to many more years of wonderful laughter and support.",
    emoji: "👑",
    color: "from-yellow-400 to-amber-500",
    chapterLink: 9
  }
];

export interface BestieQuestion {
  question: string;
  options: string[];
  correctResponse: string;
}

export const bestieQuestions: BestieQuestion[] = [
  {
    question: "If Sneha has to survive a sudden CA exam syllabus update overnight, what is her ultimate survival strategy?",
    options: [
      "Double down on coffee and study like a legal warrior ☕📚",
      "Call Trijal to write a custom AI script that summarizes the entire syllabus in 2 minutes 💻",
      "Stare at the books, question her life choices, and negotiate with the study gods 🙈",
      "Eat kulfi, close the books, and say 'it is what it is' with confidence 🍦"
    ],
    correctResponse: "Whether studying like a warrior or taking a kulfi break, Sneha's dedication is always legendary! 😂"
  },
  {
    question: "If Sneha is stuck handling a super complicated balance sheet calculation that doesn't match by 1 rupee, what will she do?",
    options: [
      "Audit every single entry with laser-sharp focus and find the error like a pro 🔍",
      "Ask Trijal to build a funny calculator that automatically hides the 1 rupee discrepancy 🧮",
      "Declare the 1 rupee as a 'friendship discount' and call it a day 💸",
      "Scream internally, close the laptop, and treat herself to chocolate coffee ☕🍫"
    ],
    correctResponse: "A professional CA-in-the-making never gives up, but a chocolate coffee break definitely speeds up the debugging! 🤪"
  },
  {
    question: "If Sneha is trapped in a stuck lift alone on her way to an important meeting, how does she handle the situation?",
    options: [
      "Calmly analyze the lift's safety certifications and wait like a highly professional adult 🤐",
      "Host a solo lift karaoke concert and record funny voice notes for Trijal to enjoy 🎤",
      "Try playing an imaginary game of Carrom against the elevator wall 🎯",
      "Calculate the tax implications of elevator maintenance delays for the building 🧾"
    ],
    correctResponse: "Solo elevator karaoke is the elite way to stay calm and keep your spirits high! Repairs can wait! 😂"
  },
  {
    question: "If Sneha wakes up with a single superpower to help her handle her super busy daily routine, which one does she choose?",
    options: [
      "The ability to freeze time to finish studies and still get 8 hours of peaceful sleep 😴",
      "A magical 'mute' button for any boring lectures or annoying situations 🤫",
      "An instant, unlimited supply of warm, stress-busting chocolate-flavored coffee ☕",
      "A telepathic connection to know exactly when Trijal is about to send a funny meme 📱"
    ],
    correctResponse: "Muting the boring parts of the day and timing the memes is a perfect best-friend strategy! 🙌💫"
  },
  {
    question: "If Sneha is appointed as the sole CEO of a brand-new startup, what revolutionary product would she launch first?",
    options: [
      "The ultimate handbook: 'How to survive CA studies with your sanity and humor intact' 📕",
      "An AI study companion that replaces stress with funny jokes and encouraging words 🤖",
      "A premium line of kulfi-flavored energy drinks for late-night study sessions 🍦",
      "A mobile game where carrom strikers fly around the screen to destress users 🎯"
    ],
    correctResponse: "That handbook would be a global bestseller! Sanity and humor are the ultimate business assets! 😂🧾"
  }
];


