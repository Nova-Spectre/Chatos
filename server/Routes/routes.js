import express from "express";
import { getuserbyId, loginUser,registerUser,searchUsers } from "../Controller/UserController.js";
import verifyToken from "../Middleware/Auth.js";
import { addmembers, getConversationbyID } from "../Controller/ConversationController.js";





const router=express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/add-users',addmembers);


router.get('/users/search', verifyToken, searchUsers);
router.get('/users/:userId',getuserbyId);
router.get('/conversations/:conversationId',getConversationbyID);

  



export default router;