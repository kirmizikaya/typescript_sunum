"use client"
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface Props {
    index: number;
    id: string;
    imageUrl: string;
    title: string;
    classname: string;
}



const ProductCard: React.FC<Props> = ({ index, id, imageUrl, title, classname }) => {

    return (
        <div className={"card"}>
            <div className="imageContainer">
                <Image 
                  alt={title}
                  src={imageUrl}
                  preload={index < 5 ? true : false}
                placeholder="blur"
                />
            </div>
        </div>
    );
};

export default ProductCard;
