import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/");
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix=Date.now()+"-"+Math.round(Math.random()*1e9);
        cb(null,uniqueSuffix+path.extname(file.originalname));
    }
})

const upload=multer({
    storage,
    limits:{
        fileSize:2*1024*1024
    },
    fileFilter:(req,file,cb)=>{
        const allowed=["image/jpeg","image/png","image/jpg"];
        if(allowed.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb(new Error("Tipo de arquivo inválido"));
        }
    }
});

export default upload;