import { useState } from 'react';
import PDFUploader from './components/PdfLoader';
import PdfViewer from './components/PdfViewer';
import PDFEditorTools from './components/PdfTools';
import { saveAs } from 'file-saver';
import "./css/App.css"
function App() {
  const [pdfData, setPdfData] = useState(null);
  const [tool, setTool] = useState(null);

  const handleSave = () => {
    const canvasElements = document.querySelectorAll('canvas');
    const mergedCanvas = document.createElement('canvas');
    const width = 600;
    const height = canvasElements.length * 800;

    mergedCanvas.width = width;
    mergedCanvas.height = height;
    const ctx = mergedCanvas.getContext('2d');

    let yOffset = 0;
    canvasElements.forEach((c) => {
      ctx.drawImage(c, 0, yOffset);
      yOffset += 800;
    });

    mergedCanvas.toBlob((blob) => {
      saveAs(blob, 'edited.pdf');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React PDF Editor</h1>
      <PDFUploader onFileSelect={setPdfData} />
      <PDFEditorTools setTool={setTool} />
      <button onClick={handleSave}>Save PDF</button>
      {pdfData && <PdfViewer pdfData={pdfData} tool={tool} />}
    </div>
  );
}

export default App;
