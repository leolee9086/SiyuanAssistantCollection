export const vec2OpenAiEmbeddingResonseObject = (vec,index) => {
    return  {
            embedding: vec,
            index: 0,
            object: "embedding",
        }   
}