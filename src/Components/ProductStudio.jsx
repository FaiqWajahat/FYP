'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { Layers, Move, Maximize, ShieldCheck } from 'lucide-react';

// --- Sub-components for Konva ---
const BackgroundImage = ({ src, stageWidth, stageHeight }) => {
  const [image] = useImage(src, 'anonymous');
  const imgProps = useMemo(() => {
    if (!image || !stageWidth || !stageHeight) return { width: 0, height: 0, x: 0, y: 0 };
    const imageRatio = image.width / image.height;
    const stageRatio = stageWidth / stageHeight;
    let newWidth, newHeight, newX, newY;
    if (stageRatio > imageRatio) {
      newWidth = stageWidth;
      newHeight = stageWidth / imageRatio;
      newX = 0;
      newY = (stageHeight - newHeight) / 2;
    } else {
      newHeight = stageHeight;
      newWidth = stageHeight * imageRatio;
      newX = (stageWidth - newWidth) / 2;
      newY = 0;
    }
    return { width: newWidth, height: newHeight, x: newX, y: newY };
  }, [image, stageWidth, stageHeight]);
  return <KonvaImage image={image} {...imgProps} listening={false} />;
};

const DraggableLogo = ({ imageSrc, isSelected, onSelect, logoProps, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(imageSrc);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        image={image}
        draggable
        x={logoProps.x}
        y={logoProps.y}
        width={logoProps.width}
        height={logoProps.height}
        rotation={logoProps.rotation}
        onDragEnd={(e) => onChange({ ...logoProps, x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...logoProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5) ? oldBox : newBox}
          borderStroke="#2563eb"
          anchorStroke="#2563eb"
          anchorFill="#ffffff"
          anchorSize={10}
          anchorCornerRadius={5}
        />
      )}
    </>
  );
};

// --- Main Studio Component ---
export default function ProductStudio({ 
  images, productTitle, isCustomizing, selectedFormat, 
  uploadedLogo, selectedLogoId, selectLogoId, logoProps, setLogoProps 
}) {
  const [activeImage, setActiveImage] = useState(0);
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full lg:w-[45%] space-y-6">
      <div className="sticky top-32">
        <div ref={containerRef} className="relative aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group mb-4">
          {stageSize.width > 0 && (
            <Stage width={stageSize.width} height={stageSize.height} onMouseDown={(e) => {
                if (e.target === e.target.getStage()) selectLogoId(null);
              }}>
              <Layer>
                <BackgroundImage src={images[activeImage]} stageWidth={stageSize.width} stageHeight={stageSize.height} />
                {isCustomizing && uploadedLogo && (
                  <DraggableLogo 
                    imageSrc={uploadedLogo} isSelected={selectedLogoId === 'logo1'} onSelect={() => selectLogoId('logo1')} 
                    logoProps={logoProps} onChange={(newAttrs) => setLogoProps(newAttrs)}
                  />
                )}
              </Layer>
            </Stage>
          )}
          {isCustomizing && (
            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-in fade-in z-30 pointer-events-none">
              <Layers size={12} /> {selectedFormat?.name} Mode
            </div>
          )}
          {isCustomizing && uploadedLogo && selectedLogoId && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 pointer-events-none animate-pulse">
               <Move size={14} /> Drag <Maximize size={14} className="ml-2"/> Resize
            </div>
          )}
        </div>
        
        {/* Thumbnails */}
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setActiveImage(idx)} className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-slate-900 ring-1 ring-slate-900' : 'border-transparent opacity-60 hover:opacity-100'}`}>
              <img src={img} alt="" className="w-full h-full object-cover"/>
            </button>
          ))}
        </div>

        {/* Factory Specs */}
        <div className="hidden lg:block mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
           <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><ShieldCheck size={16}/> Factory Specifications</h3>
           <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">GSM</span><span className="font-bold text-slate-900">400</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Material</span><span className="font-bold text-slate-900">100% Cotton</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Fit</span><span className="font-bold text-slate-900">Oversized</span></div>
              <div className="flex justify-between border-b border-slate-200 pb-2"><span className="text-slate-500">Origin</span><span className="font-bold text-slate-900">Sialkot, PK</span></div>
           </div>
        </div>
      </div>
    </div>
  );
}