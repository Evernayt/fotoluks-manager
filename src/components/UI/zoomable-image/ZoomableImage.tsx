import { useRef, ComponentProps, RefCallback } from 'react';
import mediumZoom, { Zoom, ZoomOptions } from 'medium-zoom';

type ZoomableImageProps = ComponentProps<'img'> & {
  options?: ZoomOptions;
};

const ZoomableImage = ({ options, ...props }: ZoomableImageProps) => {
  const zoomRef = useRef<Zoom | null>(null);

  function getZoom() {
    if (zoomRef.current === null) {
      zoomRef.current = mediumZoom({
        background: 'rgba(0, 0, 0, 0.48)',
        ...options,
      });
    }

    return zoomRef.current;
  }

  const attachZoom: RefCallback<HTMLImageElement> = (node) => {
    const zoom = getZoom();

    if (node) {
      zoom.attach(node);
    } else {
      zoom.detach();
    }
  };

  return <img {...props} ref={attachZoom} />;
};

export default ZoomableImage;
