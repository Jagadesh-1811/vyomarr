module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: "#000B49", // deep cosmic blue
        secondary: "#1B1F30", // dark slate
        accent: "#4F46E5", // vibrant indigo
        
        // Background Colors
        background: "#0A0A0B", // near-black
        surface: "#1A1B23", // elevated dark surface
        
        // Text Colors
        "text-primary": "#F8FAFC", // high-contrast white
        "text-secondary": "#94A3B8", // muted blue-gray
        
        // Status Colors
        success: "#10B981", // cosmic green
        warning: "#F59E0B", // stellar amber
        error: "#EF4444", // mars red
        
        // Border Colors
        border: "rgba(148, 163, 184, 0.2)", // subtle border
        "border-accent": "#4F46E5", // accent border
      },
      fontFamily: {
        clash: ['Clash Display', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        'mono-data': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'clash-regular': '400',
        'clash-semibold': '600',
        'clash-bold': '700',
        'inter-regular': '400',
        'inter-medium': '500',
        'inter-semibold': '600',
        'mono-regular': '400',
        'mono-data-medium': '500',
      },
      boxShadow: {
        'cosmic': '0 4px 20px rgba(79, 70, 229, 0.15)',
        'cosmic-subtle': '0 2px 8px rgba(79, 70, 229, 0.1)',
        'cosmic-moderate': '0 8px 32px rgba(79, 70, 229, 0.2)',
        'cosmic-prominent': '0 16px 48px rgba(79, 70, 229, 0.25)',
      },
      borderRadius: {
        'cosmic': '8px',
        'cosmic-sm': '4px',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(79, 70, 229, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(79, 70, 229, 0.4)' },
        },
      },
      transitionTimingFunction: {
        'cosmic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'cosmic': '200ms',
        'cosmic-slow': '300ms',
      },
      backdropBlur: {
        'cosmic': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}