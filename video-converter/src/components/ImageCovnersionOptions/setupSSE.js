import { eventSource, GlobalData } from './TestImageConverter.vue';

export const setupSSE = () => {
  console.log(1);

  //   const eventSource = new EventSource('https://video-converter-api.vercel.app/sse');
  eventSource = new EventSource('http://localhost:8080/sse');

  eventSource.addEventListener('progress', (event) => {
    const data = JSON.parse(event.data);
    GlobalData.progressElement = data.percentage;
    console.log(data.percentage);
  });

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
  };
};
