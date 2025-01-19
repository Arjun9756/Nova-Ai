import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
const router = express.Router();

router.post('/getResponse', async (req, res) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = req.body.prompt
    if(!prompt){
        res.status(400).json({
            message:"Enter Your Query",
            status:false,
            APIadvice:"Enter Your Query"
        })
        return;
    }

    try {
        const result = await model.generateContent(prompt);
        if(result){
            res.status(200).json({
                request:"Success",
                text: result.response.text(),
                status:true,
                APIadvice:"Try to ask in more concise way"
            })
        } else {
            res.status(400).json({
                message:"Error while generating response",
                status:false,
                APIadvice:"Try again later"
            })
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({
            message:"Error while generating response",
            status:false,
            APIadvice:"Try again later"
        })
    }
});

export default router;