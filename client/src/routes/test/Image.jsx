import React, { useState, useEffect } from "react";
import { Image } from "react-konva";

const ImageForAnnotation = ({ imageUrl, setCanvasMeasures, setPoints }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const imageToLoad = new window.Image();
    imageToLoad.src = imageUrl;

    imageToLoad.onload = () => {
      setImage(imageToLoad);
      setCanvasMeasures({
        width: imageToLoad.width,
        height: imageToLoad.height,
      });
    };

    return () => {
      // Clean up
      imageToLoad.onload = null;
    };
  }, [imageUrl, setImage, setCanvasMeasures]);

  return <Image image={image} />;
};

export default ImageForAnnotation;
