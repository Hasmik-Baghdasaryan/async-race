import { useAppSelector } from '@/store/hooks';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

export function useCarAnimation(
  carId: number,
  trackRef: RefObject<HTMLDivElement>,
  finishRef: RefObject<HTMLDivElement>,
  carRef: RefObject<HTMLDivElement>,
  startRef: RefObject<HTMLDivElement>
) {
  const position = useRef<number>(0);
  const startTime = useRef<number | null>(null);
  const requestAnimationFrameId = useRef<number | null>(null);
  const isRunning = useRef(false);
  const progress = useRef<number>(0);

  const duration = useAppSelector(
    (state) => state.race.engines[carId]?.duration
  );
  const status = useAppSelector((state) => state.race.engines[carId]?.status);

  const getTrackWidth = useCallback(() => {
    return (
      (trackRef.current?.offsetWidth ?? 0) -
      (finishRef.current?.offsetWidth ?? 0) -
      (startRef.current?.offsetWidth ?? 0) -
      (carRef.current?.offsetWidth ?? 0) +
      55
    );
  }, [carRef, trackRef, startRef, finishRef]);

  useEffect(() => {
    if (status === 'started') {
      startTime.current = null;
      isRunning.current = true;

      function animate(currentTime: number) {
        if (!isRunning.current) return;
        const trackWidth = getTrackWidth();

        if (startTime.current === null) {
          startTime.current = currentTime;
        }

        progress.current = Math.min(
          (currentTime - startTime.current) / duration,
          1
        );
        position.current = progress.current * trackWidth;

        if (carRef.current) {
          carRef.current.style.transform = `translateX(${position.current}px)`;
        }

        if (progress.current < 1) {
          requestAnimationFrameId.current = requestAnimationFrame(animate);
        } else {
          cancelAnimationFrame(requestAnimationFrameId.current);
        }
      }
      requestAnimationFrameId.current = requestAnimationFrame(animate);
    }

    if (status === 'stopped' || status === 'broken') {
      isRunning.current = false;
      if (requestAnimationFrameId.current !== null) {
        cancelAnimationFrame(requestAnimationFrameId.current);
      }
      requestAnimationFrameId.current = null;
      position.current = 0;
      if (status === 'stopped') {
        if (carRef.current) {
          carRef.current.style.transform = `translateX(${position.current}px)`;
        }
      }
    }

    return () => {
      if (requestAnimationFrameId.current !== null) {
        cancelAnimationFrame(requestAnimationFrameId.current);
      }
    };
  }, [status, duration, getTrackWidth, carRef]);

  useEffect(() => {
    function handleResize() {
      if (carRef.current) {
        carRef.current.style.transform = `translateX(${progress.current * getTrackWidth()}px)`;
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getTrackWidth, carRef]);
}
