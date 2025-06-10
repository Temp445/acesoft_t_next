// src/lib/google/ads.ts

// Configuration
const AD_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL;


interface TrackConversionOptions {
  event?: string;
  form_id?: string;
  form_name?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

interface GtagEvent {
  send_to: string;
  form_id?: string;
  form_name?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}

// Global declarations
declare global {
  interface Window {
    dataLayer?: any[];
    gtag: (...args: any[]) => void;
  }
}

// State management
let isInitialized = false;
let isInitializing = false;
let initializationPromise: Promise<void> | null = null;

const validateConfig = (): boolean => {
  if (!AD_ID) {
    console.error('Google Ads ID is not defined. Please set NEXT_PUBLIC_GOOGLE_ADS_ID in your environment variables.');
    return false;
  }
  
  if (!CONVERSION_LABEL) {
    console.error('Google Ads Conversion Label is not defined. Please set NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL in your environment variables.');
    return false;
  }
  
  return true;
};


const isGtagReady = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         Array.isArray(window.dataLayer);
};


const loadGoogleAdsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not available (SSR environment)'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${AD_ID}`;
    script.async = true;
    
    script.onload = () => {
      try {
    
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer!.push(arguments);
        };
        
        // Configure gtag
        window.gtag('js', new Date());
        window.gtag('config', AD_ID!, {
          send_page_view: false, 
        });
        
        isInitialized = true;
        console.log('Google Ads initialized successfully');
        resolve();
      } catch (error) {
        console.error('Failed to initialize Google Ads:', error);
        reject(error);
      }
    };
    
    script.onerror = () => {
      const error = new Error('Failed to load Google Ads script');
      console.error(error);
      reject(error);
    };
    
    document.head.appendChild(script);
  });
};


export const initGoogleAds = async (): Promise<void> => {
  // Return existing promise if already initializing
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }
  
  // Return immediately if already initialized
  if (isInitialized && isGtagReady()) {
    return Promise.resolve();
  }
  
  // Validate configuration
  if (!validateConfig()) {
    return Promise.reject(new Error('Invalid Google Ads configuration'));
  }
  
  // Start initialization
  isInitializing = true;
  initializationPromise = loadGoogleAdsScript()
    .finally(() => {
      isInitializing = false;
    });
  
  return initializationPromise;
};

const ensureInitialized = async (): Promise<void> => {
  if (!isInitialized || !isGtagReady()) {
    await initGoogleAds();
  }
};


export const trackConversion = async (options: TrackConversionOptions = {}): Promise<void> => {
  try {

    await ensureInitialized();
    

    if (!isGtagReady()) {
      throw new Error('Google Ads is not properly initialized');
    }
    
    if (!validateConfig()) {
      throw new Error('Invalid Google Ads configuration');
    }
    
    const event = options.event ?? 'conversion';
    const eventData: GtagEvent = {
      send_to: `${AD_ID}/${CONVERSION_LABEL}`,
    };
    
    if (options.form_id) eventData.form_id = options.form_id;
    if (options.form_name) eventData.form_name = options.form_name;
    if (options.value) eventData.value = options.value;
    if (options.currency) eventData.currency = options.currency;
    if (options.transaction_id) eventData.transaction_id = options.transaction_id;
    

    window.gtag('event', event, eventData);
    
    console.log('Google Ads conversion tracked:', {
      event,
      ...eventData
    });
    
  } catch (error) {
    console.error('Failed to track conversion:', error);
    throw error; 
  }
};


export const trackPageView = async (page_title?: string, page_location?: string): Promise<void> => {
  try {
    await ensureInitialized();
    
    if (!isGtagReady() || !validateConfig()) {
      throw new Error('Google Ads is not properly initialized');
    }
    
    const eventData: any = {
      send_to: AD_ID,
    };
    
    if (page_title) eventData.page_title = page_title;
    if (page_location) eventData.page_location = page_location;
    
    window.gtag('event', 'page_view', eventData);
    console.log('Google Ads page view tracked');
    
  } catch (error) {
    console.error('Failed to track page view:', error);
    throw error;
  }
};

export const getInitializationStatus = () => ({
  isInitialized,
  isInitializing,
  isGtagReady: isGtagReady(),
  hasValidConfig: validateConfig(),
});


export const resetInitialization = (): void => {
  isInitialized = false;
  isInitializing = false;
  initializationPromise = null;
};