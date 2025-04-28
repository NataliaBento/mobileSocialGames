import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async(req, res, next) => {

    try {
        //pegar token
        const token = req.header("Authorization").replace("Bearer", "");
        if (!token) return res.status(401).json({message: "Sem token autenticado, acesso negado"})
        
        //conferi token
        const decoded = jwt.verify(token, process.env.JWT.SECRET);

        //achando usuário
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) return res.status(401).json({message: "Token inválido"});

        req.user = user;
        next();
    }catch (error) {
        console.error("Authentication error", error.message);
        res.status(401).json({message: "Token inválido"});
    }
}

export default protectRoute;