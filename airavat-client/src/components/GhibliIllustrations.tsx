export const CloudIllustration = () => (
  <svg
    className="absolute opacity-20"
    width="120"
    height="60"
    viewBox="0 0 120 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 40C13.4315 40 0 26.5685 0 10C0 4.47715 1.40283 0 7 0H113C116.866 0 120 3.13401 120 7V53C120 56.866 116.866 60 113 60H37C33.134 60 30 56.866 30 53V40Z"
      fill="#a8d8ea"
    />
  </svg>
)

export const LeafIllustration = () => (
  <svg
    className="absolute opacity-20"
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0ZM40 60C28.9543 60 20 51.0457 20 40C20 28.9543 28.9543 20 40 20C51.0457 20 60 28.9543 60 40C60 51.0457 51.0457 60 40 60Z"
      fill="#c5e0b4"
    />
  </svg>
)

export const SpiritIllustration = () => (
  <div className="absolute w-8 h-8 rounded-full bg-white bg-opacity-50 animate-float"></div>
)

export const GhibliDecoration = ({ position = "top-0 right-0" }) => (
  <div className={`absolute ${position} overflow-hidden pointer-events-none`}>
    <CloudIllustration />
    <LeafIllustration />
    <div className="absolute top-10 left-20">
      <SpiritIllustration />
    </div>
    <div className="absolute top-40 left-10">
      <SpiritIllustration />
    </div>
  </div>
)
