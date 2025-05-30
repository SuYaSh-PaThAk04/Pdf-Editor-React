import React from 'react';

const PDFUploader = ({ onFileSelect }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();

    reader.onload = () => {
  const arrayBuffer = reader.result;
  const cloned = new Uint8Array(arrayBuffer.slice(0)); 
  onFileSelect(cloned);
};

      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  return (
    <div className="uploader">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
};

export default PDFUploader;
