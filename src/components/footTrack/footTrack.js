import React, { useEffect, useImperativeHandle } from 'react'
let ctx, ctxCircle, canvasWidth

const FootTrack = React.forwardRef((props, refs) => {

    useEffect(() => {
        if (document.getElementById("myCanvasTrack")) {
            var c = document.getElementById("myCanvasTrack");
            ctx = c.getContext("2d");
            var c1 = document.getElementById("myCanvasCircle");
            ctxCircle = c1.getContext("2d");
            canvasWidth = c.getBoundingClientRect().width;
            canvasInit1(ctx, canvasWidth);
        }
    }, [])

    // const canvasText1 = (ctx, width, htmlWidth) => {
    //     ctx.clearRect(260, 110, 35, 35);
    //     ctx.fillStyle = "#333";
    //     ctx.fillRect(260, 110, 35, 35);
    //     ctx.font = "20px Arial";
    //     ctx.fillStyle = "#fff";
    //     ctx.fillText(rightTopPropSmooth, 265, 140);

    //     ctx.clearRect(260, 155, 35, 35);
    //     ctx.fillStyle = "#333";
    //     ctx.fillRect(260, 155, 35, 35);
    //     ctx.font = "20px Arial";
    //     ctx.fillStyle = "#fff";
    //     ctx.fillText(rightBottomPropSmooth, 265, 175);

    //     ctx.clearRect(5, 110, 35, 35);
    //     ctx.fillStyle = "#333";
    //     ctx.fillRect(5, 110, 35, 35);
    //     ctx.font = "20px Arial";
    //     ctx.fillStyle = "#fff";
    //     ctx.fillText(leftTopPropSmooth, 5, 140);

    //     ctx.clearRect(5, 155, 35, 35);
    //     ctx.fillStyle = "#333";
    //     ctx.fillRect(5, 155, 35, 35);
    //     ctx.font = "20px Arial";
    //     ctx.fillStyle = "#fff";
    //     ctx.fillText(leftBottomPropSmooth, 5, 175);

    //     ctx.clearRect(110, 260, 35, 35);
    //     ctx.fillStyle = "#333";
    //     ctx.fillRect(110, 260, 36, 36);
    //     ctx.font = "20px Arial";
    //     ctx.fillStyle = "#fff";
    //     ctx.fillText(leftPropSmooth, leftPropSmooth < 10 ? 135 : 120, 290);

    //     ctx.clearRect(155, 260, 35, 35);
    //     ctx.fillStyle = "#333";
    //     ctx.fillRect(155, 260, 35, 35);
    //     ctx.font = "20px Arial";
    //     ctx.fillStyle = "#fff";
    //     ctx.fillText(rightPropSmooth, 155, 290);
    // }

    const canvasText2 = ({ ctx, width, htmlWidth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth }) => {
        ctx.font = `${htmlWidth / 100}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(rightTopPropSmooth, (265 * width) / 300, (140 * width) / 300);

        ctx.font = `${htmlWidth / 100}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(
            rightBottomPropSmooth,
            (265 * width) / 300,
            (175 * width) / 300
        );

        ctx.font = `${htmlWidth / 100}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(leftTopPropSmooth, (5 * width) / 300, (140 * width) / 300);

        ctx.font = `${htmlWidth / 100}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(leftBottomPropSmooth, (5 * width) / 300, (175 * width) / 300);

        ctx.font = `${htmlWidth / 100}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(
            leftPropSmooth,
            leftPropSmooth < 10 ? (135 * width) / 300 : (120 * width) / 300,
            (290 * width) / 300
        );

        ctx.font = `${htmlWidth / 100}px Arial`;
        ctx.fillStyle = "#fff";
        ctx.fillText(rightPropSmooth, (155 * width) / 300, (290 * width) / 300);
    }

    const canvasInit1 = (ctx, width) => {
        ctx.clearRect(0, 0, width, width);
        ctx.beginPath();
        // ctx.strokeStyle = '#01F1E3';
        // ctx.strokeRect(1, 1, width - 1, width - 1)
        ctx.fillStyle = "#191932";
        ctx.fillRect(1, 1, width - 1, width - 1);

        ctx.beginPath();
        ctx.strokeStyle = "#5A5A89";
        for (let i = 0; i < 9; i++) {
            ctx.moveTo(1, ((i + 1) * 30 * width) / 300);
            ctx.lineTo(width - 1, ((i + 1) * 30 * width) / 300);
        }

        for (let i = 0; i < 9; i++) {
            ctx.moveTo(((i + 1) * 30 * width) / 300, 1);
            ctx.lineTo(((i + 1) * 30 * width) / 300, width - 1);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((1 * width) / 300, (150 * width) / 300);
        ctx.lineTo((299 * width) / 300, (150 * width) / 300);
        ctx.moveTo((150 * width) / 300, (1 * width) / 300);
        ctx.lineTo((150 * width) / 300, (299 * width) / 300);
        ctx.stroke();

        ctx.strokeStyle = "#01F1E3";
        ctx.moveTo((150 * width) / 300, (150 * width) / 300);
    }

    const canvasInit = () => {
        canvasInit1(ctx, canvasWidth);
        if (ctxCircle) ctxCircle.clearRect(0, 0, canvasWidth, canvasWidth);
    }

    const circleMove = ({ arrSmooth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth }) => {
        ctx.strokeStyle = "#01F1E3";
        ctx.lineTo(
            (arrSmooth[0] * canvasWidth) / 32,
            (arrSmooth[1] * canvasWidth) / 32
        );
        ctx.stroke();
        ctxCircle.clearRect(0, 0, canvasWidth, canvasWidth);
        ctxCircle.beginPath();
        ctxCircle.fillStyle = "#991BFA";
        ctxCircle.arc(
            (arrSmooth[0] * canvasWidth) / 32,
            (arrSmooth[1] * canvasWidth) / 32,
            5,
            0,
            2 * Math.PI
        );
        ctxCircle.fill();
        canvasText2({ ctx: ctxCircle, width: canvasWidth, htmlWidth: window.innerWidth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth });
    }

    const saveCanvasAsImage = ({ctx , arrSmooth,canvasWidth}) => {
        ctx.beginPath();
        ctx.fillStyle = "#991BFA";
        ctx.arc(
          (arrSmooth[0] * canvasWidth) / 32,
          (arrSmooth[1] * canvasWidth) / 32,
          5,
          0,
          2 * Math.PI
        );
        ctx.fill();
        
        const canvas = document.getElementById("myCanvasTrack");
        const dataURL = canvas.toDataURL("image/png");
    
        // 创建一个虚拟链接来下载保存的图片
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "canvas_image.png";
        link.click();
      }

    const loadImg = ({ arrSmooth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth }) => {
        canvasText2({ ctx: ctx, width: canvasWidth, htmlWidth: window.innerWidth, rightTopPropSmooth, leftTopPropSmooth, leftBottomPropSmooth, rightPropSmooth, leftPropSmooth, rightBottomPropSmooth });
        saveCanvasAsImage({ctx,arrSmooth,canvasWidth});
        canvasInit1(ctx, canvasWidth);
    }

    useImperativeHandle(refs, () => ({
        circleMove,
        loadImg,
        canvasInit
    }));

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
})

export default FootTrack