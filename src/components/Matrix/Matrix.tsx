import * as React from  "react";
import "./matrix.css";

const Matrix = (numItem : number = 12, item: string = "") => {
    const [numberItem, setNumberItem] = React.useState(numItem);
    const [itemRender, setItemRender] = React.useState(item);

    return (
        <div className="maxtrix_container">
            <canvas id="matrix_render"></canvas>
        </div>
    );
}

export {Matrix};