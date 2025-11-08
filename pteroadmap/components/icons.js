import React from 'react';

export const Spinner = ({ size = "5" }) => (
  React.createElement('div', {
    className: `animate-spin rounded-full h-${size} w-${size} border-b-2 border-current`
  })
);

export const SendIcon = ({ className }) => (
    React.createElement('svg', { className: "h-5 w-5 text-white", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement('path', { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z", fill: "currentColor" })
    )
);

export const AttachIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" })
    )
);

export const HomeIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" })
  )
);

export const SpeakingIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" })
  )
);

export const WritingIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" })
  )
);

export const ReadingIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" })
  )
);

export const ListeningIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072M12 8v8m-2-4h4" })
  )
);

export const PTEGuideIcon = () => (
    React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement('path', { d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", stroke: "#FF6B6B", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })
    )
);
  
  export const SpeakingColoredIcon = () => (
    React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
      React.createElement('path', { d: "M20 27C23.866 27 27 23.866 27 20V13C27 9.13401 23.866 6 20 6C16.134 6 13 9.13401 13 13V20C13 23.866 16.134 27 20 27Z", stroke: "#FFB36E", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      React.createElement('path', { d: "M32 19V20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20V19", stroke: "#FFB36E", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      React.createElement('path', { d: "M20 32V36", stroke: "#FFB36E", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
      React.createElement('circle', { cx: "20", cy: "16", r: "4", fill: "#FFB36E", fillOpacity: "0.3" }),
      React.createElement('text', { x: "20", y: "17.5", fontFamily: "Arial, sans-serif", fontSize: "4", fontWeight: "bold", fill: "#C87018", textAnchor: "middle" }, "AI")
    )
  );
  
  export const WritingColoredIcon = () => (
      React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          React.createElement('path', { d: "M13.1667 29.3333L26.8333 15.6667L24.3333 13.1667L10.6667 26.8333V29.3333H13.1667Z", stroke: "#FFD166", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M23.1667 14.3333L25.6667 11.8333C26.1583 11.3417 26.1583 10.525 25.6667 10.0333L24.9667 9.33333C24.475 8.84167 23.6583 8.84167 23.1667 9.33333L20.6667 11.8333", stroke: "#FFD166", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
      )
  );
  
  export const ReadingColoredIcon = () => (
      React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          React.createElement('circle', { cx: "18", cy: "18", r: "9", stroke: "#1EE3CF", strokeWidth: "2" }),
          React.createElement('path', { d: "M25 25L31 31", stroke: "#1EE3CF", strokeWidth: "2", strokeLinecap: "round" })
      )
  );
  
  export const ListeningColoredIcon = () => (
      React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
        React.createElement('path', { d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072M12 8v8m-2-4h4", stroke: "#57C4E5", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
      )
  );
  
  export const MaterialsIcon = () => (
      React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 40 40", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
          React.createElement('path', { d: "M26 34H14C12.8954 34 12 33.1046 12 32V8C12 6.89543 12.8954 6 14 6H21L28 13V32C28 33.1046 27.1046 34 26 34Z", stroke: "#8B95E9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M20 28V20", stroke: "#8B95E9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M17 25L20 28L23 25", stroke: "#8B95E9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
          React.createElement('path', { d: "M21 6V13H28", stroke: "#8B95E9", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })
      )
  );


export const ChevronRightIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })
  )
);

export const PlayIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement('path', { d: "M8 5v14l11-7z" })
  )
);

export const StopIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor" },
    React.createElement('path', { d: "M6 6h12v12H6z" })
  )
);

export const MicrophoneIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" })
  )
);

export const BackIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" })
  )
);

export const InfoIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);

export const PlayCircleIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" })
  )
);

export const CheckCircleIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
    )
);

export const CheckSolidCircleIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })
    )
);

export const RefreshIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-4.991v4.99" })
  )
);

export const UserIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })
  )
);

export const ChartBarIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
     React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" })
  )
);

export const MailIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" })
    )
);

export const LockClosedIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" })
    )
);

export const BookOpenIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" })
    )
);

export const CalendarIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" })
    )
);

export const CloseIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
    )
);

export const ChatBubbleLeftRightIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097M16.5 7.5v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5v1.875m9.375-3.375H6.375m9.375 3.375c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72 3.72a1.125 1.125 0 01-1.59 0l-3.72-3.72c-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.97.616-1.813 1.5-2.097m3.75 3.375c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5z" })
    )
);

export const EmailIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" })
    )
);

export const TelegramIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" })
    )
);

export const ChevronDoubleLeftIcon = ({ className }) => (
    React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" })
    )
);

// SpeakerIcon from the original user file
export const SpeakerIcon = ({ className }) => (
  React.createElement('svg', { className, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728m2.828 9.9a5 5 0 010-7.072M12 8v8m-2-4h4" })
  )
);
