import { Response } from 'express';
import { Conversation } from '../models/Conversation';
import type { AuthRequest } from '../types/express';

export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { recipientId } = req.params;

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      $or: [
        { participants: [req.user._id, recipientId] },
        { participants: [recipientId, req.user._id] }
      ]
    }).populate('participants', 'username isOnline');

    if (conversation) {
      return res.json(conversation);
    }

    // Create new conversation if none exists
    conversation = new Conversation({
      participants: [req.user._id, recipientId],
      messages: []
    });

    await conversation.save();
    await conversation.populate('participants', 'username isOnline');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    res.status(500).json({ message: 'Error handling conversation' });
  }
};

export const createConversation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { recipientId } = req.body;

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      $or: [
        { participants: [req.user._id, recipientId] },
        { participants: [recipientId, req.user._id] }
      ]
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    // Create new conversation
    const conversation = new Conversation({
      participants: [req.user._id, recipientId],
      messages: []
    });

    await conversation.save();
    await conversation.populate('participants', 'username isOnline');

    res.status(201).json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error creating conversation' });
  }
}; 