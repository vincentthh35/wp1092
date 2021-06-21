import UserModel from './models/User'
import ChatBoxModel from './models/ChatBox'

const makeName = (name, to) => {
    return [name, to].sort().join('_');
};

const validateUser = async (name) => {
    const existing = await UserModel.findOne({ name });
    if (existing) return existing;
    return new UserModel({ name }).save();
};
  
const validateChatBox = async (name, participants) => {
    let box = await ChatBoxModel.findOne({ name });
    if (!box) box = await new ChatBoxModel({ name, users: participants }).save();
    return box
      .populate('users')
      .populate({ path: 'messages', populate: 'sender' })
      .execPopulate();
};
  
export { makeName, validateUser, validateChatBox } 