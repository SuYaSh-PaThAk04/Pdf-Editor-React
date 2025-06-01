import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfData, tool }) => {
  const [numPages, setNumPages] = useState(null);
  const canvasRefs = useRef([]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    canvasRefs.current = Array(numPages).fill(null);
  };

  useEffect(() => {
    canvasRefs.current.forEach((canvas) => {
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      let isDrawing = false;

      const handleMouseDown = (e) => {
        const rect = canvas.getBoundingClientRect();
        const startX = e.clientX - rect.left;
        const startY = e.clientY - rect.top;

        if (tool === 'text') {
          const text = prompt('Enter text:');
          if (text) {
            ctx.font = '20px Arial';
            ctx.fillStyle = 'red';
            ctx.fillText(text, startX, startY);
          }
          return;
        }

        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
      };

      const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'erase') {
          ctx.clearRect(x - 5, y - 5, 10, 10);
        } else if (tool === 'blur') {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillRect(x - 5, y - 5, 10, 10);
        } else {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      };

      const handleMouseUp = () => {
        isDrawing = false;
      };

      // Remove existing listeners first
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
    });
  }, [tool, pdfData]);

  if (!pdfData) return null;

  return (
    <div className="pdf-container">
      <Document file={{ data: new Uint8Array(pdfData) }} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, index) => (
          <div key={index} style={{ position: 'relative', marginBottom: '30px' }}>
            <Page pageNumber={index + 1} width={600} />
            <canvas
              ref={(el) => (canvasRefs.current[index] = el)}
              width={600}
              height={800}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'auto',
                zIndex: 10,
              }}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;

