import User from "../Model/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Conversation from "../Model/Conversation.js";
import validator from 'validator';


dotenv.config();

export const registerUser=async(req,res)=>{
    try{
        const {username,email,password,friends,userStatus}=req.body;

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //create new user
        const newUser = new User({
            username,email,password:hashedPassword,friends,userStatus
        });

        await newUser.save();
        res.status(201).json({message:'User registered successfully'});
        console.log(`User Created :${newUser}`);


    }catch(err){
        res.status(500).json({message:'Server Error'});
        console.log(`${err}`);
    }
};


export const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
          return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      // Send user data along with the token
      res.json({
          token,
          user: {
              _id: user._id,
              // Include other user data fields here if needed
          }
      });
  } catch (err) {
      console.error('Login Error:', err);
      res.status(500).json({ message: 'Server Error' });
  }
}


  // export const findUser= async (req, res) => {
  //   const { userId } = req.params;

  //   if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
  //     return res.status(400).json({ message: 'Invalid userId format' });
  //   }

  //   try {
  //     const user = await User.findById(userId);

  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }

  //     res.json(user);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // }

  // Other controller methods can be added here




// UserController.js
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: new RegExp(query, 'i') } // Case-insensitive username search
    }).select('username'); // Select only username for suggestions
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//getuserbyId

export const getuserbyId = async (req, res) => {
  const userId = req.params.userId;

  // Validate userId format
  if (!validator.isMongoId(userId)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // res.json(user);
    res.json({ ...user.toObject(), conversationIds: user.conversations});
  } catch (error) {
    console.error('Error finding user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const addFriend = async (req, res) => {
    try {
      const { friendId } = req.body;
      const userId = req.user._id; // Assuming you have middleware to extract user from token
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.addFriend(friendId);
  
      res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }


  export const fetchConversationforUser=async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find the user's conversations
      const conversations = await Conversation.find({ members: userId }).populate('members');
  
      res.json(conversations);
    } catch (error) {
    
  };  console.error('Error fetching conversations:', error);
      res.status(500).json({ message: 'Internal server error' });
    }



