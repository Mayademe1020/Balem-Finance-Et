import type { Slide } from '../types';

const API_ENDPOINT = '/api/slides/draft';

export const saveDraftToAPI = async (slides: Slide[]): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slides, timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      console.error('Failed to save draft to API:', response.statusText);
    }
  } catch (error) {
    console.error('Error saving draft to API:', error);
  }
};

export const loadDraftFromAPI = async (): Promise<Slide[] | null> => {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.slides;
  } catch (error) {
    console.error('Error loading draft from API:', error);
    return null;
  }
};
