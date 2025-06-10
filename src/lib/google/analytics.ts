// src/lib/google/analytics.ts
import ReactGA from 'react-ga4';

const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const initAnalytics = (): void => {
    if (GA_ID) {
        ReactGA.initialize(GA_ID);
    } else {
        console.warn('Google Analytics ID is not defined.');
    }
};

export const trackPageview = (path: string): void => {
    ReactGA.send({ hitType: 'pageview', page: path });
};
