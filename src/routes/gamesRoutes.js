import express, { json } from "express";
import cloudinary from "../lib/cloudinary.js";
import Game from "../models/Games.js";
import protectRoute from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", protectRoute, async(req, res) => {
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
}); 

router.get("/", protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page -1) * limit;
        
        const games = await Game.find()
        .sort({createdAt: -1}) //desc
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalGames = await Game.countDocuments();

        res.send({
            games, 
            currentPage: page,
            totalGames,
            totalGamePages: Math.ceil(totalGames / limit)
        })
    }catch (error) {
        console.log("Error in get all games routes", error);
        res.status(500).json({message: "Internal server error"});
    }
})

// pegando os jogos recomendados pelo usuário logado
router.get("/user", protectRoute, async (req, res) => {
    try{
        const games = await Game.find({ user: req.user._id}).sort({createdAt: -1});
        res.json(games);
    }catch (error) {
        console.error("Get user games error:", error.message);
        res.status(500).json({message: "Server error"});
    }
})

router.delete("/:id", protectRoute, async (req, res) => {
    try{
        const game = await Game.findById(req.params.id)
        if(!game) return res.status(404).json({message: "Jogo não encontado"});

        // verificando se usuário é o criador do game
        if(game.user.toString() !== req.user._id.toString()) return res.status(401).json({message: "Não autorizado"})

        //deletando imagem do cloudinary
        if(game.image && game.image.includes("cloudinary")) {
            try{
                const publicId = game.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }catch (deleteError) {
                console.log("Error deleting image from cloudinary", deleteError);
            }
        }

        await game.deleteOne();

        res.json({message: "Jogo deletado com sucesso"});
    }catch (error) {
        console.log("Erro em deletar jogo", error);
        res.status(500).json({message: "Internal server error"})
    }
})
export default router;