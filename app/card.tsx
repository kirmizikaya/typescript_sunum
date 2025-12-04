"use client"
import React, { useEffect, useRef, useState } from "react";

interface Props {
    index: number;
    id: string;
    imageUrl: string;
    title: string;
    classname: string;
}



const ProductCard: React.FC<Props> = ({ index, id, imageUrl, title, classname }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    return (
        <div className={"card"}>
            <div className="imageContainer">
                <img
                    ref={imgRef}
                    id={"card_" + id}
                    src={imageUrl}
                    alt={title}
                    loading={index < 5 ? "eager": "lazy"}
                    className={`image ${classname}`}
                    onError={() => {
                        const node = document.getElementById("card_" + id) as HTMLImageElement;
                        if (!node) return;
                        // meşhur 1 px lik T gif
                        node.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
                        node.style.cssText = "background-color:#f7f7f7;width:100%;height:100dvh";

                    }}
                />
            </div>
        </div>
    );
};

export default ProductCard;
