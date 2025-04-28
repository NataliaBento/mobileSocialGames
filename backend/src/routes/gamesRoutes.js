import express, { json } from "express";
import cloudinary from "../lib/cloudinary.js";
import Game from "../models/Games.js";
import protectRoute from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", protectRoute, async(req, res) =>{
    try {
        const { title, caption, rating, image} = req.body;

        if (!image || !title || !caption || !rating) { 

            return res.status(400).json({message: "Por favor preencha todos os campos"});
        }

        //upando imagens no cloudinary
         const uploadResponse = await cloudinary.uploader.upload(image);
         const imageUrl = uploadResponse.secure_url

        //salvando no banco
        const newGame = new Game({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })

        await newGame.save()

        res.status(201).json(newGame)
          

    }catch (error) {
        console.log("Erro ao criar o jogo", error);
        res.status(500).json({message: error.message});
    }
})
export default router;