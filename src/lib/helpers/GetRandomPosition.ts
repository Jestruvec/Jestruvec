export const GetRandomPosition = () => {
  const outsideCenter = (min: number, max: number): number => {
    const value =
      (Math.random() < 0.5 ? -1 : 1) * (min + Math.random() * (max - min));
    return value;
  };

  const inRange = (min: number, max: number): number => {
    return min + Math.random() * (max - min);
  };

  return { outsideCenter, inRange };
};
