// Animation utilities for consistent transitions across the app

export const transitions = {
  // Page transitions
  page: 'transition-all duration-300 ease-in-out',
  pageEnter: 'animate-in fade-in slide-in-from-bottom-4 duration-300',
  pageExit: 'animate-out fade-out slide-out-to-top-4 duration-200',
  
  // Card animations
  card: 'transition-all duration-200 ease-in-out',
  cardHover: 'hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]',
  cardPress: 'active:scale-[0.98]',
  
  // Button animations
  button: 'transition-all duration-150 ease-in-out',
  buttonHover: 'hover:scale-105 active:scale-95',
  
  // Glassmorphism
  glass: 'backdrop-blur-xl bg-background/80 border border-white/10',
  glassHover: 'hover:bg-background/90 hover:border-white/20',
  
  // Loading animations
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  
  // Micro-interactions
  ripple: 'relative overflow-hidden',
  scale: 'transition-transform duration-200',
  scaleHover: 'hover:scale-110',
  
  // Skeleton loading
  skeleton: 'animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted',
};

export const animations = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Slide animations
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  
  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

// Duration presets
export const durations = {
  fast: 150,
  normal: 200,
  slow: 300,
  slower: 500,
};

// Easing functions
export const easings = {
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};
