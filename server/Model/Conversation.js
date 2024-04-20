import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });
  

const conversationSchema = new mongoose.Schema({
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    Messages:[messageSchema],
},
{timestamps:true}
);

conversationSchema.index({ members: 1 }, { unique: true }); // Ensure members are unique
conversationSchema.index({ _id: 1 }, { unique: true }); 


const Conversation=mongoose.model('Conversation',conversationSchema);

export default Conversation;