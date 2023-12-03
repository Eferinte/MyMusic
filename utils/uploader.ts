export const upload = (successCb?:(e:any)=>any)=>{
    const el =  document.createElement("input")
    el.type = "file"
    el.accept =".flac,.mp3,.wav"
    el.click()
    el.onchange=successCb
}