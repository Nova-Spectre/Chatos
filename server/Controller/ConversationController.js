import Conversation from "../Model/Conversation.js";
import User from "../Model/Users.js"; // Assuming your user model file is named User.js

export const addmembers = async (req, res) => {
  const { memberId,senderId } = req.body;
     

  try {

    const existingConversation = await Conversation.findOne({
      members: { $in: [memberId] }
  });
  
  let conversation = null;
  if (existingConversation) {
      // If a conversation exists, reuse it
      conversation = existingConversation;
      console.log(`Existing Conversation`);
  } else {
      // If no conversation exists, create a new one
      conversation = new Conversation({ members: [memberId] });
      await conversation.save();
      console.log(`New Conversation`);
  }
  
  // Update sender's conversations
  const user = await User.findById(senderId);
  if (!user) {
      return res.status(404).json({ error: 'User not found' });
  }
  
  const updatedUser = await User.findByIdAndUpdate(senderId, { $push: { conversations: conversation._id } });
  console.log('Conversation ID:', conversation._id);
  console.log(updatedUser);
  
  return res.status(200).json({ message: 'Member added to conversation successfully', conversations: conversation._id });
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const getConversationbyID = async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
   const conversation = await Conversation.findById(conversationId);
 
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Log the conversation object for debugging
    console.log('Conversation:', conversation);

    // Send the conversation object as JSON response
    res.json(conversation);
  } catch (error) {
    console.error('Error finding conversation by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





