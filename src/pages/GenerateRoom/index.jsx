import React, { useEffect, useRef, useState } from 'react'
import { loadImage } from "canvas"
import "./style.css"
import { useAuth } from '../../contexts'
import axios from "axios"

const GenerateRoom = () => {
    const [fileState,setFileState] = useState()
    const [context,setContext] = useState("")

    const canvas = useRef()

    const imageInputRef = useRef()
    const facesRef = useRef()
    
    const [imageArrayData,setImageArrayData] = useState([])
    const [exportData,setExportData] = useState([])
    const [mapName, setMapName] = useState("temp")

    const positions = ["pz","nz","px","nx","py","ny"]

    const cubeMapStyle = {
        "width": "800px",
        "height": "600px",
        "position": "relative",
        "border": "1px solid #888",
        "background": "#eee",
        "marginTop": "15px"
      }


    // const pzRef = useRef()
    // const nzRef = useRef()
    // const pxRef = useRef()
    // const nxRef = useRef()
    // const pyRef = useRef()
    // const nyRef = useRef()

    let finished = 0;
    let workers = [];

///////////////////////////////////////////////////////////////////////


// creates class for each cube face, containing relevant manipulatable data
    class CubeFace {
        constructor(faceName) {
            this.faceName = faceName;

            this.anchor = document.createElement('a');
            this.anchor.style.position='absolute';
            this.anchor.title = faceName;

            this.img = document.createElement('img');
            this.img.style.filter = 'blur(4px)';

            this.anchor.appendChild(this.img);
        }

        setPreview(url, x, y) {
            this.img.src = url;
            this.anchor.style.left = `${x}px`;
            this.anchor.style.top = `${y}px`;
        }

        setDownload(url, fileExtension) {

            this.anchor.href = url;
            this.anchor.download = `${this.faceName}.${fileExtension}`;
            this.img.style.filter = '';
        }
    }

    function removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function getDataURL(imgData) {

        canvas.current.width = imgData.width;
        canvas.current.height = imgData.height;
        context.putImageData(imgData, 0, 0);
        return new Promise(resolve => {
            canvas.current.toBlob(blob => resolve(URL.createObjectURL(blob)), 'image/png', 0.92);
        });
    }

    const facePositions = {
        pz: {x: 1, y: 1},
        nz: {x: 3, y: 1},
        px: {x: 2, y: 1},
        nx: {x: 0, y: 1},
        py: {x: 1, y: 0},
        ny: {x: 1, y: 2}
    };

    async function loadImage() {
        const file = fileState[0];

        if (!file) {
            return;
        }

        const img = new Image();

        img.src = URL.createObjectURL(file);

        await img.decode()

            const {width, height} = img;
            canvas.current.width = width;
            canvas.current.height = height;
            context.drawImage(img, 0, 0);

        const data = context.getImageData(0, 0, width, height);

        processImage(data);
        // });
    }

    // function addImageProcess(src){
    //     return new Promise((resolve,reject) => {
    //         let img = new Image()
    //         img.onload = () => {
    //             resolve({width:img.width,height:img.height})
    //             img.onerror = reject
    //             img.src = src
    //         }
    //     })
    // }

    function processImage(data) {
        removeChildren(facesRef.current);

        for (let worker of workers) {
            worker.terminate();
        }

        for (let [faceName, position] of Object.entries(facePositions)) {
            renderCubeFace(data, faceName, position);
        }
    }

    function renderCubeFace(data, faceName, position) {

        const face = new CubeFace(faceName);
        facesRef.current.appendChild(face.anchor);

        const options = {
            data: data,
            face: faceName,
            rotation: Math.PI * 180 / 180,
            interpolation: "lanczos",
          };


        const worker = new Worker('./src/pages/GenerateRoom/convert.js');

        const setDownload = ({data: imageData}) => {

            const extension = "png";

            getDataURL(imageData, extension)
            .then(url => {
                face.setDownload(url, extension)
            });

            finished++;

            if (finished === 6) {
                finished = 0;
                workers = [];
        }
    };

    const setPreview = ({data: imageData}) => {

        const x = imageData.width * position.x;
        const y = imageData.height * position.y;

        imageArrayData.push(imageData.data)

    getDataURL(imageData, 'png')
      .then(url => face.setPreview(url, x, y));

    worker.onmessage = setDownload;
    worker.postMessage(options);


    if(imageArrayData.length > 6){
        setImageArrayData([])
    }
  };

  worker.onmessage = setPreview;
  worker.postMessage(Object.assign({}, options, {
    maxWidth: 200,
    interpolation: 'linear',
  }));

  workers.push(worker);
}

    function handleFile(e){
        const files = Array.from(e.target.files)
        setFileState(files)
    }


    async function uploadBlobFromHrefToCloudinary(blobHref,count) {
        // Fetch the Blob content from the href
        const response = await fetch(blobHref);
        const blob = await response.blob();
      
        const formData = new FormData();
        formData.append('file', blob, `${positions[count]}${mapName}.png`); // Add a file name (e.g., 'image.png')
        formData.append('upload_preset', 'interiorLAP4'); // Replace with your actual upload preset
        formData.append("tags",`${mapName}-${positions[count]}`)
      
        try {
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/de2nposrf/image/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
      
          return response.data;
        } catch (error) {
          console.log('Error uploading image:', error);
        }
      }

    async function handleCubeMapSubmit(e){
        e.preventDefault()
    
        try {
            const imgs = facesRef.current.children
            console.log(imgs)
            let count = 0


            for(let img of imgs){
                const imgHref = img.href 
                uploadBlobFromHrefToCloudinary(imgHref,count).then(resp => {
                console.log("Upload Successful", resp);
                count += 1
            }
        )}
                


            // const blobHref = facesRef.current.children[0].href       
            

        } catch (error) {
            console.error(error);
        }
    }
    // https://api.cloudinary.com/v1_1/de2nposrf/image/upload


///////////////////////////////////////////////////////////////////////









    useEffect(() => {
        setContext(canvas.current.getContext("2d"))
    },[])

    useEffect(() => {
        try {
            loadImage()
        } catch (error) {
            console.log(error)
        }
    },[fileState])

    return (
        <div className="generator-container">
            {/* <input type="file" onChange={convertImage}/> */}
            <form onSubmit={handleCubeMapSubmit}>
                <input ref={imageInputRef} type="file" name='file' className='form-input' onChange={handleFile}/>
                <button type='submit'>Create</button>
            </form>
            <div id="cubemap" style={cubeMapStyle}>
                <output id="faces" ref={facesRef} ></output>
            </div>
            <canvas id="generateCanvas" ref={canvas} style={{"display":"none"}}></canvas>

        </div>
    )
}

export default GenerateRoom