// MosqueIcon.jsx
const MosqueIcon = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Crescent */}
      <path
        d="M6.5 6.5a4 4 0 0 0 3.5 2 4 4 0 0 0 2.2-.7A4 4 0 1 1 6.5 4.5a4 4 0 0 0 0 2Z"
        fill="currentColor"
      />

      {/* Central dome */}
      <path
        d="M12 8c-2.8 0-5 2.2-5 5v4.5h10V13c0-2.8-2.2-5-5-5Z"
        fill="currentColor"
      />

      {/* Base */}
      <rect
        x="4"
        y="13.5"
        width="16"
        height="6"
        rx="1"
        fill="currentColor"
      />

      {/* Door */}
      <path
        d="M10.5 13.5c-1.1 0-2 .9-2 2V19h5v-3.5c0-1.1-.9-2-2-2h-1Z"
        fill="white"
      />

      {/* Left minaret */}
      <path
        d="M5 7.5 4 8.5v6h2v-6L5 7.5Z"
        fill="currentColor"
      />
      <circle cx="5" cy="6.5" r="1" fill="currentColor" />

      {/* Right minaret */}
      <path
        d="M19 7.5 18 8.5v6h2v-6l-1-1Z"
        fill="currentColor"
      />
      <circle cx="19" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
};

export default MosqueIcon;
