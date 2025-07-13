import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import { getMessages, sendMessage } from "../controllers/message.controllers.js"

const messageRouter=express.Router()

messageRouter.post("/send/:receiver",isAuth,upload.single("image"),sendMessage)
messageRouter.get("/get/:receiver",isAuth,getMessages)
export default messageRouter