import React, { useState, useRef,useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { SketchPicker } from 'react-color'

const GameCanvas = (props) => {
    const state = useSelector((state) => state);
    const canvasRef = useRef(null)
    const dispatch = useDispatch();
    const canvasSize = 800;

    function getBoardColor(i,j,boardSize){
        let c1 = i/(boardSize-1);
        if(j%2==1)c1=1-c1;
        let c=[[255,0,0],[0,255,0],[0,0,255]]
        let st = j%3;
        let end = (j+1)%3;
        let r1=(c1*c[st][0]+(1-c1)*c[end][0]+765)/4;
        let b1=(c1*c[st][1]+(1-c1)*c[end][1]+765)/4;
        let g1=(c1*c[st][2]+(1-c1)*c[end][2]+765)/4;
        return `rgb(${r1},${g1},${b1})`
    }

    function drawBoard(ctx){
        ctx.strokeStyle = 'black';
        const boardSize = state.gameState.config.boardSize;
        const pieceSize = canvasSize/boardSize;
        for(let j=0;j<boardSize;j++){
            for(let i=0;i<boardSize;i++){
        ctx.beginPath();
        ctx.fillStyle = getBoardColor(i,j,boardSize);
        ctx.rect(i*pieceSize, j*pieceSize, pieceSize, pieceSize);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
            }
        }       
    }

    function drawStar(ctx,cx,cy,spikes,outerRadius,innerRadius){
        var rot=Math.PI/2*3;
        var x=cx;
        var y=cy;
        var step=Math.PI/spikes;
  
        ctx.beginPath();
        ctx.moveTo(cx,cy-outerRadius)
        for(let i=0;i<spikes;i++){
          x=cx+Math.cos(rot)*outerRadius;
          y=cy+Math.sin(rot)*outerRadius;
          ctx.lineTo(x,y)
          rot+=step
  
          x=cx+Math.cos(rot)*innerRadius;
          y=cy+Math.sin(rot)*innerRadius;
          ctx.lineTo(x,y)
          rot+=step
        }
        ctx.lineTo(cx,cy-outerRadius);
        ctx.closePath();
        ctx.strokeStyle='black';
        ctx.stroke();
    } 

    function drawCircle(ctx, cx, cy, color, radius){
        ctx.beginPath();
        ctx.fillStyle=color;
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.stroke(); 
        ctx.fill();
    }

    function drawPieces(ctx){
        const pieces=state.gameState.board.pieces;
        const stars=state.gameState.board.stars;
        const boardSize=state.gameState.config.boardSize;
        const pieceSize = canvasSize/boardSize;
        const home=IJToDev([0,0]);
        const end=IJToDev([boardSize-1,boardSize-1]);
        drawStar(ctx,home[0],home[1],5,pieceSize*0.30,pieceSize*0.15);
        drawStar(ctx,end[0],end[1],6,pieceSize*0.30,pieceSize*0.15);
        //console.log(state.gameState.board)
        for(let i in stars){
            const p = IJToDev(posToIJ(stars[i]));
            drawStar(ctx,p[0],p[1],4,pieceSize*0.30,pieceSize*0.15);
        }
        for(let i in pieces){
            let off=0;
            for(let k=0;k<i;k++){
                if(pieces[i][1]==pieces[k][1])off++;
            }
            let pos = posToIJ(pieces[i][1]);
            let color = state.gameState.players[pieces[i][0]].color;
            let d = IJToDev(pos);
            drawCircle(ctx, d[0], d[1]-off*pieceSize/15, color, 0.2*pieceSize)
        }
    };

    function drawLastPath(ctx){
        const lp=state.gameState.board.pathlist;
        if(!lp)return;
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        let k=IJToDev(posToIJ(lp[0]));
        ctx.moveTo(k[0],k[1])
        for(let i=1;i<lp.length;i++){
            k=IJToDev(posToIJ(lp[i]));
            ctx.lineTo(k[0],k[1])
        }
        ctx.stroke();
        ctx.setLineDash([])
    }

    function posToIJ(pos){//return i,j from pos
        let boardSize=state.gameState.config.boardSize;
        let j = Math.floor(pos/boardSize);
        let i = pos-j*boardSize;
        if(j%2==1)i=boardSize-i-1;
        return [i,j];
    }

    function IJToPos(i){//return i,j from pos
        let boardSize=state.gameState.config.boardSize;
        let i1=i[0];
        if(i[1]%2==1)i1=boardSize-i1-1;
        return i1+i[1]*boardSize;
    }

    function IJToDev(i){
        const boardSize=state.gameState.config.boardSize;
        const pieceSize = canvasSize/boardSize;
        const f = (x)=>(x+0.5)*pieceSize;
        return [f(i[0]),canvasSize-f(i[1])];
    }

    function DevToIJ(i){
        const boardSize=state.gameState.config.boardSize;
        const pieceSize = canvasSize/boardSize;
        const f = (x)=>Math.floor(x/pieceSize);
        return [f(i[0]),f(canvasSize-i[1])];
    }

    const draw = (ctx)=>{
        ctx.clearRect(0, 0, canvasSize, canvasSize)
        drawBoard(ctx);
        drawLastPath(ctx);
        drawPieces(ctx);
    }

    useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    draw(context)
    },[state])

    function getCursorPosition(e){
        const canvas = e.target;
        const rect = canvas.getBoundingClientRect()
        const elx = e.clientX - rect.left
        const ely = e.clientY - rect.top
        const x = elx * canvas.width/rect.width;
        const y = ely * canvas.height/rect.height;
        dispatch({emit:'CANVAS_CLICK', x: IJToPos(DevToIJ([x,y]))});
    };

    return (
        <div className='canvasParent'>
            <canvas className='canvas' ref={canvasRef} height={canvasSize} width={canvasSize} onMouseDown={getCursorPosition}/>
        </div>
    )
};

export default GameCanvas;