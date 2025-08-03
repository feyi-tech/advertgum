const packs = [
  {
    title: "Make $1000 in 30 Days",
    description: "By the time you finish these cards, you should be able to make $1000 in a month.",
    price: 15789.00,
    rating: 4,
    reviews: 12300,
    category: "Money",
    totalCards: 420,
    cards: [
      { title: "Choose a Side Hustle", content: "Pick one income stream like freelancing or selling products." },
      { title: "Set a Weekly Goal", content: "Break $1000 into smaller weekly targets." },
      { title: "List Your Skills", content: "Identify what you can offer immediately." },
      { title: "Create a Simple Offer", content: "Make a clear offer people can quickly understand." },
      { title: "Promote to Friends", content: "Tell 10 people about what you're offering today." },
      { title: "Sign Up on a Platform", content: "Register on Fiverr, Upwork, or a local gig app." },
      { title: "Sell an Unused Item", content: "List at least one item for sale today." },
      { title: "Watch a Sales Video", content: "Learn from how pros pitch and convert." },
      { title: "Make Your First Pitch", content: "Send one cold message or offer to someone today." },
      { title: "Track Your Earnings", content: "Log every cent you make, no matter how small." }
    ]
  },
  {
    title: "Get Fit in 8 Weeks",
    description: "Achieve your fitness goals step by step with this pack.",
    price: 23641.00,
    rating: 5,
    reviews: 8500,
    category: "Health",
    totalCards: 380,
    cards: [
      { title: "Set Your Fitness Goal", content: "Decide what you want to achieve: lose weight, build strength, or gain energy." },
      { title: "10-Minute Workout", content: "Start with a simple full-body workout you can do at home." },
      { title: "Drink More Water", content: "Aim for 8 glasses today—hydration boosts performance." },
      { title: "Track Your Steps", content: "Use your phone or watch to monitor your daily steps." },
      { title: "Try a New Exercise", content: "Do something different today—yoga, jump rope, or a new app." },
      { title: "Stretch for 5 Minutes", content: "Improve flexibility and reduce injury risk." },
      { title: "Meal Prep One Healthy Dish", content: "Cook something nutritious and save it for later." },
      { title: "Eliminate One Junk Food", content: "Cut out soda, candy, or chips for the day." },
      { title: "Sleep 7-8 Hours", content: "Rest is essential for muscle recovery and energy." },
      { title: "Check Progress", content: "Take a photo or journal how you feel today." }
    ]
  },
  {
    title: "Boost Productivity",
    description: "Learn techniques to maximize your daily output and manage time.",
    price: 12618.00,
    rating: 3,
    reviews: 470,
    category: "Productivity",
    totalCards: 400,
    cards: [
      { title: "The 2-Minute Rule", content: "If it takes less than 2 minutes, do it immediately." },
      { title: "Time Block Your Day", content: "Assign tasks to specific time slots to stay on track." },
      { title: "Set a Daily Focus", content: "Choose one task that must be completed today." },
      { title: "Declutter Your Workspace", content: "A clean space leads to a clear mind." },
      { title: "Use the Pomodoro Technique", content: "Work 25 minutes, break for 5. Repeat." },
      { title: "Limit Phone Distractions", content: "Put your phone on Do Not Disturb for 1 hour." },
      { title: "Write a To-Do List", content: "List 3 priorities for the day." },
      { title: "Batch Similar Tasks", content: "Group emails, calls, or errands together." },
      { title: "Review Your Week", content: "Reflect on what worked and what didn’t." },
      { title: "Automate a Task", content: "Use tools or scripts to handle repetitive work." }
    ]
  },
  {
    title: "Learn Spanish Basics",
    description: "Start speaking Spanish with these simple daily lessons.",
    price: 20574.00,
    rating: 4,
    reviews: 2300,
    category: "Skills",
    totalCards: 490,
    cards: [
      { title: "Greetings", content: "Learn 'Hola', 'Buenos días', '¿Cómo estás?'" },
      { title: "Numbers 1–10", content: "Uno, dos, tres... up to diez." },
      { title: "Basic Questions", content: "Practice '¿Dónde?', '¿Qué?', '¿Por qué?'" },
      { title: "Common Verbs", content: "Learn 'ser', 'tener', 'ir' and how to use them." },
      { title: "Days of the Week", content: "Lunes, martes, miércoles..." },
      { title: "Useful Phrases", content: "'¿Cuánto cuesta?', 'No entiendo', 'Gracias'" },
      { title: "Food Words", content: "Pan (bread), agua (water), manzana (apple)" },
      { title: "Pronouns", content: "Yo, tú, él, ella, nosotros..." },
      { title: "Practice Conversation", content: "Write a dialogue using what you’ve learned." },
      { title: "Spanish Music", content: "Listen to a Spanish song and note 5 words you recognize." }
    ]
  },
  {
    title: "Save $500 in 3 Months",
    description: "Practical steps to boost your savings quickly and effectively.",
    price: 14202.00,
    rating: 4,
    reviews: 1500,
    category: "Money",
    totalCards: 440,
    cards: [
      { title: "Open a Separate Savings Account", content: "Create a place where your savings won't be touched." },
      { title: "Track Daily Spending", content: "Record every expense today." },
      { title: "Cut One Subscription", content: "Cancel one thing you rarely use." },
      { title: "No-Spend Day", content: "Challenge yourself to not spend anything today." },
      { title: "Sell One Item", content: "Find something to list on an online marketplace." },
      { title: "Make a Budget", content: "Write down your income and recurring costs." },
      { title: "Cook at Home", content: "Skip the takeout and prepare a meal today." },
      { title: "Plan a Cheap Outing", content: "Find free or low-cost entertainment." },
      { title: "Avoid Impulse Buys", content: "Wait 24 hours before buying anything unplanned." },
      { title: "Set a Weekly Savings Target", content: "Start with a small amount like $10 or $20." }
    ]
  },
  {
    title: "Meditate Daily",
    description: "Build a meditation habit for improved mental health.",
    price: 9464.00,
    rating: 5,
    reviews: 6300,
    category: "Health",
    totalCards: 360,
    cards: [
      { title: "1-Minute Breath Focus", content: "Sit still and follow your breath for 1 minute." },
      { title: "Body Scan", content: "Notice tension from head to toe and release it." },
      { title: "Gratitude Meditation", content: "Think of 3 things you’re grateful for today." },
      { title: "Walking Meditation", content: "Pay full attention to each step you take." },
      { title: "Mindful Listening", content: "Close your eyes and focus on the sounds around you." },
      { title: "Mantra Repetition", content: "Pick a word or phrase and repeat it silently." },
      { title: "Let Go of Thoughts", content: "Notice your thoughts without judgment and return to breath." },
      { title: "Visualize Calm", content: "Picture a peaceful scene in detail." },
      { title: "Loving-Kindness", content: "Send warm wishes to yourself and others." },
      { title: "Set a Timer", content: "Meditate for 5–10 minutes without checking the clock." }
    ]
  },
  {
    title: "Master Public Speaking",
    description: "Overcome fear and deliver powerful speeches.",
    price: 18922.00,
    rating: 4,
    reviews: 970,
    category: "Skills",
    totalCards: 470,
    cards: [
      { title: "Know Your Audience", content: "Research who you’ll be speaking to." },
      { title: "Write a Short Speech", content: "Draft a 1-minute talk on any topic." },
      { title: "Practice in the Mirror", content: "Watch your body language as you speak." },
      { title: "Record Yourself", content: "Listen for clarity, pace, and tone." },
      { title: "Eliminate Fillers", content: "Practice speaking without 'um', 'like', or 'you know'." },
      { title: "Tell a Story", content: "Stories make talks more memorable—try one." },
      { title: "Use Pauses", content: "Silence adds impact. Pause after key points." },
      { title: "Make Eye Contact", content: "Imagine looking at different faces in the room." },
      { title: "Vary Your Voice", content: "Change pitch and speed for engagement." },
      { title: "Get Feedback", content: "Ask someone to critique your delivery." }
    ]
  },
  {
    title: "Declutter Your Home",
    description: "Organize and simplify your living space with this pack.",
    price: 11042.00,
    rating: 3,
    reviews: 280,
    category: "Productivity",
    totalCards: 400,
    cards: [
      { title: "Declutter a Drawer", content: "Pick one drawer and remove anything you don’t need." },
      { title: "5-Minute Declutter", content: "Set a timer and clean as much as you can in 5 minutes." },
      { title: "Clothes You Don’t Wear", content: "Pick 5 pieces to donate or toss." },
      { title: "Clear Countertops", content: "Put away everything from your kitchen counters." },
      { title: "Sort Paper Clutter", content: "Go through mail, receipts, and papers." },
      { title: "Declutter Digital Files", content: "Delete 10 unnecessary files or apps." },
      { title: "Organize Cords and Chargers", content: "Bundle, label, or discard what you don't use." },
      { title: "Simplify One Shelf", content: "Tidy up a bookshelf or cabinet today." },
      { title: "Make a Donation Box", content: "Start filling a box with items you no longer need." },
      { title: "Create a Clutter-Free Zone", content: "Pick one area that stays neat every day." }
    ]
  },
  {
    title: "Write a Book",
    description: "Step-by-step plan to finish your manuscript.",
    price: 25214.00,
    rating: 5,
    reviews: 5200,
    category: "Skills",
    totalCards: 480,
    cards: [
      { title: "Pick a Genre", content: "Choose fiction, nonfiction, memoir, or another form." },
      { title: "Write a One-Sentence Idea", content: "Summarize your book’s concept in one line." },
      { title: "Outline 3 Main Sections", content: "Break your idea into 3 big chunks." },
      { title: "Write 300 Words", content: "Just get something on the page today." },
      { title: "Describe Your Main Character", content: "If fiction, give them a backstory and goal." },
      { title: "Decide Your Writing Schedule", content: "Will you write daily or weekly?" },
      { title: "Set a Word Count Goal", content: "Aim for 500–1000 words a session." },
      { title: "Write a Rough Chapter", content: "Don’t worry about perfection—just write." },
      { title: "Read Your Favorite Book", content: "Study what works in a book you admire." },
      { title: "Back Up Your Work", content: "Use Google Docs, Dropbox, or email to self." }
    ]
  },
  // Feel free to request expanded content for the last two packs too.
];