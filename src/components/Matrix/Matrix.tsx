import content from "*.svg";
import * as React from  "react";
import "./matrix.css";

const Matrix = () => {
    const [numberItem, setNumberItem] = React.useState(12);
    const [itemRender, setItemRender] = React.useState("");
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = React.useState(window.innerHeight);
    const matrix_render = React.useRef<HTMLCanvasElement>(null);
    
    React.useEffect(() => {
        let interval = renderMatrix();
        window.addEventListener("resize", () => {
            setWindowWidth(() => window.innerWidth);
            setWindowHeight(() => window.innerHeight);
        });

        chrome.runtime.onMessage.addListener((message) => {
            console.log(message);
            switch (message.type) {
                case "" : 

                    break;
                default:
                    break;
            }
        });

        return () => interval && clearInterval(interval);
    },[windowWidth, windowHeight]);

    const renderMatrix = () => {
        if(matrix_render.current) {
            const matrix_canvas : HTMLCanvasElement = matrix_render.current;
            matrix_canvas.width = windowWidth;
            matrix_canvas.height= windowHeight;

            const letters : string = 'ABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZABCDEFGHIJKLMNOPQRSTUVXYZ'; 
            const letterArr : string[] = letters.split("");
            const fontSize : number = 20;
            const column : number = windowWidth / fontSize;
            const drops : number[] = [];
            for(let i = 0; i < column; i++) {
                drops[i] = 1;
            }

            const context  = matrix_canvas.getContext('2d');
            if(context) {
                context.fillStyle = "rgba(0, 0, 0, .1)";
                context?.fillRect(0, 0, matrix_canvas.width, matrix_canvas.height);
                return setInterval(() => {
                    // context.fillStyle = "rgba(0, 0, 0, .1)";
                    // context?.fillRect(0, 0, matrix_canvas.width, matrix_canvas.height);
                    for (let i = 0; i < drops.length; i++) {
                        let text = letterArr[Math.floor(Math.random() * letters.length)];
                        context.fillStyle = '#0f0';
                        context?.fillText(text, i * fontSize, drops[i] * fontSize);
                        drops[i]++;
                        if (drops[i] * fontSize > matrix_canvas.height && Math.random() > .95) {
                            drops[i] = 0;
                        }
                    }
                }, 50);
            }
        }
        return undefined;
    };


    return (
        <div className="maxtrix_container">
            <canvas id="matrix_render" ref={matrix_render}></canvas>
        </div>
    );
}

export {Matrix};