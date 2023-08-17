import React from 'react'

export default function FootTrack() {

    

    return (
        <>
            <canvas
                id="myCanvasTrack"
                width={(window.innerWidth * 15) / 100}
                height={(window.innerWidth * 15) / 100}
                style={{
                    position: "fixed",
                    top: "6%",
                    right: "calc(3% + 48px)",
                    borderRadius: "10px",
                }}
            ></canvas>
            <canvas
                id="myCanvasCircle"
                width={(window.innerWidth * 15) / 100}
                height={(window.innerWidth * 15) / 100}
                style={{
                    position: "fixed",
                    top: "6%",
                    right: "calc(3% + 48px)",
                    borderRadius: "10px",
                }}
            ></canvas>
        </>
    )
}
