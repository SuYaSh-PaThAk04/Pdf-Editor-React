import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ pdfData, tool }) => {
  const [numPages, setNumPages] = useState(null);
  const canvasRefs = useRef([]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    canvasRefs.current = Array.from({ length: numPages });
  };

  const attachToolToCanvas = (canvas, tool) => {
    const ctx = canvas.getContext('2d');

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

      ctx.beginPath();
      ctx.moveTo(startX, startY);

      const handleMouseMove = (ev) => {
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;

        if (tool === 'erase') {
          ctx.clearRect(x - 10, y - 10, 20, 20);
        } else if (tool === 'blur') {
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillRect(x - 10, y - 10, 20, 20);
        } else {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      };

      const handleMouseUp = () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
    };

    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  };

  useEffect(() => {
    const cleanups = canvasRefs.current.map((canvas) => {
      if (canvas) {
        return attachToolToCanvas(canvas, tool);
      }
    });

    return () => {
      cleanups.forEach((cleanup) => {
        if (typeof cleanup === 'function') cleanup();
      });
    };
  }, [tool, pdfData]);

  if (!pdfData) return null;

  return (
    <div className='pdf-container'>
      <Document file={{ data: new Uint8Array(pdfData) }} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (_, idx) => (
          <div
            key={idx}
            style={{ position: 'relative', marginBottom: '20px', width: 'fit-content' }}
          >
            <Page pageNumber={idx + 1} width={600} />
            <canvas
              ref={(el) => (canvasRefs.current[idx] = el)}
              width={600}
              height={800}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'auto',
              }}
            />
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
