import express from "express";
import User from "../models/User.js"
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
   return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"})
}

router.post("/register", async (req, res) => {

    try{
        const {email, username, password} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({message: "Preencha todos os campos"});
        }

        if(password.length < 6) {
            return res.status(400).json({message: "Sua senha tem que conter pelo menos 6 dígitos"});
        }

        if(username.length < 3) {
            return res.status(400).json({message: "O nome de usuário deve conter pelo menos 3 dígitos"});
        }

        //validando se o usuário já existe 

      const existingEmail = await User.findOne({email});
      if (existingEmail) {
        return res.status(400).json({message: "Esse email já existe"});
      }

      const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({message: "Esse usuário já existe"});
        }

        //pegando um avatar aleatório API
        const profileImage = `https://api.dicebear.com/9.x/bottts/svg?seed=Jameson`;

        const user = new User ({
            email,
            username,
            password,
            profileImage,
        })

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage
            }
        })
    } catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({message: "Internal server error"});
    }
    
});

router.post("/login", async (req, res) => {
    res.send("login");
});

export default router;