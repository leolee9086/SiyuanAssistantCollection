import fs from "../../../../polyfills/fs.js";
import { Encoder, Decoder } from "../../../../../static/msgpack@2.8.0.mjs";

 function serializeVectorsToImage(vectors, width, height) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const imageData = ctx.createImageData(width, height);
    let dataIdx = 0;
    for (let i = 0; i < vectors.length; i++) {
        // 假设 vectors[i] 是一个包含多个浮点数的数组
        const rgba = float32ArrayToRGBA(new Float32Array(vectors[i]));
        for (let j = 0; j < rgba.length; j++) {
            imageData.data[dataIdx++] = rgba[j];
        }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
}
function deserializeImageToVectors(imageSrc, width, height, vectorSize) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, width, height);
            const vectors = [];

            // 每个浮点数由4个字节表示，因此每个向量的字节长度是 vectorSize * 4
            const bytesPerVector = height * 4;

            for (let i = 0; i < imageData.data.length; i += bytesPerVector) {
                // 提取表示单个向量的字节
                const vectorBytes = imageData.data.subarray(i, i + bytesPerVector);
                // 将这些字节转换回浮点数数组
                const float32Array = RGBAtoFloat32Array(vectorBytes);
                // 将转换后的浮点数数组添加到向量数组中
                vectors.push(float32Array);
            }

            resolve(vectors);
        };
        img.onerror = () => reject(new Error('Image loading error'));
        img.src = imageSrc;
    });
}


function float32ArrayToRGBA(float32Array) {
    // 创建一个与浮点数组等长的缓冲区，但每个浮点数用4个字节表示
    const buffer = new ArrayBuffer(float32Array.length * 4);
    // 创建一个视图，用于以32位浮点数的形式读写缓冲区
    const floatView = new Float32Array(buffer);
    // 创建一个视图，用于以8位无符号整数的形式读写缓冲区
    const uint8View = new Uint8Array(buffer);

    // 将浮点数数组复制到浮点视图中
    floatView.set(float32Array);

    // 现在，uint8View包含了浮点数的字节表示
    // 每个浮点数占用4个字节，对应RGBA四个通道
    return uint8View;
}
function RGBAtoFloat32Array(rgbaArray) {
    // 确保输入的数组长度是4的倍数
    if (rgbaArray.length % 4 !== 0) {
        throw new Error('The length of the RGBA array should be a multiple of 4.');
    }

    // 创建一个缓冲区，其大小与输入的RGBA数组相同
    const buffer = new ArrayBuffer(rgbaArray.length);
    // 创建一个视图，用于以8位无符号整数的形式读写缓冲区
    const uint8View = new Uint8Array(buffer);
    // 创建一个视图，用于以32位浮点数的形式读写缓冲区
    const floatView = new Float32Array(buffer);

    // 将RGBA数组复制到8位整数视图中
    uint8View.set(rgbaArray);

    // 现在，floatView包含了原始的32位浮点数
    return floatView;
}
// 测试用例
function testFloat32ArrayToRGBAConversion() {
    // 创建一个包含随机浮点数的 Float32Array
    const originalFloat32Array = new Float32Array([0.1, 0.5, 0.9, 1.0]);

    // 将浮点数数组转换为 RGBA 数组
    const rgbaArray = float32ArrayToRGBA(originalFloat32Array);

    // 将 RGBA 数组转换回浮点数数组
    const convertedFloat32Array = RGBAtoFloat32Array(rgbaArray);

    // 检查转换前后的数组是否相同
    let arraysAreEqual = true;
    for (let i = 0; i < originalFloat32Array.length; i++) {
        if (originalFloat32Array[i] !== convertedFloat32Array[i]) {
            arraysAreEqual = false;
            break;
        }
    }

    // 输出测试结果
    console.log(`Original Float32Array: ${originalFloat32Array}`);
    console.log(`Converted Float32Array: ${convertedFloat32Array}`);
    console.log(`The arrays are ${arraysAreEqual ? 'identical' : 'not identical'} after conversion.`);
}

async function serializeVectorsToMsgPack(vectors) {
    const encoder = new Encoder();
    const encodedData = await encoder.encode(vectors);
    await fs.writeFile('/temp/temp.msgpack', new Uint8Array(encodedData));
}
async function testSerializationConvergence(vectors, width, height) {
    let currentVectors = vectors;
    let identical = true;
    let lastVectors
    let imageDataUrl
    for (let i = 0; i < 2; i++) {
        // 序列化
         imageDataUrl = await serializeVectorsToImage(currentVectors, width, height);

        // 反序列化
        lastVectors= currentVectors;
        currentVectors = await deserializeImageToVectors(imageDataUrl, width, height, vectors[0].length);

        // 比较
        console.log(`Iteration ${i + 1}: The vectors are ${identical ? 'identical' : 'not identical'} after serialization and deserialization.`);

        if (!identical) {
            console.log(`Discrepancy found. ${i}.`);
        }
    }

    if (identical) {
        console.log('After 1024 iterations, the serialization and deserialization process is convergent.');
    } else {
        console.log('The serialization and deserialization process is not convergent after 1024 iterations.');
    }
    calculateErrorMetrics(lastVectors, vectors);
    const blob = await (await fetch(imageDataUrl)).blob();

    // 将Blob转换为ArrayBuffer
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // 假设fs polyfill可以接受Buffer类型，将ArrayBuffer转换为Buffer
    const buffer = Buffer.from(arrayBuffer);

    // 使用fs polyfill写入文件
    await fs.writeFile('/temp/temp.png', buffer);
    await serializeVectorsToMsgPack(buffer)
}

function generateRandomVectors(numVectors, vectorSize) {
    const vectors = [];
    for (let i = 0; i < numVectors; i++) {
        const vector = new Float32Array(vectorSize); // 使用Float32Array来存储32位浮点数
        for (let j = 0; j < vectorSize; j++) {
            vector[j] = Math.random(); // 直接赋值，不需要四舍五入
        }
        vectors.push(Array.from(vector)); // 将Float32Array转换为普通数组
    }
    return vectors;
}

// 定义向量的数量和每个向量的大小
const numVectors = 40000; // 例如，100个向量
const vectorSize = 1024; // 每个向量包含4个32位浮点数

// 生成随机的32位浮点数向量
const vectors = generateRandomVectors(numVectors, vectorSize);

// 运行测试函数
testSerializationConvergence(vectors, numVectors, vectorSize);


function calculateErrorMetrics(originalVectors, deserializedVectors) {
    let sumSquaredError = 0;
    let sumAbsoluteError = 0;
    let maxAbsoluteError = 0;
    let relativeErrorSum = 0;
    let count = 0;

    for (let i = 0; i < originalVectors.length; i++) {
        for (let j = 0; j < originalVectors[i].length; j++) {
            const originalValue = originalVectors[i][j];
            const deserializedValue = deserializedVectors[i][j];
            const difference = originalValue - deserializedValue;
            sumSquaredError += difference ** 2;
            sumAbsoluteError += Math.abs(difference);
            maxAbsoluteError = Math.max(maxAbsoluteError, Math.abs(difference));
            relativeErrorSum += (originalValue !== 0) ? Math.abs(difference) / Math.abs(originalValue) : 0;
            count++;
        }
    }

    const mse = sumSquaredError / count;
    const rmse = Math.sqrt(mse);
    const mae = sumAbsoluteError / count;
    const maxError = maxAbsoluteError;
    const meanRelativeError = relativeErrorSum / count;

    console.log(`MSE: ${mse}`);
    console.log(`RMSE: ${rmse}`);
    console.log(`MAE: ${mae}`);
    console.log(`Max Absolute Error: ${maxError}`);
    console.log(`Mean Relative Error: ${meanRelativeError}`);
}

// 使用示例
