
const debounce = <F extends ((...args: any) => any)>(func: F, waitFor: number) => {
    let timeout: number = 0

    const debounced = (...args: any) => {
        clearTimeout(timeout)
        setTimeout(() => func(...args), waitFor)
    }
    
    return debounced as (...args: Parameters<F>) => ReturnType<F>
}


const throttle = (fn: Function, wait: number = 300) => {
    let inThrottle: boolean,
      lastFn: ReturnType<typeof setTimeout>,
      lastTime: number;
    return function (this: any) {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(() => {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
  };

export {debounce, throttle};