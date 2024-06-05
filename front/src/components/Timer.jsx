import React, { useState, useEffect } from 'react';

function Timer({style}) {
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${minutes.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  })}:${seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;

  return (
    <div style={style}>{formattedTime}</div>
  );
}

export default Timer;
