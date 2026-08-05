import React, { useState } from 'react'

const ContinueWithGoogle = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <a
      href="/api/auth/google"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      aria-label="Continue with Google"
      className={[
        // Layout
        'flex items-center w-full rounded-lg overflow-hidden',
        // Border — subtle on dark bg, slightly visible on hover
        'border transition-all duration-200',
        isPressed
          ? 'scale-[0.98] border-[#333] bg-[#1c1c1c]'
          : isHovered
          ? 'border-[#2e2e2e] bg-[#1a1a1a]'
          : 'border-[#242424] bg-[#161616]',
        // Remove default link underline
        'no-underline',
        // Cursor
        'cursor-pointer',
      ].join(' ')}
    >
      {/*
       * Google Logo Container
       * Google guidelines require the logo to sit on a white/light
       * background so the official colors remain accurate.
       */}
      <div className="flex items-center justify-center w-12 h-12 shrink-0 bg-white rounded-l-lg">
        {/* Official Google "G" SVG — exact brand colors */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="22"
          height="22"
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>

      {/* Label */}
      <span
        className={[
          'flex-1 text-center font-inter text-[13px] font-medium tracking-[0.01em] pr-12',
          'transition-colors duration-200',
          isHovered ? 'text-white' : 'text-[#c8c8c8]',
        ].join(' ')}
      >
        Continue with Google
      </span>
    </a>
  )
}

export default ContinueWithGoogle
