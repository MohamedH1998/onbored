export const ONBOARDING_STEPS = [
  "welcome",
  "about-you",
  "workspace",
  "project",
];

export const GRADIENTS = [
  "hyper",
  "oceanic",
  "cotton-candy",
  "gotham",
  "sunset",
  "mojave",
  "beachside",
  "gunmetal",
  "peachy",
  "seaform",
  "pumpkin",
];

const gradientMap = {
  hyper:
    "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:400%_400%] animate-gradient-shift",
  oceanic:
    "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-[length:400%_400%] animate-gradient-shift-slow",
  "cotton-candy":
    "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-[length:400%_400%] animate-gradient-wave",
  gotham:
    "bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-[length:200%_200%] animate-gradient-rotate",
  sunset:
    "bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 bg-[length:400%_400%] animate-gradient-shift",
  mojave:
    "bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-500 bg-[length:400%_400%] animate-gradient-pulse",
  beachside:
    "bg-gradient-to-r from-yellow-200 via-green-200 to-green-500 bg-[length:400%_400%] animate-gradient-wave",
  gunmetal:
    "bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 bg-[length:200%_200%] animate-gradient-rotate",
  peachy:
    "bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 bg-[length:400%_400%] animate-gradient-shift",
  seaform:
    "bg-gradient-to-r from-green-200 via-green-300 to-blue-500 bg-[length:400%_400%] animate-gradient-wave",
  pumpkin:
    "bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-700 bg-[length:400%_400%] animate-gradient-pulse",
};

const animatedGradientMap = {
  hyper:
    "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-[length:400%_400%] animate-gradient-shift",
  oceanic:
    "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-[length:400%_400%] animate-gradient-shift-slow",
  "cotton-candy":
    "bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-[length:400%_400%] animate-gradient-wave",
};

export const pickRandomGradient = () => {
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
};

export const getGradient = (gradient: string) => {
  return gradientMap[gradient as keyof typeof gradientMap];
};

export const getAnimatedGradient = (gradient: string) => {
  return animatedGradientMap[gradient as keyof typeof animatedGradientMap];
};
