export const MOCK_CHAT_HISTORY = [
  {
    id: "chat-1",
    title: "Explain Quantum Computing",
    messages: [
      {
        id: "msg-1",
        problem: "Explain quantum computing in simple terms for a 10 year old.",
        solution_1: "**Quantum computing** is like a magically fast library. \n\nNormally, a computer is like reading one book at a time (called bits). A quantum computer uses **qubits**, which means it can read all the books in the library at the exact same time! This makes it incredibly fast for solving really tricky puzzles, like finding a needle in a giant haystack.",
        solution_2: "Imagine you're trying to find the way out of a maze. A normal computer would try one path, hit a dead end, walk back, and try another path until it finds the exit. \n\nA **quantum computer** is like a wizard that duplicates itself to walk down *every single path at once*. It finds the exit instantly! It uses special rules of quantum physics to do this.",
        judge: {
          solution_1_score: 7,
          solution_2_score: 9,
          solution_1_reasoning: "The library analogy is decent but reading books 'at the same time' doesn't capture the parallel processing power as intuitively for a 10-year-old.",
          solution_2_reasoning: "The maze analogy is a classic and perfectly explains quantum superposition in a highly visual, easy-to-understand way for children.",
          recommendation: 2
        }
      }
    ]
  },
  {
    id: "chat-2",
    title: "React useEffect vs. useLayoutEffect",
    messages: [
      {
        id: "msg-2",
        problem: "Briefly explain the difference between `useEffect` and `useLayoutEffect` in React.",
        solution_1: "`useEffect` runs asynchronously *after* the browser paints the screen. It is best for data fetching, subscriptions, and logging.\n\n`useLayoutEffect` runs synchronously *before* the browser paints. It is useful when you need to measure the DOM (like getting element sizes) and mutate it before the user sees anything, preventing screen flickering.",
        solution_2: "Here is the difference:\n- **`useEffect`**: Runs after render and paint. Non-blocking. Use it most of the time.\n- **`useLayoutEffect`**: Runs after render but *before* paint. Blocking. Use it if your effect changes the DOM structure to avoid flickering.",
        judge: {
          solution_1_score: 9,
          solution_2_score: 8,
          solution_1_reasoning: "Provides specific, practical examples of when to use each (data fetching vs measuring DOM). Very clear.",
          solution_2_reasoning: "Accurate and concise, but lacks the specific examples that make the distinction fully clear to a developer.",
          recommendation: 1
        }
      }
    ]
  }
];
