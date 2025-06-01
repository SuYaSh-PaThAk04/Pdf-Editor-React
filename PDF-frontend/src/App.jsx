import { useState } from 'react';
import PDFUploader from './components/PdfLoader';
import PdfViewer from './components/PdfViewer';
import PDFEditorTools from './components/PdfTools';
import { saveAs } from 'file-saver';
import './css/App.css';

function App() {
  const [pdfData, setPdfData] = useState(null);
  const [tool, setTool] = useState(null);

  const handleSave = () => {
    const canvasElements = document.querySelectorAll('canvas');
    const width = canvasElements[0]?.width || 600;
    const height = Array.from(canvasElements).reduce((sum, c) => sum + c.height, 0);

    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = width;
    mergedCanvas.height = height;
    const ctx = mergedCanvas.getContext('2d');

    let yOffset = 0;
    canvasElements.forEach((c) => {
      ctx.drawImage(c, 0, yOffset);
      yOffset += c.height;
    });

    mergedCanvas.toBlob((blob) => {
      saveAs(blob, 'edited.pdf');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React PDF Editor</h1>
      <PDFUploader onFileSelect={setPdfData} />
      <PDFEditorTools setTool={setTool} currentTool={tool} />
      {pdfData && <PdfViewer pdfData={pdfData} tool={tool} />}
      <button className="SaveBtn" onClick={handleSave} disabled={!pdfData}>Save PDF</button>
    </div>
  );
}

export default App;
