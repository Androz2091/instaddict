// Performance monitoring utilities

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.startTimes = new Map();
    }

    start(label) {
        this.startTimes.set(label, performance.now());
    }

    end(label) {
        const startTime = this.startTimes.get(label);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.metrics.set(label, duration);
            this.startTimes.delete(label);
            return duration;
        }
        return null;
    }

    getMetric(label) {
        return this.metrics.get(label);
    }

    getAllMetrics() {
        return Object.fromEntries(this.metrics);
    }

    clear() {
        this.metrics.clear();
        this.startTimes.clear();
    }

    logMetrics() {
        console.group('Performance Metrics');
        for (const [label, duration] of this.metrics) {
            console.log(`${label}: ${duration.toFixed(2)}ms`);
        }
        console.groupEnd();
    }
}

// Memory usage monitoring
export function getMemoryUsage() {
    if (performance.memory) {
        return {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        };
    }
    return null;
}

// Debounce utility for performance optimization
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for performance optimization
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Lazy loading utility
export function createLazyLoader(loadFunction, threshold = 0.1) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadFunction(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold }
    );

    return {
        observe: (element) => observer.observe(element),
        unobserve: (element) => observer.unobserve(element),
        disconnect: () => observer.disconnect()
    };
}

export const perfMonitor = new PerformanceMonitor();
export default PerformanceMonitor;