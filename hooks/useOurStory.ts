
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { OurStoryContent } from '../types';
import { INITIAL_OUR_STORY_CONTENT } from '../constants';

interface OurStoryContextType {
  ourStory: OurStoryContent;
  updateOurStory: (content: OurStoryContent) => Promise<void>;
}

const OurStoryContext = createContext<OurStoryContextType | undefined>(undefined);

export const OurStoryProvider = ({ children }: { children: ReactNode }) => {
  const [ourStory, setOurStory] = useState<OurStoryContent>(INITIAL_OUR_STORY_CONTENT);

  useEffect(() => {
    const ourStoryRef = doc(db, 'content', 'ourStory');
    const unsubscribe = onSnapshot(ourStoryRef, (docSnap) => {
        if (docSnap.exists()) {
            setOurStory(docSnap.data() as OurStoryContent);
        } else {
             console.log("No Our Story document found. Using initial data.");
             setOurStory(INITIAL_OUR_STORY_CONTENT);
        }
    });
    return () => unsubscribe();
  }, []);


  const updateOurStory = async (newContent: OurStoryContent) => {
    const ourStoryRef = doc(db, 'content', 'ourStory');
    await setDoc(ourStoryRef, newContent);
  };

  return React.createElement(OurStoryContext.Provider, {
    value: { ourStory, updateOurStory }
  }, children);
};

export const useOurStory = () => {
  const context = useContext(OurStoryContext);
  if (context === undefined) {
    throw new Error('useOurStory must be used within an OurStoryProvider');
  }
  return context;
};