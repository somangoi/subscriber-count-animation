import { useEffect, useState } from "react";

const CountUp = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const startTime = performance.now();
    console.log("performanceStartTime", startTime);
    const duration = 3000;
    const startValue = 1;
    const endValue = 147;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      setCount(currentValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        const endTime = performance.now();
        console.log("performanceEndTime", endTime);
        console.log("performanceTime", endTime - startTime);
      }
    };

    let frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-900">{count}M</div>
        <p className="mt-4 text-gray-600 text-lg">Subscribers</p>
      </div>
    </div>
  );
};

export default CountUp;
