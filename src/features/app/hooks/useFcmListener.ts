import { useEffect } from 'react';
import { fcmService } from '../FirebaseMessageService';

export const configureServerKey = "no.iktdev.streamit.messaging.ConfigureServer"

export const useFcmListener = (
  topic: string,
  callback: (payload: any) => void
) => {
  useEffect(() => {
    fcmService.addListener(topic, callback);

    return () => {
      fcmService.removeListener(topic, callback);
    };
  }, [topic, callback]);
};
