import express, { Request, Response } from 'express'
import axios from 'axios'

const router = express.Router()

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';
const MODEL = process.env.OLLAMA_MODEL || 'gemma3:4b';

router.post('/chat', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt in request body' })
        }

		console.log('-----llm request-----');
		
        const ollamaResponse = await axios.post(OLLAMA_API_URL, {
            model: MODEL,
            messages: [{ role: 'user', content: prompt }],
            stream: true
        }, {
            responseType: 'stream'
        })

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        ollamaResponse.data.pipe(res)

        ollamaResponse.data.on('error', (err: Error) => {
            console.error('Error in stream from Ollama:', err);
            res.status(500).end('Stream error');
        });

    } catch (error) {
        console.error('Error contacting Ollama API:', error)
        if (axios.isAxiosError(error)) {
            res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to connect to Ollama' })
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }
})

export default router 