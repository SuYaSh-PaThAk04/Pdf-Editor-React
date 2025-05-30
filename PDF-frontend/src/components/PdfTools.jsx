import React from 'react';

const PDFEditorTools = ({ setTool }) => {
  return (
    <div className="toolbox">
      <button onClick={() => setTool('blur')}>Blur</button>
      <button onClick={() => setTool('erase')}>Erase</button>
      <button onClick={() => setTool('text')}>Add Text</button>
    </div>
  );
};

export default PDFEditorTools;
