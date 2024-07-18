export const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
export const suggestionWidth = 366;
export const apiRequest =
  'https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete';
