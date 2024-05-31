import React, { useEffect, useState } from 'react';

function AudioRecorder({ onChangeUrl, onChangeBuffer, onStop, onChangeBloob, record }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  useEffect(() => {
    if (record) {
      startRecording();
      // console.log('começou a gravação');
    } else {
      stopRecording();
      // console.log('parou a gravação');
    }
  }, [record]);
  function blobToBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function () {
        const buffer = new Uint8Array(reader.result);
        resolve(buffer);
      };

      reader.onerror = function () {
        reject(new Error('Erro ao converter o Blob para buffer.'));
      };

      reader.readAsArrayBuffer(blob);
    });
  }
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioBuffer = await blobToBuffer(audioBlob);
        if (onChangeBuffer) { onChangeBuffer(audioBuffer); }
        if (onChangeUrl) { onChangeUrl(audioUrl); }
        if (onChangeBloob) { onChangeBloob(audioBlob); }
        // blobToBuffer(audioBlob, (result) => {
        //   if (onChangeBuffer) { onChangeBuffer(result) }
        // })
        if (onStop) onStop()

        setMediaRecorder(null);

      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Erro ao iniciar a gravação:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  return null
}

export default AudioRecorder;


function AudioRecorder2() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setIsRecording(false);
      };
      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Erro ao iniciar a gravação:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'recording.wav';
      link.click();
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Iniciar Gravação
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Parar Gravação
      </button>
      {audioUrl && (
        <div>
          <button onClick={handleDownload}>Baixar Áudio</button>
        </div>
      )}
    </div>
  );
}
